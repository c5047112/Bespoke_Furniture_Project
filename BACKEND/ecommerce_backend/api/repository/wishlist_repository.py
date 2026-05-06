# api/repository/wishlist_repository.py

from api.models.wishlist_model import Wishlist, WishlistItem


def get_or_create_wishlist(user):
    wishlist, _ = Wishlist.objects.get_or_create(user=user)
    return wishlist


def add_to_wishlist(user, product):
    wishlist = get_or_create_wishlist(user)

    # avoid duplicate
    if not WishlistItem.objects.filter(wishlist=wishlist, product=product).exists():
        WishlistItem.objects.create(wishlist=wishlist, product=product)

    return wishlist


def get_wishlist(user):
    return Wishlist.objects.filter(user=user).first()


def delete_wishlist_item(item_id):
    item = WishlistItem.objects.filter(id=item_id).first()
    if item:
        item.delete()