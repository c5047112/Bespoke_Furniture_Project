# api/repositories/order_repository.py
from api.models.order_model import Order, OrderItem
from api.models.cart_model import Cart
from api.models.coupon_model import Coupon
from api.models.otp import OTP


def get_cart(user):
    return Cart.objects.get(user=user)


def get_user_orders(user):
    return Order.objects.filter(user=user)


def create_order(data):
    return Order.objects.create(**data)


def create_order_item(data):
    return OrderItem.objects.create(**data)

def get_order_by_id(order_id):
    return Order.objects.select_related("driver", "van").filter(id=order_id).first()


def get_orders_by_driver(staff_id):
    return Order.objects.filter(driver_id=staff_id).order_by("-id")


def get_coupon(order_count):
    return Coupon.objects.filter(order_number=order_count).first()


def save_otp(user, code):
    return OTP.objects.create(
        email=user.email,
        phone=user.phone,
        otp=code,
        purpose="ORDER"
    )


def verify_otp(user, code):
    otp = OTP.objects.filter(
        otp=code,
        purpose="ORDER",
        is_verified=False
    ).last()

    if not otp:
        return False

    if otp.is_expired():
        return False

    otp.is_verified = True
    otp.save()

    return True



# Admin Functions
def get_all_orders():
    return Order.objects.select_related("driver", "van") \
        .prefetch_related("items__product") \
        .order_by("-id")



def update_order(order, data):
    for key, value in data.items():
        setattr(order, key, value)
    order.save()
    return order