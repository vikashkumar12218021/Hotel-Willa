import logging
from datetime import date, timedelta

from django.contrib.auth import get_user_model
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Booking, Image, Occasion, PlaneClass, ResortPackage, Room, Table
from .permissions import IsAdminOrReadOnly
from .serializers import (
    BookingSerializer,
    ImageSerializer,
    OccasionSerializer,
    PlaneClassSerializer,
    ResortPackageSerializer,
    RoomSerializer,
    TableSerializer,
    UserSerializer,
)

User = get_user_model()
logger = logging.getLogger(__name__)


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all().order_by('-created_at')
    serializer_class = ImageSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all().prefetch_related('images').order_by('room_number')
    serializer_class = RoomSerializer
    permission_classes = [IsAdminOrReadOnly]


class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all().prefetch_related('images').order_by('name')
    serializer_class = TableSerializer
    permission_classes = [IsAdminOrReadOnly]


class ResortPackageViewSet(viewsets.ModelViewSet):
    queryset = ResortPackage.objects.all().prefetch_related('images').order_by('title')
    serializer_class = ResortPackageSerializer
    permission_classes = [IsAdminOrReadOnly]


class PlaneClassViewSet(viewsets.ModelViewSet):
    queryset = PlaneClass.objects.all().prefetch_related('images').order_by('class_name')
    serializer_class = PlaneClassSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data or [])


class OccasionViewSet(viewsets.ModelViewSet):
    queryset = Occasion.objects.all().prefetch_related('images').order_by('title')
    serializer_class = OccasionSerializer
    permission_classes = [IsAdminOrReadOnly]


class BookingViewSet(mixins.CreateModelMixin,
                     mixins.ListModelMixin,
                     viewsets.GenericViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Booking.objects.select_related('user').order_by('-created_at')
        if self.request.user.is_staff:
            return qs
        return qs.filter(user=self.request.user)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class DashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, *args, **kwargs):
        total_rooms = Room.objects.count()
        total_resorts = ResortPackage.objects.count()
        total_bookings = Booking.objects.count()
        recent_bookings = Booking.objects.select_related('user').order_by('-created_at')[:5]
        serializer = BookingSerializer(recent_bookings, many=True)

        occupancy_rate = 0
        if total_rooms:
            last_30 = date.today() - timedelta(days=30)
            relevant = Booking.objects.filter(
                item_type=Booking.ITEM_ROOM,
                status__in=[Booking.STATUS_CONFIRMED, Booking.STATUS_PENDING],
                end_date__gte=last_30,
            )
            total_nights = sum(
                max((min(b.end_date, date.today()) - max(b.start_date, last_30)).days, 0)
                for b in relevant
            )
            denominator = total_rooms * 30
            occupancy_rate = round((total_nights / denominator) * 100, 2) if denominator else 0

        data = {
            'total_rooms': total_rooms,
            'total_resorts': total_resorts,
            'total_bookings': total_bookings,
            'occupancy_rate': occupancy_rate,
            'recent_bookings': serializer.data,
        }
        logger.info("Dashboard requested by %s", request.user)
        return Response(data)


class HotelWillaTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email or ''
        token['is_staff'] = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'is_staff': self.user.is_staff,
        }
        return data


class HotelWillaTokenObtainPairView(TokenObtainPairView):
    serializer_class = HotelWillaTokenObtainPairSerializer
