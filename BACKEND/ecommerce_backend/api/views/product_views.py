from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services.product_service import (
    add_product_service,
    get_products_service,
    toggle_product_service
)
from api.serializers.Product_Serializers import ProductSerializer


# ➕ Add Product
@api_view(["POST"])
def add_product(request):
    data = request.data

    product_data = {
        "name": data.get("name"),
        "description": data.get("description"),
        "price": data.get("price"),
        "stock": data.get("stock"),
        "length": data.get("length"),
        "width": data.get("width"),
        "height": data.get("height"),
        "category": data.get("category"),  # ✅ TEXT now
    }

    images = request.FILES.getlist("images")

    product, msg = add_product_service(product_data, images)

    return Response({"success": True, "message": msg})

# 📄 Get Products
@api_view(["GET"])
def get_products(request):
    products = get_products_service()
    serializer = ProductSerializer(products, many=True, context={"request": request})
    return Response({"success": True, "data": serializer.data})


# 🔁 Toggle
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services.product_service import toggle_product_service
from api.serializers.Product_Serializers import ProductSerializer

@api_view(["PUT"])
def toggle_product(request, product_id):
    product, msg = toggle_product_service(product_id)

    if not product:
        return Response({"success": False, "error": msg}, status=404)

    serializer = ProductSerializer(product, context={"request": request})

    return Response({
        "success": True,
        "message": msg,
        "data": serializer.data   # ✅ IMPORTANT
    })

from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services.product_service import update_product_service
from api.serializers.Product_Serializers import ProductSerializer


@api_view(["PUT"])
def update_product(request, product_id):

    product = update_product_service(
        product_id,
        request.data,
        request.FILES,
        request.data.getlist("deleted_images")  # 👈 important
    )

    if not product:
        return Response({"success": False, "message": "Product not found"}, status=404)

    serializer = ProductSerializer(product, context={"request": request})

    return Response({
        "success": True,
        "data": serializer.data,
        "message": "Product updated successfully"
    })

from api.services.product_service import get_product_by_id_service

# 📄 Get Single Product
@api_view(["GET"])
def get_product_By_Id(request, product_id):
    product = get_product_by_id_service(product_id)

    if not product:
        return Response({"success": False, "message": "Not found"}, status=404)

    serializer = ProductSerializer(product, context={"request": request})

    return Response({
        "success": True,
        "data": serializer.data
    })


from api.services.product_service import get_active_products_service

# 👤 User - Get Active Products
@api_view(["GET"])
def get_active_products_view(request):

    search = request.GET.get("search")
    categories = request.GET.getlist("category")   # 👈 supports multiple
    min_price = request.GET.get("min_price")
    max_price = request.GET.get("max_price")

    products = get_active_products_service(
        search=search,
        categories=categories,
        min_price=min_price,
        max_price=max_price
    )

    serializer = ProductSerializer(
        products,
        many=True,
        context={"request": request}
    )

    return Response({
        "success": True,
        "data": serializer.data
    })
