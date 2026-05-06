from api.repository.user_repo import (
    get_all_users,
    get_user_by_id,
    save_user
)


# 📄 Get Users
def get_users_service():
    users = get_all_users()
    return users.values("id", "name", "email", "phone", "role", "is_active"), "Users fetched"


# 🔄 Activate / Deactivate User
def toggle_user_status_service(user_id):
    user = get_user_by_id(user_id)

    if not user:
        return None, "User not found"

    user.is_active = not user.is_active
    save_user(user)

    return user.id, "User status updated"

from api.models.user_model import User 

def get_logged_in_user(request):
    email = request.user.email
    try:
        return User.objects.get(email=email)
    except User.DoesNotExist:
        return None