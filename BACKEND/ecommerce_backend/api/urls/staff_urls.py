from django.urls import path
from api.views.staff_views import *

urlpatterns = [
    path("add/", add_staff_view),
    path("", list_staff_view),
    path("available/", available_staff_view),
    path("<int:staff_id>/update/", update_staff_view),
    path("<int:staff_id>/delete/", delete_staff_view),
    path("login/", staff_login_view),
]