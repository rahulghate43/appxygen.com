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