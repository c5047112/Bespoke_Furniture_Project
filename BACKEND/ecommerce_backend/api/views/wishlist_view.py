from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models.wishlist_model import Wishlist, WishlistItem
from api.models.product_model import Product
from api.serializers.WishlistSerializer import WishlistSerializer


# ➕ ADD TO WISHLIST
@api_view(["POST"])
def add_to_wishlist(request):
    user_id = request.data.get("user_id")
    product_id = request.data.get("product_id")

    user = User.objects.filter(id=user_id).first()
    wishlist, _ = Wishlist.objects.get_or_create(user=user)

    # prevent duplicates
    if WishlistItem.objects.filter(wishlist=wishlist, product_id=product_id).exists():
        return Response({"success": True, "message": "Already added"})

    WishlistItem.objects.create(
        wishlist=wishlist,
        product_id=product_id
    )

    return Response({"success": True, "message": "Added to wishlist"})


# 📄 GET WISHLIST
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models.wishlist_model import Wishlist
from api.models.user_model import User
from api.serializers.WishlistSerializer import WishlistSerializer


@api_view(["GET"])
def get_wishlist(request, user_id):
    try:
        user = User.objects.get(id=user_id)

        wishlist, _ = Wishlist.objects.get_or_create(user=user)

        serializer = WishlistSerializer(
            wishlist,
            context={"request": request}
        )

        return Response({
            "success": True,
            "data": serializer.data
        })

    except User.DoesNotExist:
        return Response({
            "success": False,
            "message": "User not found",
            "data": {"items": []}
        })



# ❌ REMOVE ITEM
@api_view(["DELETE"])
def remove_from_wishlist(request, item_id):
    item = WishlistItem.objects.filter(id=item_id).first()

    if item:
        item.delete()

    return Response({"success": True, "message": "Removed"})