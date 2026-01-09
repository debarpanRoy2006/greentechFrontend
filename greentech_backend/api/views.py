from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
import requests
import os
from dotenv import load_dotenv

# Import your models
from .models import AqiLog, CarbonLog, EnergyLog, UserProfile, ImpactLog
from .serializers import UserSerializer

load_dotenv()

# ==========================================
# 1. AUTHENTICATION (Register & Login)
# ==========================================

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def trainer_auth(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"status": "error", "message": "Missing credentials"}, status=400)

    # Django's built-in password checker
    user = authenticate(username=username, password=password)

    if user is not None:
        # Create profile if it doesn't exist yet (Safety check)
        UserProfile.objects.get_or_create(user=user)
        
        return Response({
            "status": "success",
            "username": user.username,
            "message": f"Welcome back, {user.username}!"
        })
    else:
        return Response({"status": "error", "message": "Invalid Username or Password"}, status=401)

@api_view(['POST'])
def dashboard_login(request):
    return Response({"message": "Dashboard login successful (mock)."})

# ==========================================
# 2. HELPER FUNCTIONS
# ==========================================

def get_user_from_request(request):
    # Try to get user from logged-in session, or fallback to first user for Hackathon demo
    if request.user.is_authenticated:
        return request.user
    return User.objects.first()

def award_xp(user, amount):
    if not user: return None
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    profile.current_xp += amount
    if profile.current_xp >= profile.next_level_xp:
        profile.current_xp -= profile.next_level_xp
        profile.level += 1
        profile.next_level_xp = int(profile.next_level_xp * 1.2)
    
    profile.save()
    return profile

# ==========================================
# 3. USER PROFILE & BADGES
# ==========================================

@api_view(['GET'])
def get_user_profile(request):
    user = get_user_from_request(request)
    
    # Safety: If no user exists in DB yet, return Guest data
    if not user:
        return Response({"username": "Guest", "level": 1, "currentXP": 0, "badges": []})

    profile, created = UserProfile.objects.get_or_create(user=user)
    
    all_badges = [
        {"id": 1, "name": "Starter", "icon": "🌱", "desc": "Initiated EcoDex"},
        {"id": 2, "name": "Recycler", "icon": "♻️", "desc": "Logged a recycling action"},
        {"id": 3, "name": "Solar", "icon": "☀️", "desc": "Energy saver"},
        {"id": 4, "name": "Hydro", "icon": "💧", "desc": "Mission: Save 100L of water"},
        {"id": 5, "name": "Wind", "icon": "🌬️", "desc": "Mission: Support wind energy"},
        {"id": 6, "name": "Bio", "icon": "🍂", "desc": "Mission: Create compost"},
    ]
    
    badge_data = []
    # Ensure badges list is valid
    current_badges = profile.badges if profile.badges else []
    
    for b in all_badges:
        is_unlocked = b['name'] in current_badges
        # Auto-unlock Starter
        if b['name'] == "Starter" and not is_unlocked:
            current_badges.append("Starter")
            profile.badges = current_badges
            profile.save()
            is_unlocked = True
        
        badge_data.append({**b, "unlocked": is_unlocked, "date": "2025" if is_unlocked else "LOCKED"})
        
    return Response({
        "username": user.username,
        "level": profile.level,
        "currentXP": profile.current_xp,
        "nextLevelXP": profile.next_level_xp,
        "badges": badge_data
    })

# ==========================================
# 4. GAME FEATURES (Impact, AQI, Etc.)
# ==========================================

@api_view(['POST'])
def log_impact(request):
    action = request.data.get('action')
    user = get_user_from_request(request)
    
    ImpactLog.objects.create(action=action)
    
    xp_gain = 50 
    if action == 'plant_tree': xp_gain = 100
    if action == 'recycle': xp_gain = 30
    if action == 'battle_win': xp_gain = 100
    
    updated_profile = award_xp(user, xp_gain)
    
    if updated_profile:
        current_badges = updated_profile.badges
        if action == 'recycle' and "Recycler" not in current_badges:
            current_badges.append("Recycler")
            updated_profile.badges = current_badges
            updated_profile.save()
            
        return Response({
            "message": f"Action Logged! +{xp_gain} XP",
            "new_xp": updated_profile.current_xp,
            "new_level": updated_profile.level
        })
    return Response({"message": "Action Logged (Guest)"})

@api_view(['GET'])
def get_aqi(request): # Renamed to match URL (get_aqi)
    lat = request.GET.get('lat', '24.7485')
    lon = request.GET.get('lon', '92.7879')
    TOKEN = os.getenv('WAQI_API_TOKEN') 
    
    if not TOKEN:
        return Response({"city": "Config Error", "aqi": 0, "status": "Missing Token"})

    try:
        url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={TOKEN}"
        data = requests.get(url).json()
        if data['status'] == 'ok':
            aqi = data['data']['aqi']
            city = data['data']['city']['name']
            status = "Good"
            if aqi > 50: status = "Moderate"
            if aqi > 100: status = "Unhealthy"
            
            AqiLog.objects.create(city=city, aqi_value=aqi, status=status)
            return Response({"city": city, "aqi": aqi, "status": status})
    except Exception as e:
        print(f"AQI Error: {e}")
        pass
        
    return Response({"city": "Offline", "aqi": 0, "status": "Unknown"})

@api_view(['POST'])
def log_transport(request):
    mode = request.data.get('mode')
    distance = float(request.data.get('distance', 1.0))
    impact = distance * 0.2
    
    user = get_user_from_request(request)
    
    # Check if user exists before assigning
    user_to_assign = user if user else None

    CarbonLog.objects.create(user_id=user_to_assign, mode=mode, distance_km=distance, carbon_saved_kg=impact)
    return Response({"saved_amount": f"{impact:.2f}", "message": "Logged!"})

@api_view(['POST'])
def calculate_energy(request):
    EnergyLog.objects.create(appliance_name="Device", watts=100, hours_used=1, cost_inr=10)
    return Response({"total_cost": "₹10.00", "tip": "Use LED bulbs!"})