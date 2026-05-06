# api/services/order_service.py
import random
from api.repository.order_repository import *
from api.models.user_model import User
from api.models.address_model import Address
from api.models.staff_model import Staff
from api.models.van_model import Van
from api.repository.staff_repository import get_staff_by_id, update_staff
from api.repository.van_repository import get_van_by_id, update_van
from api.repository.order_repository import *


import threading
import time
from django.db import transaction
from django.db.models import F


from decimal import Decimal

def calculate_totals(cart):
    total = sum(i.product.price * i.quantity for i in cart.items.all())

    # TAX
    if total < 5000:
        tax = total * Decimal("0.05")
    elif total < 10000:
        tax = total * Decimal("0.10")
    else:
        tax = total * Decimal("0.15")

    # DELIVERY
    if total < 5000:
        delivery = Decimal("100")
    elif total < 10000:
        delivery = Decimal("500")
    else:
        delivery = Decimal("1000")

    return total, tax, delivery



def apply_coupon(user, total):
    order_count = get_user_orders(user).count() + 1
    coupon = get_coupon(order_count)

    discount = 0
    if coupon and total >= coupon.min_order:
        discount = total * (coupon.discount_percent / 100)

    return discount, coupon


def generate_otp(user):
    code = str(random.randint(100000, 999999))
    save_otp(user, code)

    # 👉 simulate sending
    print("OTP:", code)

    return code


from django.db import transaction
from django.db.models import F
from api.models.user_model import User
from api.models.address_model import Address
from api.models.otp import OTP
from api.models.product_model import Product
from api.utils.email_service import send_invoice_email


def confirm_order(user_id, address_id, otp, identifier):
    user = User.objects.get(id=user_id)
    address = Address.objects.get(id=address_id)

    identifier = identifier.strip().lower()

    # ✅ OTP Verification
    if "@" in identifier:
        otp_obj = OTP.objects.filter(
            email=identifier,
            otp=otp,
            is_verified=False
        ).last()
    else:
        otp_obj = OTP.objects.filter(
            phone=identifier,
            otp=otp,
            is_verified=False
        ).last()

    if not otp_obj:
        return {"success": False, "error": "Invalid OTP"}

    if otp_obj.is_expired():
        return {"success": False, "error": "OTP expired"}

    otp_obj.is_verified = True
    otp_obj.save()

    # ✅ TRANSACTION START
    with transaction.atomic():

        cart = get_cart(user)

        if not cart.items.exists():
            return {"success": False, "error": "Cart is empty"}

        # 🔒 LOCK PRODUCTS
        product_ids = [item.product.id for item in cart.items.all()]
        products = Product.objects.select_for_update().filter(id__in=product_ids)
        product_map = {p.id: p for p in products}

        # ✅ STOCK CHECK
        for item in cart.items.all():
            product = product_map[item.product.id]

            if product.stock < item.quantity:
                return {
                    "success": False,
                    "error": f"Only {product.stock} left for {product.name}"
                }

        # ✅ CALCULATIONS
        total, tax, delivery = calculate_totals(cart)
        discount, coupon = apply_coupon(user, total)
        grand_total = total + tax + delivery - discount

        # ✅ CREATE ORDER (CONFIRMED)
        order = create_order({
            "user": user,
            "address": address,
            "total_price": total,
            "tax": tax,
            "delivery_charge": delivery,
            "discount": discount,
            "grand_total": grand_total,
            "payment_status": "PENDING",
            "status": "CONFIRMED",
        })



        # ✅ CREATE ORDER ITEMS + STOCK UPDATE
        for item in cart.items.all():
            product = product_map[item.product.id]

            create_order_item({
                "order": order,
                "product": product,
                "quantity": item.quantity,
                "price": product.price,
            })

            # 🔥 SAFE STOCK DECREMENT
            product.stock = F("stock") - item.quantity
            product.save()

        # ✅ CLEAR CART
        cart.items.all().delete()

    threading.Thread(target=send_invoice_email, args=(order,)).start()

    return {
        "success": True,
        "order_id": order.id,
        "message": "Order confirmed successfully"
    }




def auto_delivery_flow(order_id):
    order = get_order_by_id(order_id)

    if not order:
        return

    # ⏳ WAIT BEFORE START
    time.sleep(60)

    order.delivery_status = "OUT_FOR_DELIVERY"
    order.status = "SHIPPED"
    order.save()

    # ⏳ DYNAMIC DELIVERY TIME
    total_items = sum(i.quantity for i in order.items.all())
    time.sleep(30 * total_items)

    # ✅ COMPLETE DELIVERY
    order.mark_delivered()

    # 🔓 RELEASE RESOURCES
    if order.driver:
        update_staff(order.driver, {"availability": "AVAILABLE"})

    if order.van:
        update_van(order.van, {"availability": "AVAILABLE"})


# ✅ ASSIGN ORDER + START AUTO PROCESS
def assign_order(order_id, driver_id, van_id):

    order = get_order_by_id(order_id)

    if not order:
        return {"success": False, "error": "Order not found"}

    new_driver = get_staff_by_id(driver_id)
    new_van = get_van_by_id(van_id)

    if new_driver.availability != "AVAILABLE":
        return {"success": False, "error": "Driver busy"}

    if new_van.availability != "AVAILABLE":
        return {"success": False, "error": "Van busy"}

    # ✅ IMPORTANT: STORE OLD BEFORE CHANGE
    old_driver = order.driver
    old_van = order.van

    with transaction.atomic():

        # 🔓 STEP 1: RELEASE OLD RESOURCES
        if old_driver and old_driver.id != new_driver.id:
            update_staff(old_driver, {"availability": "AVAILABLE"})

        if old_van and old_van.id != new_van.id:
            update_van(old_van, {"availability": "AVAILABLE"})

        # 🚚 STEP 2: ASSIGN NEW
        order.driver = new_driver
        order.van = new_van
        order.status = "ASSIGNED"
        order.delivery_status = "ASSIGNED"
        order.save()

        # 🔒 STEP 3: LOCK NEW
        update_staff(new_driver, {"availability": "BUSY"})
        update_van(new_van, {"availability": "IN_USE"})

    # 🚀 START BACKGROUND THREAD
    threading.Thread(target=auto_delivery_flow, args=(order.id,)).start()

    return {"success": True}

# ✅ STAFF DASHBOARD DATA
def get_staff_orders(staff_id):
    return get_orders_by_driver(staff_id)



# def start_delivery(order_id):
#     order = Order.objects.filter(id=order_id).first()

#     if not order:
#         return {"success": False, "error": "Order not found"}

#     if order.delivery_status != "ASSIGNED":
#         return {"success": False, "error": "Order not assigned yet"}

#     order.delivery_status = "OUT_FOR_DELIVERY"
#     order.status = "SHIPPED"

#     order.save()

#     return {"success": True, "message": "Delivery started"}


# def complete_delivery(order_id):
#     order = Order.objects.filter(id=order_id).first()

#     if not order:
#         return {"success": False, "error": "Order not found"}

#     if order.delivery_status != "OUT_FOR_DELIVERY":
#         return {"success": False, "error": "Delivery not started"}

#     driver = order.driver
#     van = order.van

#     # ✅ FINAL STATE
#     order.delivery_status = "DELIVERED"
#     order.status = "DELIVERED"
#     order.payment_status = "SUCCESS"

#     order.save()

#     # 🔓 RELEASE RESOURCES
#     if driver:
#         update_staff(driver, {"availability": "AVAILABLE"})

#     if van:
#         update_van(van, {"availability": "AVAILABLE"})

#     return {"success": True, "message": "Delivery completed"}

from api.repository.staff_repository import update_staff
from api.repository.van_repository import update_van
from api.models.order_model import Order

def delete_order(order_id):
    order = Order.objects.select_related("driver", "van").filter(id=order_id).first()

    if not order:
        return {"success": False, "error": "Order not found"}

    driver = order.driver
    van = order.van

    # ✅ STEP 1: Release resources BEFORE delete
    if driver:
        update_staff(driver, {"availability": "AVAILABLE"})

    if van:
        update_van(van, {"availability": "AVAILABLE"})

    # ✅ STEP 2: Delete order
    order.delete()

    return {"success": True, "message": "Order deleted and resources released"}


def calculate_order_weight(order):
    total_weight = 0

    for item in order.items.all():
        total_weight += item.product.weight * item.quantity

    return total_weight


from api.models.van_model import Van

def get_suitable_vans(order_id):
    order = Order.objects.prefetch_related("items__product").filter(id=order_id).first()

    if not order:
        return []

    total_weight = calculate_order_weight(order)

    return Van.objects.filter(
        availability="AVAILABLE",
        capacity__gte=total_weight
    )