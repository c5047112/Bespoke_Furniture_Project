from api.models.staff_model import Staff

def create_staff(data):
    return Staff.objects.create(**data)

def get_all_staff():
    return Staff.objects.all().order_by("-id")

def get_available_staff():
    return Staff.objects.filter(availability="AVAILABLE")

def get_staff_by_id(staff_id):
    return Staff.objects.filter(id=staff_id).first()

def update_staff(staff, data):
    for key, value in data.items():
        setattr(staff, key, value)
    staff.save()
    return staff

def delete_staff(staff):
    staff.delete()