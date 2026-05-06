from django.urls import path
from api.views.auth_views import (
    send_email_otp_view,
    send_phone_otp_view,
    verify_email_otp_view,
    verify_phone_otp_view,
    register_view,
    login_user
)


urlpatterns = [
  path("login/", login_user),
    path("send-email-otp/", send_email_otp_view),
    path("send-phone-otp/", send_phone_otp_view),
    path("verify-email-otp/", verify_email_otp_view),
    path("verify-phone-otp/", verify_phone_otp_view),
    path("register/", register_view),
]