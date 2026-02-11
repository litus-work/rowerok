from django.contrib import admin

from users.models import CartItem, Comparison, Favorite, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "phone", "is_staff")
    search_fields = ("username", "email", "phone")


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "created_at")
    list_select_related = ("user", "product")


@admin.register(Comparison)
class ComparisonAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "created_at")
    list_select_related = ("user", "product")


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "quantity", "updated_at")
    list_select_related = ("user", "product")
