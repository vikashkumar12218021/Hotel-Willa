from django.contrib import admin

from .models import (
    Booking,
    Image,
    Occasion,
    PlaneClass,
    ResortPackage,
    Room,
    Table,
)


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'url', 'created_at')
    search_fields = ('title', 'alt_text')


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_number', 'room_type', 'capacity', 'price_per_night')
    search_fields = ('room_number', 'room_type_display')
    list_filter = ('room_type',)
    filter_horizontal = ('images',)


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ('name', 'seats', 'price', 'table_type')
    search_fields = ('name',)
    list_filter = ('table_type',)
    filter_horizontal = ('images',)


@admin.register(ResortPackage)
class ResortPackageAdmin(admin.ModelAdmin):
    list_display = ('title', 'price')
    search_fields = ('title',)
    filter_horizontal = ('images',)


@admin.register(PlaneClass)
class PlaneClassAdmin(admin.ModelAdmin):
    list_display = ('class_name', 'price')
    search_fields = ('class_name',)
    filter_horizontal = ('images',)


@admin.register(Occasion)
class OccasionAdmin(admin.ModelAdmin):
    list_display = ('title', 'applicable_items')
    search_fields = ('title',)
    filter_horizontal = ('images',)


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'item_type', 'item_id', 'start_date', 'end_date', 'status')
    list_filter = ('item_type', 'status')
    search_fields = ('user__username',)
