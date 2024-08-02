import requests

def get_nearby_vehicles(access_token, latitude, longitude):
    url = "https://api.uber.com/v1.2/estimates/time"
    headers = {
        "Authorization": f"Bearer {access_token}",
    }
    params = {
        "start_latitude": latitude,
        "start_longitude": longitude,
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# Example usage
access_token = 'your_uber_access_token'
latitude = 37.7749  # User's latitude
longitude = -122.4194  # User's longitude
vehicles = get_nearby_vehicles(access_token, latitude, longitude)
print(vehicles)
