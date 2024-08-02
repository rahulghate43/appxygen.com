async function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    const chatMessages = document.getElementById('chatMessages');

    // Display user message
    const userMessage = document.createElement('div');
    userMessage.textContent = `User: ${userInput}`;
    chatMessages.appendChild(userMessage);

    // Send user input to backend
    const response = await fetch('http://localhost:5000/get_guidance', { // Ensure the Flask server URL is correct
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ destination: userInput })
    });

    const data = await response.json();

    // Display AI response text
    const aiMessage = document.createElement('div');
    aiMessage.textContent = `RouteWise AI: ${data.text}`;
    chatMessages.appendChild(aiMessage);

    // Play AI response audio
    const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
    audio.play();
}


function initMap() {
    // Try to get the user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // Get the user's coordinates
            var userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Create a map centered on the user's location
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 14,
                center: userLocation
            });

            // Place a marker at the user's location
            var userMarker = new google.maps.Marker({
                position: userLocation,
                map: map,
                title: "You are here"
            });

            // Example of adding a nearby vehicle marker
            var vehicleLocation = {
                lat: userLocation.lat + 0.001,  // Example offset for vehicle location
                lng: userLocation.lng + 0.001
            };
            var vehicleMarker = new google.maps.Marker({
                position: vehicleLocation,
                map: map,
                icon: 'car_icon.png',  // Custom icon for vehicle
                title: "Nearby Vehicle"
            });
        }, function() {
            alert("Geolocation failed or not supported.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
  