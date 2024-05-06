from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

BASE_URL = "http://45.88.188.104:6087/api/adlinks/bypass"
VALID_API_KEYS = ["xx123123", "api_key_2"]  # Add your friend's valid API keys here

def validate_api_key(api_key):
    return api_key in VALID_API_KEYS

@app.route('/xs/', methods=['GET'])
def bypass_url():
    url = request.args.get('url')
    api_key = request.args.get('api_key')

    if not url:
        return jsonify({"error": "URL parameter is missing"}), 400

    if not api_key:
        return jsonify({"error": "API key parameter is missing"}), 400

    if not validate_api_key(api_key):
        return jsonify({"error": "Detected API key invalid"}), 403

    full_api_url = f"{BASE_URL}?url={url}"

    try:
        response = requests.get(full_api_url)
        response_json = response.json()
        bypassed = response_json.get("bypassed")
        error = response_json.get("error")

        if bypassed:
            return jsonify({
                "bypass": bypassed,
                "credit": "Provided by [Your Name]"
            }), 200
        elif error:
            return jsonify({"error": error}), 500
        else:
            return jsonify({"error": "Unknown error occurred"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8765, debug=True)
