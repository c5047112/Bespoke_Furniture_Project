from django.contrib import admin
from .models.temp_verification_model import TempVerification
from .models.user_model import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "role", "created_at")
    search_fields = ("name", "email", "phone")

@admin.register(TempVerification)
class TempVerificationAdmin(admin.ModelAdmin):
    list_display = ("email", "phone", "email_verified", "phone_verified", "created_at")
    search_fields = ("email", "phone")


from django.contrib import admin
from .models.product_model import Product, ProductImage
from .models.category_model import Category


# 🖼 Inline images inside Product
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


# 🪑 Product Admin
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "stock", "is_active", "category")
    list_filter = ("is_active", "category")
    search_fields = ("name", "sku")
    inlines = [ProductImageInline]


# 📂 Category Admin
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")


# ✅ Register models
admin.site.register(Product, ProductAdmin)
admin.site.register(Category, CategoryAdmin)


from api.models.staff_model import Staff

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "phone", "role", "availability", "created_at")
    list_filter = ("role", "availability")
    search_fields = ("name", "phone")


from api.models.van_model import Van

@admin.register(Van)
class VanAdmin(admin.ModelAdmin):
    list_display = ("id", "vehicle_number", "type", "availability", "created_at")
    list_filter = ("availability", "type")
    search_fields = ("vehicle_number",)