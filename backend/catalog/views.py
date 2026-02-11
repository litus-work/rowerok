from django.db.models import Max, Min
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from catalog.filters import ProductFilter
from catalog.models import Category, Product
from catalog.serializers import CategorySerializer, ProductCardSerializer, ProductDetailSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.select_related("parent").all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    pagination_class = None


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.select_related("category").prefetch_related("images").all()
    permission_classes = [permissions.AllowAny]
    filterset_class = ProductFilter
    search_fields = ("name_uk", "name_en", "brand", "description_uk", "description_en")
    ordering_fields = ("created_at", "price", "name_en")
    ordering = ("-created_at",)
    lookup_field = "slug"

    def get_serializer_class(self):
        return ProductDetailSerializer if self.action == "retrieve" else ProductCardSerializer

    @action(detail=False, methods=["get"])
    def filters(self, request):
        qs = self.filter_queryset(self.get_queryset())
        payload = {
            "price": qs.aggregate(min=Min("price"), max=Max("price")),
            "brands": list(qs.values_list("brand", flat=True).distinct()),
            "frame_sizes": list(qs.values_list("frame_size", flat=True).distinct()),
            "wheel_sizes": list(qs.values_list("wheel_size", flat=True).distinct()),
            "frame_materials": list(qs.values_list("frame_material", flat=True).distinct()),
            "brake_types": list(qs.values_list("brake_type", flat=True).distinct()),
            "fork_types": list(qs.values_list("fork_type", flat=True).distinct()),
            "gears": sorted(list(qs.values_list("gears", flat=True).distinct())),
            "conditions": list(qs.values_list("condition", flat=True).distinct()),
            "availabilities": list(qs.values_list("availability", flat=True).distinct()),
        }
        return Response(payload)


class CategoryProductsView(generics.ListAPIView):
    serializer_class = ProductCardSerializer
    permission_classes = [permissions.AllowAny]
    filterset_class = ProductFilter
    search_fields = ("name_uk", "name_en", "brand")
    ordering_fields = ("created_at", "price")

    def get_queryset(self):
        return (
            Product.objects.select_related("category")
            .prefetch_related("images")
            .filter(category__slug=self.kwargs["slug"])
        )
