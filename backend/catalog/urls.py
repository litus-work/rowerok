from django.urls import path
from rest_framework.routers import DefaultRouter

from catalog.views import CategoryProductsView, CategoryViewSet, ProductViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="categories")
router.register("products", ProductViewSet, basename="products")

urlpatterns = router.urls + [
    path("categories/<slug:slug>/products/", CategoryProductsView.as_view(), name="category-products"),
]
