from api.models.category_model import Category


def create_category(data):
    return Category.objects.create(**data)


def get_all_categories():
    return Category.objects.all()


def get_category_by_id(category_id):
    return Category.objects.filter(id=category_id).first()

from api.models.category_model import Category

def get_or_create_category(name):
    category, created = Category.objects.get_or_create(name=name)
    return category