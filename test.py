import pathlib
import textwrap
import os
import google.generativeai as genai
#from flask import Flask, request, render_template 

from IPython.display import display
from IPython.display import Markdown


# Used to securely store your API keycd
#from google.colab import userdata
GOOGLE_API_KEY="AIzaSyC0F96L7tARVV3XeeS5aVGYPF95eZ42WC8"

gemini_api_key = os.environ["GOOGLE_API_KEY"]

genai.configure(api_key = gemini_api_key)

def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

for modellist in genai.list_models():
  if 'generateContent' in modellist.supported_generation_methods:
    print(modellist.name)



model = genai.GenerativeModel('gemini-pro')

response = model.generate_content("I am looking for a mock paper for JEE, I don't want any explanation or. instruction in it just the whole question paper, it should be of only question no answer should be involved. I want all 90 question to be displayed.Show me all 90 question in mcq format All 1-90 question SO first show all question from 1-30 then 31-60 and in last 61-90.")


print(response.text)


# importing Flask and other modules

# Flask constructor
#app = Flask(__name__) 

# A decorator used to tell the application
# which URL is associated function
#@app.route('/', methods =["GET", "POST"])
#def gfg():



#	if request.method == "POST":
 #          department = request.form.get("department")
  #         exam = request.form.get("exam") 
   #     return "Generate mock paper for"+ department + exam
	#return render_template("form.html")

#if __name__=='__main__':
 #  app.run()
