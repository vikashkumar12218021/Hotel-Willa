from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    BookingViewSet,
    DashboardView,
    ImageViewSet,
    OccasionViewSet,
    PlaneClassViewSet,
    RegisterView,
    ResortPackageViewSet,
    RoomViewSet,
    TableViewSet,
    HotelWillaTokenObtainPairView,
)

router = DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'tables', TableViewSet)
router.register(r'resorts', ResortPackageViewSet)
router.register(r'plane-classes', PlaneClassViewSet)
router.register(r'occasions', OccasionViewSet)
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'images', ImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', HotelWillaTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

