from django.contrib import admin
from django.urls import path
from api import views  # Imports your views.py

urlpatterns = [
    path('admin/', admin.site.urls),

    # --- AUTHENTICATION (These were missing!) ---
    # Fixes the 404 on Register
    path('api/register/', views.RegisterView.as_view(), name='register'),
    
    # Fixes the Login 404
    path('api/trainer-auth/', views.trainer_auth, name='trainer-auth'),
    
    # Fixes the Dashboard Login 404
    path('api/login/', views.dashboard_login, name='dashboard_login'),

    # --- GAME FEATURES ---
    # Feature 1: AQI
    path('api/aqi/', views.get_aqi, name='get_aqi'), # Renamed to match typical view name
    
    # Feature 2: Distance/Carbon
    path('api/log-transport/', views.log_transport, name='log_transport'),
    
    # Feature 3: Appliance Bill
    path('api/calc-energy/', views.calculate_energy, name='calc_energy'),

    # --- PROFILE & LOGS ---
    path('api/profile/', views.get_user_profile, name='get_user_profile'),
    path('api/log-impact/', views.log_impact, name='log_impact'),
]