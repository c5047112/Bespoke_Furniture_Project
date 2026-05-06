from api.repository.staff_repository import *
from api.models.order_model import Order  

def add_staff(data):
    return create_staff(data)

def list_staff():
    return get_all_staff()

def list_available_staff():
    return get_available_staff()

def change_staff_availability(staff_id, status):
    staff = get_staff_by_id(staff_id)
    if not staff:
        return {"success": False, "error": "Staff not found"}

    update_staff(staff, {"availability": status})
    return {"success": True, "message": "Updated"}

def edit_staff(staff_id, data):
    staff = get_staff_by_id(staff_id)
    if not staff:
        return {"success": False, "error": "Staff not found"}

    update_staff(staff, data)
    return {"success": True, "data": staff}


def remove_staff(staff_id):
    staff = get_staff_by_id(staff_id)
    if not staff:
        return {"success": False, "error": "Staff not found"}

    delete_staff(staff)
    return {"success": True, "message": "Staff deleted"}


def start_delivery(order_id, staff_id):
    order = Order.objects.filter(id=order_id).first()

    if not order or order.driver.id != staff_id:
        return {"success": False, "error": "Unauthorized"}

    if order.delivery_status != "ASSIGNED":
        return {"success": False, "error": "Order not assigned"}

    order.delivery_status = "OUT_FOR_DELIVERY"
    order.status = "SHIPPED"
    order.save()

    return {"success": True}


def start_delivery(order_id, staff_id):
    order = Order.objects.filter(id=order_id).first()

    if not order or order.driver.id != staff_id:
        return {"success": False, "error": "Unauthorized"}

    if order.delivery_status != "ASSIGNED":
        return {"success": False, "error": "Order not assigned"}

    order.delivery_status = "OUT_FOR_DELIVERY"
    order.status = "SHIPPED"
    order.save()

    return {"success": True}