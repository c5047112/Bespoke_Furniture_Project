from django.urls import path
from api.views.product_views import *
from api.views.categories_view import *

urlpatterns = [

    # Admin PRODUCTS
    path("add/", add_product),
    path("all/", get_products),
    path("<int:product_id>/", get_product_By_Id),   
    path("update/<int:product_id>/", update_product),  
    path("toggle/<int:product_id>/", toggle_product),


    # USER API (NEW)
    path("active/", get_active_products_view),
    path("active/", get_active_products_view),
    path("categories/", get_categories_view),
]