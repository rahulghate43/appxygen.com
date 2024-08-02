from flask import Flask, request, jsonify
import requests
import nemo.collections.asr as nemo_asr
import nemo.collections.nlp as nemo_nlp
import nemo.collections.tts as nemo_tts
from vehicle_finder import get_nearby_vehicles

app = Flask(__name__)
CORS(app)

# Initialize NVIDIA NeMo models
asr_model = nemo_asr.models.EncDecCTCModelBPE.from_pretrained(model_name="stt_en_citrinet_256")
nlp_model = nemo_nlp.models.IntentSlotClassificationModel.from_pretrained(model_name="intent_slot_conformer_en")
tts_model = nemo_tts.models.Tacotron2Model.from_pretrained(model_name="tts_en_tacotron2")
vocoder = nemo_tts.models.WaveGlowModel.from_pretrained(model_name="tts_waveglow_88m")

# Weather API key and base URL
weather_api_key = 'openweathermap_api_key'
weather_api_url = 'http://api.openweathermap.org/data/2.5/forecast'

def get_weather_forecast(location):
    url = f"{weather_api_url}?q={location}&appid={weather_api_key}"
    response = requests.get(url)
    data = response.json()
    return data

@app.route('/get_guidance', methods=['POST'])
def get_guidance():
    data = request.json
    destination = data['destination']
    
    
    weather_data = get_weather_forecast(destination)
    
   
    forecast = weather_data['list'][0]  # Simplified: get the first forecast entry
    response_text = f"The weather in {destination} is {forecast['weather'][0]['description']} with a temperature of {forecast['main']['temp']}°C. "
    
   
    def text_to_speech(text):
        parsed = tts_model.parse(text)
        spectrogram = tts_model.generate_spectrogram(tokens=parsed)
        audio = vocoder.convert_spectrogram_to_audio(spec=spectrogram)
        return audio

    audio_response = text_to_speech(response_text)
    
    return jsonify({
        'text': response_text,
        'audio': audio_response.tolist()  
    })

if __name__ == '__main__':
    app.run(debug=True)
