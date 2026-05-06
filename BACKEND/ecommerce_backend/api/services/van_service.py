from api.repository.van_repository import *

def add_van(data):
    return create_van(data)

def list_vans():
    return get_all_vans()

def list_available_vans():
    return get_available_vans()

def edit_van(van_id, data):
    van = get_van_by_id(van_id)
    if not van:
        return {"success": False, "error": "Van not found"}

    update_van(van, data)
    return {"success": True, "data": van}


def remove_van(van_id):
    van = get_van_by_id(van_id)
    if not van:
        return {"success": False, "error": "Van not found"}

    delete_van(van)
    return {"success": True, "message": "Van deleted"}


def change_van_availability(van_id, status):
    van = get_van_by_id(van_id)
    if not van:
        return {"success": False, "error": "Van not found"}

    update_van(van, {"availability": status})
    return {"success": True, "message": "Updated"}