from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
uri = "mongodb+srv://nanichandra:database123@test.8ia7twi.mongodb.net/?retryWrites=true&w=majority&appName=test"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

db = client['questionnoire']
collection = db['offlineexam']


with open("D:\Quizzify\MockTestProject\offlineQuestions.json","r",encoding='utf-8') as file:
    data = json.load(file)

if isinstance(data , list):
    collection.insert_many(data)

print("done")


