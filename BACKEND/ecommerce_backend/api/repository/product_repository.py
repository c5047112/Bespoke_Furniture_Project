from api.models.product_model import Product, ProductImage


def create_product(data):
    return Product.objects.create(**data)


def get_all_products():
    return Product.objects.all()


def get_active_products():
    return Product.objects.filter(is_active=True)


def get_product_by_id(product_id):
    return Product.objects.filter(id=product_id).first()


def save_product(product):
    product.save()
    return product


def soft_delete_product(product):
    product.is_active = False
    product.save()
    return product


# 🖼 Save Images
def create_product_image(product, image):
    return ProductImage.objects.create(product=product, image=image)

from api.models.category_model import Category

def get_or_create_category(name):
    category, _ = Category.objects.get_or_create(name=name)
    return category

def get_product_by_id(product_id):
    return Product.objects.filter(id=product_id).first()


def delete_product_image_by_id(image_id):
    img = ProductImage.objects.filter(id=image_id).first()

    if img:
        img.delete()