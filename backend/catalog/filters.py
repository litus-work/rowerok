import django_filters

from catalog.models import Product


class ProductFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    brand = django_filters.BaseInFilter(field_name="brand", lookup_expr="in")
    frame_size = django_filters.BaseInFilter(field_name="frame_size", lookup_expr="in")
    wheel_size = django_filters.BaseInFilter(field_name="wheel_size", lookup_expr="in")
    frame_material = django_filters.BaseInFilter(field_name="frame_material", lookup_expr="in")
    brake_type = django_filters.BaseInFilter(field_name="brake_type", lookup_expr="in")
    fork_type = django_filters.BaseInFilter(field_name="fork_type", lookup_expr="in")
    gears = django_filters.BaseInFilter(field_name="gears", lookup_expr="in")
    condition = django_filters.BaseInFilter(field_name="condition", lookup_expr="in")
    availability = django_filters.BaseInFilter(field_name="availability", lookup_expr="in")

    class Meta:
        model = Product
        fields = [
            "category",
            "brand",
            "frame_size",
            "wheel_size",
            "frame_material",
            "brake_type",
            "fork_type",
            "gears",
            "condition",
            "availability",
            "price_min",
            "price_max",
        ]
