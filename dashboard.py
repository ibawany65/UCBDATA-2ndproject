from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

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
           'Sold Above List Mom': True, 'Sold Above List Yoy': True, 'Property Type': True, '_id': False}
 
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index4.html")


@app.route("/chicagohousing/housingprices")
def chicagohousing_housingprices():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    housings = collection.find(projection=FIELDS, limit=100000)
    #housings = collection.find(projection=FIELDS)
    json_housings = []
    for housing in housings:
        json_housings.append(housing)
    json_housings = json.dumps(json_housings, default=json_util.default)
    connection.close()
    return json_housings

    

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
