from api.models import User

# 📄 Get All Users
def get_all_users():
    return User.objects.all()


# 🔍 Get User by ID
def get_user_by_id(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None

def get_user_by_email(email):
    return User.objects.filter(email=email).first()

def get_user_by_phone(phone):
    return User.objects.filter(phone=phone).first()

def save_user(user):
    user.save()

from api.models.user_model import User
from django.contrib.auth.hashers import make_password

def create_user(user_data):
    """
    Create a new user in DB
    """
    user = User.objects.create(
        name=user_data["name"],
        email=user_data["email"],
        phone=user_data["phone"],
        password=make_password(user_data["password"]),
        role=user_data.get("role", "CUSTOMER")
    )
    
    return user

def get_user_by_phone(phone):
    return User.objects.filter(phone=phone).first()



def get_first_user():
    return User.objects.first()