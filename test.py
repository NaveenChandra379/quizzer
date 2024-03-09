import pathlib
import textwrap
import os
import google.generativeai as genai
#from flask import Flask, request, render_template 

from IPython.display import display
from IPython.display import Markdown


# Used to securely store your API keycd
#from google.colab import userdata

def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

#GOOGLE_API_KEY="AIzaSyC0F96L7tARVV3XeeS5aVGYPF95eZ42WC8"
#GOOGLE_API_KEY=
# userdata.get('GOOGLE_API_KEY')

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

for modellist in genai.list_models():
  if 'generateContent' in modellist.supported_generation_methods:
    print(modellist.name)



model = genai.GenerativeModel('gemini-pro')

response = model.generate_content("I am looking for a mock paper for JEE, I don't want any explanation or. instruction in it just the whole question paper, it should be of only question no answer should be involved. I want all 90 question to be displayed.Show me all 90 question in mcq format All 1-90 question SO first show all question from 1-30 then 31-60 and in last 61-90.")


print(response.text)


from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    # Get data from the form
    data_from_form = request.form['country']
    data_from_form2 = request.form['exam']

    # Do something with the data (your Python code)
    # For example, print it to the console
    print(f"Data from form: {data_from_form}{data_from_form2}")

    # You can return a response if needed
    return "Form submitted successfully!"

if __name__ == '__main__':
    app.run(debug=True)
