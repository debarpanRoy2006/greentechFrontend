from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AqiLog, CarbonLog, EnergyLog, UserProfile, ImpactLog
import requests
import os
from dotenv import load_dotenv

# Force load the .env file
load_dotenv()

# ... (Helper functions remain the same) ...
def award_xp(amount):
    profile, created = UserProfile.objects.get_or_create(id=1)
    profile.current_xp += amount
    if profile.current_xp >= profile.next_level_xp:
        profile.current_xp -= profile.next_level_xp
        profile.level += 1
        profile.next_level_xp = int(profile.next_level_xp * 1.2)
    profile.save()
    return profile

@api_view(['GET'])
def get_user_profile(request):
    profile, created = UserProfile.objects.get_or_create(id=1)
    all_badges = [
        {"id": 1, "name": "Starter", "icon": "🌱", "desc": "Initiated EcoDex"},
        {"id": 2, "name": "Recycler", "icon": "♻️", "desc": "Logged a recycling action"},
        {"id": 3, "name": "Solar", "icon": "☀️", "desc": "Energy saver"},
        {"id": 4, "name": "Hydro", "icon": "💧", "desc": "Mission: Save 100L of water"},
        {"id": 5, "name": "Wind", "icon": "🌬️", "desc": "Mission: Support wind energy"},
        {"id": 6, "name": "Bio", "icon": "🍂", "desc": "Mission: Create compost"},
    ]
    badge_data = []
    for b in all_badges:
        is_unlocked = b['name'] in profile.badges
        if b['name'] == "Starter" and not is_unlocked:
            profile.badges.append("Starter")
            profile.save()
            is_unlocked = True
        badge_data.append({**b, "unlocked": is_unlocked, "date": "2025" if is_unlocked else "LOCKED"})
    return Response({
        "username": profile.username,
        "level": profile.level,
        "currentXP": profile.current_xp,
        "nextLevelXP": profile.next_level_xp,
        "badges": badge_data
    })

@api_view(['POST'])
def log_impact(request):
    action = request.data.get('action')
    ImpactLog.objects.create(action=action)
    xp_gain = 50 
    if action == 'plant_tree': xp_gain = 100
    if action == 'recycle': xp_gain = 30
    if action == 'battle_win': xp_gain = 100
    updated_profile = award_xp(xp_gain)
    if action == 'recycle' and "Recycler" not in updated_profile.badges:
        updated_profile.badges.append("Recycler")
        updated_profile.save()
    return Response({
        "message": f"Action Logged! +{xp_gain} XP",
        "new_xp": updated_profile.current_xp,
        "new_level": updated_profile.level
    })

# --- UPDATED AQI FUNCTION WITH DEBUGGING ---
@api_view(['GET'])
def get_latest_aqi(request):
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')
    
    city_name = "Global View"
    aqi = 0
    status = "Waiting..."
    
    # 1. Get Token
    TOKEN = os.getenv('WAQI_API_TOKEN')
    
    # 2. DEBUG PRINT: Check your terminal to see if this prints the token or 'None'
    print(f"DEBUG: Loaded Token from .env: {TOKEN}")

    if not TOKEN:
        print("ERROR: .env file not found or empty. Check file location!")
        return Response({"city": "Config Error", "aqi": 0, "status": "Missing Token"})

    if lat and lon:
        try:
            url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={TOKEN}"
            response = requests.get(url)
            data = response.json()

            if data['status'] == 'ok':
                aqi = data['data']['aqi']
                city_name = data['data']['city']['name']
            else:
                city_name = "Sensor Error"
                print(f"API Error Response: {data}")
        except Exception as e:
            print("Connection failed:", e)
            city_name = "Connection Failed"

    if aqi <= 50: status = "Good"
    elif aqi <= 100: status = "Moderate"
    elif aqi <= 150: status = "Unhealthy (Sens.)"
    elif aqi <= 200: status = "Unhealthy"
    elif aqi <= 300: status = "Very Unhealthy"
    else: status = "Hazardous"

    return Response({
        "city": city_name,
        "aqi": aqi,
        "status": status
    })

@api_view(['POST'])
def log_transport(request):
    mode = request.data.get('mode')
    distance = float(request.data.get('distance', 1.0))
    impact = 0.0
    message = ""
    CAR_EMISSION = 0.20
    BUS_EMISSION = 0.05 
    if mode in ['walking', 'cycling']:
        impact = distance * CAR_EMISSION
        message = f"Heroic! You saved {impact:.2f} kg CO2."
    elif mode == 'bus':
        saved = (CAR_EMISSION - BUS_EMISSION) * distance
        impact = saved
        message = f"Smart Move! Public transport saved {saved:.2f} kg CO2."
    elif mode == 'car':
        impact = -(distance * CAR_EMISSION)
        message = f"Warning: Trip emitted {abs(impact):.2f} kg CO2."
    CarbonLog.objects.create(mode=mode, distance_km=distance, carbon_saved_kg=impact)
    return Response({"saved_amount": f"{impact:.2f}", "message": message})

@api_view(['POST'])
def calculate_energy(request):
    appliances = request.data.get('appliances', [])
    total_cost = 0.0
    details = []
    for item in appliances:
        watts = float(item.get('watts', 0))
        hours = float(item.get('hours', 0))
        name = item.get('name', 'Device')
        kwh = (watts / 1000) * hours
        cost = kwh * 8.0 
        total_cost += cost
        EnergyLog.objects.create(appliance_name=name, watts=watts, hours_used=hours, cost_inr=cost)
        details.append(f"{name}: ₹{cost:.2f}")
    tip = "Usage is optimal."
    if total_cost > 100: tip = "Bill is high! Try reducing AC/Heater usage."
    return Response({"total_cost": f"₹{total_cost:.2f}", "breakdown": details, "tip": tip})