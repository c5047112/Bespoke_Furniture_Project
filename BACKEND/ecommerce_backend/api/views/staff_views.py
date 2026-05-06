from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services.staff_service import *
from api.serializers.staff_serializer import StaffSerializer
from api.serializers.OrderSerializer import OrderSerializer


@api_view(["POST"])
def add_staff_view(request):
    staff = add_staff(request.data)
    return Response({
        "success": True,
        "data": StaffSerializer(staff).data
    })

@api_view(["GET"])
def list_staff_view(request):
    staff = list_staff()
    return Response({
        "success": True,
        "data": StaffSerializer(staff, many=True).data
    })

@api_view(["GET"])
def available_staff_view(request):
    staff = list_available_staff()
    return Response({
        "success": True,
        "data": StaffSerializer(staff, many=True).data
    })

@api_view(["PUT"])
def update_staff_view(request, staff_id):
    res = edit_staff(staff_id, request.data)

    if not res["success"]:
        return Response(res, status=404)

    return Response({
        "success": True,
        "data": StaffSerializer(res["data"]).data
    })


@api_view(["DELETE"])
def delete_staff_view(request, staff_id):
    res = remove_staff(staff_id)

    if not res["success"]:
        return Response(res, status=404)

    return Response(res)


from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models.staff_model import Staff

@api_view(["POST"])
def staff_login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    staff = Staff.objects.filter(email=email).first()

    if not staff:
        return Response({"success": False, "error": "Staff not found"})

    if not check_password(password, staff.password):
        return Response({"success": False, "error": "Invalid password"})

    return Response({
        "success": True,
        "staff_id": staff.id,
        "name": staff.name
    })


@api_view(["GET"])
def staff_orders_view(request, staff_id):
    orders = OrderSerializer.objects.filter(driver_id=staff_id).order_by("-id")

    return Response({
        "success": True,
        "data": OrderSerializer(orders, many=True).data
    })

