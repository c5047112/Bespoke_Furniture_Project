from api.repository.user_repo import get_user_by_id
from api.models.product_model import Product
from api.models.cart_model import Cart, CartItem


def add_to_cart(product_id, quantity, user_id):
    user = get_user_by_id(user_id)

    if not user:
        raise ValueError("User not found")

    product = Product.objects.get(id=product_id)

    cart, _ = Cart.objects.get_or_create(user=user)

    cart_item = CartItem.objects.filter(cart=cart, product=product).first()

    if cart_item:
        cart_item.quantity += quantity
        cart_item.save()
    else:
        CartItem.objects.create(cart=cart, product=product, quantity=quantity)

    return True


# ✅ FULL CART (IMPORTANT)
def get_cart_details(user_id):
    user = get_user_by_id(user_id)

    if not user:
        return None

    cart, _ = Cart.objects.get_or_create(user=user)

    return cart


def update_quantity(item_id, quantity):
    item = CartItem.objects.get(id=item_id)
    item.quantity = quantity
    item.save()
    return item


def remove_item(item_id):
    CartItem.objects.filter(id=item_id).delete()