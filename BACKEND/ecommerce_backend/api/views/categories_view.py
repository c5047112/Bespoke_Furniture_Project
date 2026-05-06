from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models.category_model import Category

@api_view(["GET"])
def get_categories_view(request):
    categories = Category.objects.all()

    data = [
        {
            "id": c.id,
            "name": c.name
        }
        for c in categories
    ]

    return Response({
        "success": True,
        "data": data
    })