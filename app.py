from flask import Flask, json, request, jsonify, render_template ,  url_for , redirect , session
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
from bson import json_util
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
from functools import wraps
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

uri = os.getenv("URI")
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Database and collection
db = client['userdatabase']
user_collection = db['userdata']

# Secret key for JWT
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SESSION_TYPE'] = 'filesystem'

# Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'nanichandra379@gmail.com'
app.config['MAIL_PASSWORD'] = 'jmji ujlf fucz letr'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

# Initialize the session
from flask_session import Session
Session(app)

mail = Mail(app)
s = URLSafeTimedSerializer('Thisisasecret!')

# Ping the server to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:  
    print(e)



def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 403
        
        return f(*args, **kwargs)
    
    return decorated




@app.route('/')
def index():
    is_logged_in = session.get('logged_in', False)
    return render_template('index.html', is_logged_in=is_logged_in)

@app.route('/login')
def login_page():
    return render_template('LoginPage.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/forgotPassword')
def forgot_password():
    return render_template('forgotPassword.html')

@app.route('/signup')
def sign_up():
    return render_template('signup.html')

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        username = data.get('username')
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirmPassword')

        # print(username,email,name,password,confirm_password)

        if not username or not password or not confirm_password or not email or not name:
            return jsonify({'message': 'Please fill all fields'}), 400

        if password != confirm_password:
            return jsonify({'message': 'Passwords do not match'}), 400

        if user_collection.find_one({'username': username}):
            return jsonify({'message': 'Username already exists'}), 400
        
        if user_collection.find_one({'email': email}):
            return jsonify({'message': 'email already exists'}), 400

        hashed_password = generate_password_hash(password)
        
        user_collection.insert_one({'username': username, 'name' :name ,'email' : email , 'password': hashed_password})
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Internal server error'}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Please fill all fields'}), 400

    user = user_collection.find_one({'username': username})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = jwt.encode({
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, app.config['SECRET_KEY'])

    session['logged_in'] = True
    session['username'] =  username
    return jsonify({'message': 'Succesful login' , 'token' : token})

@app.route('/protected', methods=['GET'])
def protected():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({'message': 'Token is missing!'}), 403

    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except Exception as e:
        return jsonify({'message': 'Token is invalid!'}), 403

    return jsonify({'message': f'Welcome {data["username"]}!'})


@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data['email']
    
    user = user_collection.find_one({"email": email})
    # print(user)
    if user:
        token = s.dumps(email, salt='email-confirm')
        link = url_for('reset_with_token', token=token, _external=True)
        msg = Message('Password Reset Request', sender='nanichandra379@gmail.com', recipients=[email])
        msg.body = f'Your password reset link is {link}'
        mail.send(msg)

        return jsonify({"message": "Password reset link sent to your email"}), 200

    return jsonify({"message": "Email not found"}), 404

@app.route('/reset/<token>', methods=['GET', 'POST'])
def reset_with_token(token):
    print('token: '  , token)
    try:
        email = s.loads(token, salt='email-confirm', max_age=3600)
    except (SignatureExpired, BadTimeSignature):
        return render_template('resetPassword.html', message='The reset link is invalid or has expired.')

    if request.method == 'POST':
      
        data = request.get_json()
        new_password = data['new_password']
        confirm_password = data['confirm_password']

        if new_password != confirm_password:
            return jsonify({"message": "Passwords do not match"}), 400

        hashed_password = generate_password_hash(new_password)
        user_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})

        return jsonify({"message": "Password reset successfully"}), 200

    return render_template('resetPassword.html')


@app.route('/exam', methods=['POST'])
@token_required
def get_exam_questions():
    data = request.get_json()
    country = data.get('country')
    exam = data.get('exam')
    db = client["questionnoire"]
    collection = db["question"]
    
    # Fetch questions from the database based on the exam and country
    questions = list(collection.find({'country': country, 'exam': exam}))

    # Convert MongoDB documents to JSON serializable format
    json_questions = json.loads(json_util.dumps(questions))

    return jsonify(json_questions)

@app.route('/instructions.html')
def mockPage():
    country = request.args.get('country')
    exam = request.args.get('exam')
    
    return render_template('instructions.html', country=country, exam=exam)

@app.route('/mockPage.html', methods=['GET', 'POST'])
def examPage():
    country = request.args.get('country')
    exam = request.args.get('exam')
    id = request.args.get('id')

    if request.method == 'POST':
        try:
            db = client['questionnoire']
            collection = db['question']
            question = collection.find_one({"country": country, "exam": exam, "no": int(id)})
            json_question = json.loads(json_util.dumps(question))
            return jsonify(json_question)
        except Exception as e:
            return str(e)  # Ensure the error is returned as a string

    return render_template('mockPage.html', country=country, exam=exam, id=id)


@app.route('/submit_exam', methods=['POST'])
@token_required
def submit_exam():
    try:
        data = request.get_json()
        country = data.get('country')
        token = request.headers.get('Authorization')
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        username = decoded_token['username']
        name = user_collection.find_one({"username":username},{"_id":0 , "name":1})
        name = name['name']
        exam = data.get('exam')
        new_correct_answers = []
        userAnswers = data.get('userAnswers')
        
        score = 0

        
        
        db = client['questionnoire']
        collection = db['question']
        
        
        
        
        correct_answers = list(collection.find({"country": country, "exam": exam}, {"_id": 0, "correct_option": 1}))
        
        correct_answers = list(correct_answers)
        # Log the results
        for index, item in enumerate(correct_answers):
            print(f"Question {index + 1}: {item}")
        if len(correct_answers) < 30:
            all_questions = list(collection.find({"country": country, "exam": exam}))
            for question in all_questions:
                if 'correct_option' not in question:
                    print(f"Question missing correct_option: {question}")
        for item in correct_answers:
            new_correct_answers.append(item['correct_option'])

        # Calculate score
        score = sum(1 for user_ans, correct_ans in zip(userAnswers, new_correct_answers) if user_ans == correct_ans)
        
        total_questions = len(correct_answers)


        total_questions = len(correct_answers)

        result = {
            "exam": exam,
            "country": country,
            "score": score,
            "total_questions": total_questions,
            "percentage": (score / total_questions) * 100
        }

        user_collection.update_one(
            {'username':username} ,
            {'$push' : {'results' : result}}
                                   )

        
        json_answers = json.loads(json_util.dumps(new_correct_answers))

        return jsonify(correctAnswers=json_answers , name = name)
    except Exception as e:
        print(e)
        return str(e)

@app.route('/resultpage.html')
def result():
    return render_template('ResultPage.html')

@app.route('/certificate.html')
def certificate():
    return render_template('certificate.html')


#offline test
@app.route('/fetch_offline_questions' , methods = ['POST'])
def offline_questions():
    country = request.args.get('country')
    exam = request.args.get('exam')

    
    try:
        db = client['questionnoire']
        collection = db['offlineexam']
        
        questions = list(collection.find({'country': country, 'exam': exam}))
        
        json_questions = json.loads(json_util.dumps(questions))

        # print(json_questions)

        return jsonify(json_questions)
    except Exception as e:
        return e
    

@app.route('/offlineExam.html' , methods = ['GET'])
def offlineExam():
    return render_template('offlineExam.html')

@app.route('/submit_offline_exam' , methods = ['GET'])
def submit_offline_exam():
    return render_template('answerpage.html')

@app.route('/fetch_offline_answers' , methods = ['POST'])
def fetch_offline_answers():
    country = request.args.get('country')
    exam = request.args.get('exam')
    try:
        db = client['questionnoire']
        collection = db['offlineexam']
        
        answers = list(collection.find({'country': country, 'exam': exam}))
        
        json_answers = json.loads(json_util.dumps(answers))

        # print(json_answers)

        return jsonify(json_answers)
    except Exception as e:
        return e
    
@app.route('/submit_offline_marks' , methods =['POST'])
def submit_offline_marks():
    try:
        data = request.get_json()
        country = data.get('country')
        token = request.headers.get('Authorization')
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        username = decoded_token['username']
        name = user_collection.find_one({"username":username},{"_id":0 , "name":1})
        name = name['name']
        exam = data.get('exam')
        score = data.get('totalMarks')
        total_questions = data.get('total_questions')

    except Exception as e:
        return e
    
    result = {
            "exam": exam,
            "country": country,
            "score": score,
            "total_questions": total_questions,
            "percentage": (score / total_questions) * 100
        }

    user_collection.update_one(
        {'username':username} ,
        {'$push' : {'results' : result}}
                            )
    
    return jsonify(score)
    
    


    
    


if __name__ == '__main__':
    app.run(debug=True)
