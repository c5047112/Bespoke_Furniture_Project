# api/services/wishlist_service.py

from api.repository.wishlist_repository import (
    add_to_wishlist,
    get_wishlist,
    delete_wishlist_item
)
from api.repository.product_repository import get_product_by_id
from api.models.user_model import User


def add_to_wishlist_service(user_id, product_id):
    user = User.objects.filter(id=user_id).first()
    product = get_product_by_id(product_id)

    if not user or not product:
        return None

    return add_to_wishlist(user, product)


def get_wishlist_service(user_id):
    user = User.objects.filter(id=user_id).first()
    if not user:
        return None

    return get_wishlist(user)


def delete_wishlist_item_service(item_id):
    delete_wishlist_item(item_id)