"""
This script uploads the final csv into a MongoDB instance.

Files:
- cook_county_data.csv

*Based on import_csv_mongo.ipynb created by Dan P.
"""

# Imports
import pandas as pd
import pymongo
import json
import os

# Logic

def import_csvfile(filepath):
 mng_client = pymongo.MongoClient('localhost', 27017)
 mng_db = mng_client['cookcounty_db'] # Replace mongo db name
 collection_name = 'cookcounty_data' # Replace mongo db collection name
 db_cm = mng_db[collection_name]
 cdir = os.path.dirname('__file__')
 file_res = os.path.join(cdir, filepath)
 data = pd.read_csv(file_res)
 data_json = json.loads(data.to_json(orient='records'))
 db_cm.remove()
 db_cm.insert(data_json)
 
if __name__ == "__main__":
 filepath = 'cook_county_data.csv' # pass csv file path
 import_csvfile(filepath)
