from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services.order_service import *
from api.models.user_model import User
from api.models.address_model import Address
from api.serializers.OrderSerializer import OrderSerializer
from api.serializers.van_serializer import VanSerializer


@api_view(["GET"])
def checkout_view(request, user_id, address_id):
    user = User.objects.get(id=user_id)
    address = Address.objects.get(id=address_id)

    cart = get_cart(user)

    total, tax, delivery = calculate_totals(cart)
    discount, coupon = apply_coupon(user, total)

    grand_total = total + tax + delivery - discount

    items = []
    for i in cart.items.all():
        items.append({
            "product_id": i.product.id,
            "name": i.product.name,
            "price": float(i.product.price),
            "quantity": i.quantity,
            "total_price": float(i.product.price * i.quantity),
            "image": request.build_absolute_uri(
                i.product.images.first().image.url
            ) if i.product.images.exists() else ""
        })

    return Response({
        "success": True,
        "data": {
            "items": items,
            "price_details": {
                "total": float(total),
                "tax": float(tax),
                "delivery": float(delivery),
                "discount": float(discount),
                "grand_total": float(grand_total)
            },
            "coupon": {
                "code": coupon.code if coupon else None,
                "discount_percent": coupon.discount_percent if coupon else 0
            },
            "address": {
                "name": address.name,
                "phone": address.phone,
                "address": address.address_line,
                "city": address.city,
                "state": address.state,
                "pincode": address.pincode
            }
        }
    })

from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models.user_model import User
from api.services.order_service import generate_otp
from django.core.mail import send_mail
import re


@api_view(["POST"])
def send_otp_view(request):
    user_id = request.data.get("user_id")
    identifier = request.data.get("identifier")  # email or phone

    user = User.objects.get(id=user_id)

    # ✅ Check if email or phone
    is_email = re.match(r"[^@]+@[^@]+\.[^@]+", identifier)

    if is_email:
        # ✅ Validate email matches user
        if user.email != identifier:
            return Response({"success": False, "error": "Email not matching with user"})

        otp = generate_otp(user)

        # 📧 SEND EMAIL
        send_mail(
            subject="Your OTP for Order",
            message=f"Your OTP is {otp}",
            from_email="your_email@gmail.com",
            recipient_list=[identifier],
            fail_silently=False,
        )

        return Response({"success": True, "message": "OTP sent to email"})

    else:
        # ✅ Validate phone
        if user.phone != identifier:
            return Response({"success": False, "error": "Phone not matching with user"})

        otp = generate_otp(user)

        # 📱 Console OTP
        print("OTP (PHONE):", otp)

        return Response({"success": True, "message": "OTP sent to phone (console)"})


@api_view(["POST"])
def confirm_order_view(request):
    res = confirm_order(
        request.data.get("user_id"),
        request.data.get("address_id"),
        request.data.get("otp"),
        request.data.get("identifier"), 
    )
    return Response(res)


@api_view(["GET"])
def order_history_view(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"success": False, "error": "User not found"}, status=404)

    orders = get_user_orders(user)

    data = []

    for order in orders:
        items = []
        for i in order.items.all():

            # ✅ GET ALL IMAGES
            images = []
            if i.product.images.exists():
                for img in i.product.images.all():
                    images.append(request.build_absolute_uri(img.image.url))

            items.append({
                "product_name": i.product.name,
                "quantity": i.quantity,
                "total_price": float(i.price * i.quantity),

                # ❌ OLD
                # "image": request.build_absolute_uri(...)

                # ✅ NEW
                "images": images
            })

        data.append({
            "id": order.id,
            "status": order.status,
            "payment_status": order.payment_status,
            "created_at": order.created_at,
            "items": items,
            "total_amount": float(order.total_price),
            "discount": float(order.discount),
            "final_amount": float(order.grand_total),
        })

    return Response({"success": True, "data": data})


# api/views/order_views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.services.order_service import assign_order, get_staff_orders
from api.serializers.OrderSerializer import OrderSerializer


@api_view(["POST"])
def assign_order_view(request, order_id):
    res = assign_order(
        order_id,
        request.data.get("driver_id"),
        request.data.get("van_id")
    )
    return Response(res)


@api_view(["GET"])
def staff_orders_view(request, staff_id):
    orders = get_staff_orders(staff_id)

    return Response({
        "success": True,
        "data": OrderSerializer(orders, many=True).data
    })

from api.models.order_model import Order  

@api_view(["GET"])
def list_all_orders_view(request):
    orders = Order.objects.select_related("driver", "van").all().order_by("-id")

    return Response({
        "success": True,
        "data": OrderSerializer(orders, many=True, context={"request": request}).data
    })

# @api_view(["POST"])
# def start_delivery_view(request, order_id):
#     res = start_delivery(order_id)
#     return Response(res)


# @api_view(["POST"])
# def complete_delivery_view(request, order_id):
#     res = complete_delivery(order_id)
#     return Response(res)

@api_view(["DELETE"])
def delete_order_view(request, order_id):
    res = delete_order(order_id)

    if not res["success"]:
        return Response(res, status=404)

    return Response(res)



@api_view(["GET"])
def get_order_detail_view(request, order_id):
    order = Order.objects.select_related("driver", "van").filter(id=order_id).first()

    if not order:
        return Response({"success": False, "error": "Not found"}, status=404)

    return Response({
        "success": True,
        "data": OrderSerializer(order, context={"request": request}).data
    })


@api_view(["GET"])
def suitable_vans_view(request, order_id):
    vans = get_suitable_vans(order_id)

    return Response({
        "success": True,
        "data": VanSerializer(vans, many=True).data
    })


from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models.order_model import Order
from api.serializers.OrderSerializer import OrderSerializer


@api_view(["GET"])
def user_orders_view(request, user_id):
    orders = Order.objects.filter(user_id=user_id).prefetch_related("items__product")

    serializer = OrderSerializer(
        orders,
        many=True,
        context={"request": request}
    )

    return Response({
        "success": True,
        "data": serializer.data
    })