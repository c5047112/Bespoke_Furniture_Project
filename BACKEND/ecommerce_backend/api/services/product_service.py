from api.repository.product_repository import (
    create_product,
    get_all_products,
    get_product_by_id,
    save_product,
    create_product_image,
    delete_product_image_by_id
)

# ➕ Add Product
from api.repository.category_repository import get_or_create_category
from api.repository.product_repository import (
    create_product,
    create_product_image
)

def add_product_service(data, images):
    
    # ✅ Handle category from text
    category_name = data.pop("category", None)
    category = None

    if category_name:
        category = get_or_create_category(category_name)

    product = create_product({
        **data,
        "category": category
    })

    # 🖼 Images
    for img in images:
        create_product_image(product, img)

    return product, "Product created"


# 📄 Get Products
def get_products_service():
    return get_all_products()


# 🔁 Toggle Active
def toggle_product_service(product_id):
    product = get_product_by_id(product_id)

    if not product:
        return None, "Not found"

    product.is_active = not product.is_active
    save_product(product)

    return product, "Status updated"

def update_product_service(product_id, data, files, deleted_images):
    product = get_product_by_id(product_id)

    if not product:
        return None

    # ✏️ Update fields
    product.name = data.get("name", product.name)
    product.description = data.get("description", product.description)
    product.price = data.get("price", product.price)
    product.stock = data.get("stock", product.stock)
    product.length = data.get("length", product.length)
    product.width = data.get("width", product.width)
    product.height = data.get("height", product.height)

    save_product(product)

    # 🔥 DEBUG (IMPORTANT)
    print("Deleted Images Raw:", deleted_images)

    # ✅ FIX: ensure proper list
    if deleted_images:
        for img_id in deleted_images:
            try:
                img_id = int(img_id)  # 🔥 FIX HERE
                delete_product_image_by_id(img_id)
            except Exception as e:
                print("Delete Error:", e)

    # ➕ Add new images
    new_images = files.getlist("images")
    for img in new_images:
        create_product_image(product, img)

    return product


from api.repository.product_repository import get_product_by_id

def get_product_by_id_service(product_id):
    return get_product_by_id(product_id)

from api.repository.product_repository import get_active_products

# 📄 Get Active Products (USER SIDE)
from django.db.models import Q
from api.models.product_model import Product


def get_active_products_service(search=None, categories=None, min_price=None, max_price=None):

    products = Product.objects.filter(is_active=True)

    # 🔍 SEARCH
    if search:
        products = products.filter(
            Q(name__icontains=search) |
            Q(description__icontains=search)
        )

    # 📂 CATEGORY (MULTI)
    if categories:
        products = products.filter(category__name__in=categories)

    # 💰 PRICE
    if min_price:
        products = products.filter(price__gte=min_price)

    if max_price:
        products = products.filter(price__lte=max_price)

    return products.order_by("-id")