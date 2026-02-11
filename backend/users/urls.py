from rest_framework.routers import DefaultRouter

from users.views import CartItemViewSet, ComparisonViewSet, FavoriteViewSet, ProfileViewSet

router = DefaultRouter()
router.register("profile", ProfileViewSet, basename="profile")
router.register("favorites", FavoriteViewSet, basename="favorites")
router.register("comparisons", ComparisonViewSet, basename="comparisons")
router.register("cart", CartItemViewSet, basename="cart")

urlpatterns = router.urls
