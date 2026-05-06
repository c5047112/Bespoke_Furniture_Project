from api.models.cart_model import Cart, CartItem
from api.models.product_model import Product

def get_or_create_cart(user):
    # user is now a custom User instance
    return Cart.objects.get_or_create(user=user)

def get_cart_items(cart):
    return cart.items.all()

def get_product(product_id):
    return Product.objects.get(id=product_id)

def get_or_create_cart_item(cart, product):
    return CartItem.objects.get_or_create(cart=cart, product=product)

def save_cart_item(item):
    item.save()

def delete_cart_item(item_id):
    CartItem.objects.filter(id=item_id).delete()

def get_cart_item(item_id):
    return CartItem.objects.get(id=item_id)