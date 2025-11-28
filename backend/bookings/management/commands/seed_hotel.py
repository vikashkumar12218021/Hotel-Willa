from datetime import date, timedelta
from pathlib import Path

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from bookings.models import (
    Booking,
    Image,
    Occasion,
    PlaneClass,
    ResortPackage,
    Room,
    Table,
)


User = get_user_model()


class Command(BaseCommand):
    help = "Seed the database with Hotel Willa demo content."

    def handle(self, *args, **options):
        self.stdout.write("Seeding Hotel Willa data...")
        admin, _ = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@hotelwilla.com', 'is_staff': True, 'is_superuser': True},
        )
        if not admin.password:
            admin.set_password('AdminPass123!')
            admin.save()
        elif not admin.check_password('AdminPass123!'):
            admin.set_password('AdminPass123!')
            admin.save()

        guest, _ = User.objects.get_or_create(
            username='guest',
            defaults={'email': 'guest@hotelwilla.com'},
        )
        if not guest.password:
            guest.set_password('GuestPass123!')
            guest.save()

        images = self._seed_images()
        self._seed_rooms(images)
        self._seed_tables(images)
        self._seed_resorts(images)
        self._seed_plane_classes(images)
        self._seed_occasions(images)
        self._seed_bookings(admin, guest)

        self.stdout.write(self.style.SUCCESS("Hotel Willa data ready."))

    def _seed_images(self):
        image_specs = [
            ('Serene Suite', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'),
            ('Modern Table', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'),
            ('Beach Resort', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'),
            ('Luxury Plane', 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef'),
            ('Celebration', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17'),
        ]
        images = []
        for title, url in image_specs:
            img, _ = Image.objects.get_or_create(
                title=title,
                defaults={'external_url': url, 'alt_text': title},
            )
            images.append(img)
        return images

    def _seed_rooms(self, images):
        if Room.objects.exists():
            return
        room_data = [
            ('101', Room.SINGLE, 180, 1, 'Minimalist single haven'),
            ('102', Room.DOUBLE, 220, 2, 'Bright double comfort'),
            ('201', Room.SUITE, 360, 3, 'Signature Willa suite'),
            ('202', Room.DELUXE, 420, 4, 'Deluxe skyline escape'),
            ('301', Room.SUITE, 380, 3, 'Sunset suite'),
            ('302', Room.DELUXE, 450, 4, 'Panorama deluxe'),
            ('401', Room.SINGLE, 190, 1, 'Urban single'),
            ('402', Room.DOUBLE, 240, 2, 'Garden double'),
        ]
        for idx, (number, rtype, price, capacity, description) in enumerate(room_data):
            room = Room.objects.create(
                room_number=number,
                room_type=rtype,
                price_per_night=price,
                capacity=capacity,
                description=description,
                amenities='WiFi,Smart TV,Mini Bar,Workspace',
            )
            room.images.set(images[:2] if idx % 2 == 0 else images[2:])

    def _seed_tables(self, images):
        if Table.objects.exists():
            return
        data = [
            ('Garden Two', 2, 90, '2', 'Intimate garden seating'),
            ('Atrium Four', 4, 120, '4', 'Open atrium table'),
            ('Lounge Eight', 8, 200, '8', 'Private lounge dining'),
            ('Chef Counter', 4, 180, '4', 'Interactive chef counter'),
        ]
        for idx, (name, seats, price, ttype, description) in enumerate(data):
            table = Table.objects.create(
                name=name,
                seats=seats,
                price=price,
                table_type=ttype,
                description=description,
            )
            table.images.set(images[idx % len(images):] or images)

    def _seed_resorts(self, images):
        if ResortPackage.objects.exists():
            return
        data = [
            ('Wellness Escape', 950, 'Three-night spa retreat with treatments'),
            ('Adventure Seaside', 1250, 'Coastal hikes, kayaking, and dining'),
            ('Family Celebration', 1400, 'Suite stay, dining credits, kids club'),
        ]
        for idx, (title, price, description) in enumerate(data):
            resort = ResortPackage.objects.create(
                title=title,
                price=price,
                description=description,
                amenities='Spa Access,Meals,Private Guide',
            )
            resort.images.set(images[idx % len(images):] or images)

    def _seed_plane_classes(self, images):
        if PlaneClass.objects.exists():
            return
        data = [
            (PlaneClass.ECONOMY, 320, 'Comfort economy cabin'),
            (PlaneClass.BUSINESS, 820, 'Flat beds and lounge access'),
            (PlaneClass.FIRST, 1500, 'Private suites and concierge'),
        ]
        for idx, (name, price, description) in enumerate(data):
            plane = PlaneClass.objects.create(
                class_name=name,
                price=price,
                description=description,
                amenities='Priority Boarding,Gourmet Dining',
            )
            plane.images.set(images[idx % len(images):] or images)

    def _seed_occasions(self, images):
        if Occasion.objects.exists():
            return
        data = [
            ('Weddings', 'Tailored ceremony and reception setups.'),
            ('Corporate Retreat', 'Hybrid work & recharge experiences.'),
            ('Anniversaries', 'Signature dining and spa pairing.'),
            ('Friends Getaway', 'Suites plus curated local tours.'),
        ]
        for idx, (title, description) in enumerate(data):
            occasion = Occasion.objects.create(
                title=title,
                description=description,
                applicable_items='rooms,resorts,dining',
            )
            occasion.images.set(images[idx % len(images):] or images)

    def _seed_bookings(self, admin, guest):
        if Booking.objects.exists():
            return
        room = Room.objects.first()
        resort = ResortPackage.objects.first()
        if not room or not resort:
            return
        start = date.today() + timedelta(days=5)
        Booking.objects.create(
            user=guest,
            item_type=Booking.ITEM_ROOM,
            item_id=room.id,
            start_date=start,
            end_date=start + timedelta(days=3),
            guests=2,
            status=Booking.STATUS_CONFIRMED,
        )
        Booking.objects.create(
            user=admin,
            item_type=Booking.ITEM_RESORT,
            item_id=resort.id,
            start_date=start,
            end_date=start + timedelta(days=5),
            guests=2,
            status=Booking.STATUS_PENDING,
        )

