from flask import Flask, request, jsonify
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

import pymongo

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'chicagohousing'
COLLECTION_NAME = 'housingprices'
FIELDS = {'Period Begin': True, 'Zip_Code': True, 'Avg Sale to List': True,'Avg Sale to List Mom': True,
           'Avg Sale to List Yoy': True,'Homes Sold':True,'Homes Sold Mom':True,'Homes Sold Yoy':True,
           'Inventory':True,'Inventory Mom': True, 'Inventory Yoy': True, 'Median List Price': True,
           'Median List Price Mom': True, 'Median ist Price Yoy': True, 'Median Sale Price': True,
           'Median Sale Price Mom': True, 'Median Sale Price Yoy': True, 'Sold Above List': True,
           'Sold Above Lit Mom': True. 'Sold Above List Yoy':True, 'Property Type': True, '_id': False}
 
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

<<<<<<< HEAD

@app.route("/chicagohousing/housingprices")
def chicagohousing_housingprices():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    housings = collection.find(projection=FIELDS, limit=100000)
    #housings = collection.find(projection=FIELDS)
    json_housing = []
    for housing in housings:
        json_housing.append(housing)
    json_housing = json.dumps(json_housing, default=json_util.default)
    connection.close()
    return json_housing
    
=======
@app.route("/data", methods=['GET'])
def restRequest():
    # Full url is "/data?year=<year>&format=<inventory|price>&zip=<zip>"
    # Returns: JSON of mongo instance data

    # Test 1

    return request.args
>>>>>>> d736106eccfd7be737c54ae9701272dadba25bee

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
