from api.models.user_model import User


def get_admin_by_email(email):
    return User.objects.filter(email=email, role="ADMIN").first()


def get_admin_by_phone(phone):
    return User.objects.filter(phone=phone, role="ADMIN").first()


def get_admin_by_id(admin_id):
    return User.objects.filter(id=admin_id, role="ADMIN").first()