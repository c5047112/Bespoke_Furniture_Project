from django.urls import path
from api.views.van_views import *

urlpatterns = [
    path("add/", add_van_view),
    path("", list_vans_view),
    path("available/", available_vans_view),
    path("<int:van_id>/update/", update_van_view),
    path("<int:van_id>/delete/", delete_van_view),
]