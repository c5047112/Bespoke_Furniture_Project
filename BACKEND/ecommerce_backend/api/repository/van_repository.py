from api.models.van_model import Van

def create_van(data):
    return Van.objects.create(**data)

def get_all_vans():
    return Van.objects.all().order_by("-id")

def get_available_vans():
    return Van.objects.filter(availability="AVAILABLE")

def get_van_by_id(van_id):
    return Van.objects.filter(id=van_id).first()

def update_van(van, data):
    for key, value in data.items():
        setattr(van, key, value)
    van.save()
    return van

def delete_van(van):
    van.delete()