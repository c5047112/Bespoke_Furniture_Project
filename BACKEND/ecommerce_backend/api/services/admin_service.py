from django.contrib.auth.hashers import check_password
from api.repository.admin_repository import (
    get_admin_by_email,
    get_admin_by_phone
)


def admin_login_service(identifier, password):
    admin = get_admin_by_email(identifier) or get_admin_by_phone(identifier)

    if not admin:
        return None, "Admin not found"

    if not check_password(password, admin.password):
        return None, "Invalid password"

    admin_data = {
        "id": admin.id,
        "name": admin.name,
        "email": admin.email,
        "phone": admin.phone,
        "role": admin.role
    }

    return admin_data, "Admin login successful"