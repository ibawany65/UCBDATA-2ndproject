from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data", methods=['GET'])
def restRequest():
    # Full url is "/data?year=<year>&format=<inventory|price>&zip=<zip>"
    # Returns: JSON of mongo instance data

    # Test 1
    
    return request.args

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
