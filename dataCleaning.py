from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv
load_dotenv()

import json

with open('questions.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

for item in data :
    if "_id" in item:
        del item["_id"]
    if "examname" in item:
        item["exam"] = item.pop('examname')
    if "sl.no" in item:
        item["no"] = item.pop('sl.no')
    del item["user_response"]

    item["course"] = "Engineering"
    





with open('JeeQuestions.json' , 'w' , encoding= 'utf-8') as file:
    json.dump(data , file , indent=4)

print("done")





