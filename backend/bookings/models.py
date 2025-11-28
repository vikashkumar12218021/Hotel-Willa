from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Image(TimeStampedModel):
    title = models.CharField(max_length=255, blank=True)
    file = models.ImageField(upload_to='uploads/', blank=True, null=True)
    external_url = models.URLField(blank=True)
    alt_text = models.CharField(max_length=255, blank=True)

    def __str__(self) -> str:
        return self.title or self.alt_text or f"Image {self.pk}"

    @property
    def url(self) -> str:
        if self.file and hasattr(self.file, 'url'):
            return self.file.url
        return self.external_url


class Room(TimeStampedModel):
    SINGLE = 'single'
    DOUBLE = 'double'
    SUITE = 'suite'
    DELUXE = 'deluxe'

    ROOM_TYPES = [
        (SINGLE, 'Single'),
        (DOUBLE, 'Double'),
        (SUITE, 'Suite'),
        (DELUXE, 'Deluxe'),
    ]

    room_number = models.CharField(max_length=32, unique=True)
    room_type = models.CharField(max_length=16, choices=ROOM_TYPES)
    room_type_display = models.CharField(max_length=32, blank=True)
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2)
    capacity = models.PositiveIntegerField(default=1)
    description = models.TextField()
    amenities = models.TextField(blank=True)
    images = models.ManyToManyField(Image, related_name='rooms', blank=True)

    def save(self, *args, **kwargs):
        if not self.room_type_display:
            self.room_type_display = dict(self.ROOM_TYPES).get(self.room_type, self.room_type.title())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Room {self.room_number} ({self.get_room_type_display()})"


class Table(TimeStampedModel):
    TABLE_TYPES = [('2', '2 seats'), ('4', '4 seats'), ('8', '8 seats')]

    name = models.CharField(max_length=120)
    seats = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    table_type = models.CharField(max_length=2, choices=TABLE_TYPES)
    description = models.TextField()
    images = models.ManyToManyField(Image, related_name='tables', blank=True)

    def __str__(self):
        return f"{self.name} ({self.seats} seats)"


class ResortPackage(TimeStampedModel):
    title = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField()
    amenities = models.TextField(blank=True)
    images = models.ManyToManyField(Image, related_name='resorts', blank=True)

    def __str__(self):
        return self.title


class PlaneClass(TimeStampedModel):
    ECONOMY = 'Economy'
    BUSINESS = 'Business'
    FIRST = 'First'

    CLASS_CHOICES = [
        (ECONOMY, 'Economy'),
        (BUSINESS, 'Business'),
        (FIRST, 'First Class'),
    ]

    class_name = models.CharField(max_length=32, choices=CLASS_CHOICES)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    amenities = models.TextField(blank=True)
    description = models.TextField(blank=True)
    images = models.ManyToManyField(Image, related_name='plane_classes', blank=True)

    def __str__(self):
        return f"{self.class_name} Class"


class Occasion(TimeStampedModel):
    title = models.CharField(max_length=150)
    description = models.TextField()
    applicable_items = models.CharField(max_length=255, blank=True)
    images = models.ManyToManyField(Image, related_name='occasions', blank=True)

    def __str__(self):
        return self.title


class Booking(TimeStampedModel):
    ITEM_ROOM = 'room'
    ITEM_TABLE = 'table'
    ITEM_RESORT = 'resort'
    ITEM_PLANE = 'plane'

    ITEM_CHOICES = [
        (ITEM_ROOM, 'Room'),
        (ITEM_TABLE, 'Table'),
        (ITEM_RESORT, 'Resort'),
        (ITEM_PLANE, 'Plane Class'),
    ]

    STATUS_PENDING = 'pending'
    STATUS_CONFIRMED = 'confirmed'
    STATUS_CANCELLED = 'cancelled'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_CONFIRMED, 'Confirmed'),
        (STATUS_CANCELLED, 'Cancelled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    item_type = models.CharField(max_length=20, choices=ITEM_CHOICES)
    item_id = models.PositiveIntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    guests = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.item_type} #{self.item_id}"

    def clean(self):
        if self.start_date >= self.end_date:
            raise ValidationError("End date must be after start date")
        self.validate_availability()

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def validate_availability(self):
        overlapping = Booking.objects.filter(
            item_type=self.item_type,
            item_id=self.item_id,
            status__in=[self.STATUS_PENDING, self.STATUS_CONFIRMED],
        ).exclude(pk=self.pk).filter(
            start_date__lt=self.end_date,
            end_date__gt=self.start_date,
        )
        if overlapping.exists():
            raise ValidationError("Selected dates are not available for this item.")

    @property
    def total_nights(self):
        return (self.end_date - self.start_date).days
