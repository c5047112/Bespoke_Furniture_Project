from django.urls import path
from api.views.address_view import add_address, get_addresses

urlpatterns = [
    path("add/", add_address),
    path("<str:user_id>/", get_addresses),
]