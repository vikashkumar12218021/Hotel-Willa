from typing import Any, Optional

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import UploadedFile
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import (
    Booking,
    Image,
    Occasion,
    PlaneClass,
    ResortPackage,
    Room,
    Table,
)


User = get_user_model()


class ImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ['id', 'title', 'alt_text', 'url', 'file', 'external_url']
        extra_kwargs = {
            'file': {'write_only': True, 'required': False},
            'external_url': {'required': False, 'allow_blank': True},
        }

    def get_url(self, obj):
        return obj.url

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        file = attrs.get('file')
        external_url = attrs.get('external_url')
        if not file and not external_url:
            raise serializers.ValidationError("Provide an image file or an external URL.")
        if file:
            self._validate_file(file)
        return attrs

    def _validate_file(self, file: UploadedFile) -> None:
        max_bytes = 5 * 1024 * 1024  # 5 MB
        if file.size > max_bytes:
            raise serializers.ValidationError("Image file exceeds the 5 MB size limit.")
        content_type: Optional[str] = getattr(file, 'content_type', None)
        if content_type and not content_type.startswith('image/'):
            raise serializers.ValidationError("Uploaded file must be an image.")


class BaseWithImagesSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    image_ids = serializers.PrimaryKeyRelatedField(
        source='images',
        queryset=Image.objects.all(),
        many=True,
        write_only=True,
        required=False,
    )

    class Meta:
        abstract = True


class RoomSerializer(BaseWithImagesSerializer):
    class Meta:
        model = Room
        fields = [
            'id',
            'room_number',
            'room_type',
            'room_type_display',
            'price_per_night',
            'capacity',
            'description',
            'amenities',
            'images',
            'image_ids',
            'created_at',
            'updated_at',
        ]


class TableSerializer(BaseWithImagesSerializer):
    class Meta:
        model = Table
        fields = [
            'id',
            'name',
            'seats',
            'price',
            'table_type',
            'description',
            'images',
            'image_ids',
            'created_at',
            'updated_at',
        ]


class ResortPackageSerializer(BaseWithImagesSerializer):
    class Meta:
        model = ResortPackage
        fields = [
            'id',
            'title',
            'price',
            'description',
            'amenities',
            'images',
            'image_ids',
            'created_at',
            'updated_at',
        ]


class PlaneClassSerializer(BaseWithImagesSerializer):
    class Meta:
        model = PlaneClass
        fields = [
            'id',
            'class_name',
            'price',
            'amenities',
            'description',
            'images',
            'image_ids',
            'created_at',
            'updated_at',
        ]


class OccasionSerializer(BaseWithImagesSerializer):
    class Meta:
        model = Occasion
        fields = [
            'id',
            'title',
            'description',
            'applicable_items',
            'images',
            'image_ids',
            'created_at',
            'updated_at',
        ]


class BookingSerializer(serializers.ModelSerializer):
    item_name = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id',
            'item_type',
            'item_id',
            'start_date',
            'end_date',
            'guests',
            'status',
            'notes',
            'created_at',
            'updated_at',
            'item_name',
        ]
        read_only_fields = ['status', 'created_at', 'updated_at', 'item_name']

    def get_item_name(self, obj):
        mapping = {
            Booking.ITEM_ROOM: Room.objects.filter(pk=obj.item_id).first(),
            Booking.ITEM_TABLE: Table.objects.filter(pk=obj.item_id).first(),
            Booking.ITEM_RESORT: ResortPackage.objects.filter(pk=obj.item_id).first(),
            Booking.ITEM_PLANE: PlaneClass.objects.filter(pk=obj.item_id).first(),
        }
        item = mapping.get(obj.item_type)
        return (
            getattr(item, 'title', None)
            or getattr(item, 'name', None)
            or getattr(item, 'class_name', None)
            or getattr(item, 'room_number', None)
        )

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        else:
            raise serializers.ValidationError("Authentication required to create a booking.")
        try:
            return super().create(validated_data)
        except DjangoValidationError as exc:
            detail = getattr(exc, 'message_dict', None) or exc.messages or ['Unable to create booking.']
            raise serializers.ValidationError(detail)

    def validate(self, attrs):
        item_type = attrs.get('item_type')
        item_id = attrs.get('item_id')
        model_map = {
            Booking.ITEM_ROOM: Room,
            Booking.ITEM_TABLE: Table,
            Booking.ITEM_RESORT: ResortPackage,
            Booking.ITEM_PLANE: PlaneClass,
        }
        model = model_map.get(item_type)
        if not model or not model.objects.filter(pk=item_id).exists():
            raise serializers.ValidationError("Selected item is not available.")
        return attrs


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

