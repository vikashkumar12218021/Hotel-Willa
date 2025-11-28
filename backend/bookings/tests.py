from datetime import date, timedelta

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import PlaneClass, Room


User = get_user_model()


class HotelWillaAPITests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser('admin', 'admin@example.com', 'adminpass123')
        self.standard_user = User.objects.create_user('guest', 'guest@example.com', 'guestpass123')
        self.room = Room.objects.create(
            room_number='101',
            room_type=Room.SINGLE,
            price_per_night=199.99,
            capacity=2,
            description='Cozy room',
            amenities='WiFi,TV',
        )
        self.plane_class = PlaneClass.objects.create(
            class_name=PlaneClass.BUSINESS,
            price=899.99,
            amenities='Flat bed,Priority boarding',
            description='Business class test cabin',
        )

    def test_rooms_endpoint_returns_array(self):
        response = self.client.get('/api/rooms/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.json()
        data = payload.get('results') if isinstance(payload, dict) else payload
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)

    def test_booking_prevents_overlap(self):
        self.client.force_authenticate(user=self.standard_user)
        payload = {
            'item_type': 'room',
            'item_id': self.room.id,
            'start_date': str(date.today() + timedelta(days=1)),
            'end_date': str(date.today() + timedelta(days=3)),
            'guests': 2,
        }
        first = self.client.post('/api/bookings/', payload, format='json')
        self.assertEqual(first.status_code, status.HTTP_201_CREATED)

        second = self.client.post('/api/bookings/', payload, format='json')
        self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)

    def test_dashboard_returns_defaults(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('total_rooms', data)
        self.assertIn('recent_bookings', data)

    def test_plane_classes_endpoint_returns_plain_array(self):
        response = self.client.get('/api/plane-classes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)

    def test_booking_requires_authentication(self):
        payload = {
            'item_type': 'room',
            'item_id': self.room.id,
            'start_date': str(date.today() + timedelta(days=1)),
            'end_date': str(date.today() + timedelta(days=2)),
            'guests': 2,
        }
        response = self.client.post('/api/bookings/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
