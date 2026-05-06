from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services.cart_service import add_to_cart, get_cart_details, update_quantity, remove_item
from api.serializers.Cart_Serializers import CartSerializer
from django.views.decorators.csrf import csrf_exempt


@api_view(["POST"])
@csrf_exempt
def add_to_cart_view(request):
    try:
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))
        user_id = request.data.get("user_id")

        add_to_cart(product_id, quantity, user_id)

        return Response({"success": True, "message": "Added to cart"})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=400)


# ✅ GET FULL CART
@api_view(["GET"])
def get_cart_view(request, user_id):
    cart = get_cart_details(user_id)

    if not cart:
        return Response({"success": False, "error": "Cart not found"}, status=404)

    serializer = CartSerializer(cart)
    return Response({"success": True, "data": serializer.data})


# ✅ UPDATE QUANTITY
@api_view(["PUT"])
def update_cart_item_view(request, item_id):
    quantity = request.data.get("quantity")

    update_quantity(item_id, quantity)

    return Response({"success": True, "message": "Updated"})


# ✅ DELETE ITEM
@api_view(["DELETE"])
def delete_cart_item_view(request, item_id):
    remove_item(item_id)

    return Response({"success": True, "message": "Deleted"})