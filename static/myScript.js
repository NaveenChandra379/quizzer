const examOptions = {
  'Engineering': {
    'USA': ['SAT', 'ACT'],
    'UK': ['IELTS', 'TOEFL'],
    'India': ['JEE', 'GATE'],
    'Germany': ['TU Berlin Entrance Exam', 'TestDaF'],
    'Japan': ['JLPT', 'EJU'],
    'France': ['TCF', 'DELF'],
    'Australia': ['IELTS', 'PTE Academic'],
    'Brazil': ['Celpe-Bras', 'TOEFL'],
    'Canada': ['SAT Canada', 'IELTS Canada']
  },
  'Management': {
    'USA': ['GMAT', 'GRE'],
    'UK': ['GMAT', 'GRE'],
    'India': ['CAT', 'XAT'],
    'Germany': ['GMAT', 'GRE'],
    'Japan': ['GMAT', 'GRE'],
    'France': ['GMAT', 'GRE'],
    'Australia': ['GMAT', 'GRE'],
    'Brazil': ['GMAT', 'GRE'],
    'Canada': ['GMAT Canada', 'GRE Canada']
  },
  'Language': {
    'USA': ['TOEFL', 'IELTS'],
    'UK': ['TOEFL', 'IELTS'],
    'India': ['TOEFL', 'IELTS'],
    'Germany': ['Goethe-Zertifikat', 'TestDaF'],
    'Japan': ['JLPT', 'JFT-Basic'],
    'France': ['TCF', 'DELF'],
    'Australia': ['TOEFL', 'IELTS'],
    'Brazil': ['CELPE-Bras', 'TOEFL'],
    'Canada': ['TOEFL Canada', 'IELTS Canada']
  },
  'Medical': {
    'USA': ['USMLE', 'NBDE'],
    'UK': ['PLAB', 'MRCP'],
    'India': ['NEET', 'AIIMS'],
    'Germany': ['Approbation', 'GK'],
    'Japan': ['JMLE', 'JHLE'],
    'France': ['ECN', 'ENS'],
    'Australia': ['AMC', 'ASC'],
    'Brazil': ['USMLE', 'NBDE'],
    'Canada': ['MCCEE', 'LMCC']
  } , 
  'Offline Test':{
    'India' : ['JEE']
  } ,
  'Skill Test' : {
    'DBMS':['MYSQL'] , 
    'Frontend':['HTML'] ,
    'Language':['JavaScript']
  }
};
//Variable to store the selected course name
let selectedCourseName = '';

// Get the modal
var modal = document.getElementById("myModal");

// Get the buttons that open the modal
let btns = document.querySelectorAll(".course button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

const countryLabel = document.querySelector('label[for="country"]');

// When the user clicks a button, open the modal 
btns.forEach(function(btn, index) {
  btn.onclick = function() {
    const courses = ['Engineering', 'Management', 'Language', 'Medical' , 'Offline Test' , 'Skill Test'];
    
    modal.style.display = "block";
    selectedCourseName = courses[index];
    if (selectedCourseName === 'Skill Test') {
      console.log(countryLabel.textContent);
      countryLabel.textContent = 'Domain:'; 
      
    } 
    
      populateCountries(selectedCourseName);
      
      console.log(countryLabel.textContent);
    
    
  }
});

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Function to populate country dropdown based on selected course
function populateCountries(course) {
  
  const countrySelect = document.getElementById('country');
  const examSelect = document.getElementById('exam');
  
  // Clear previous options
  countrySelect.innerHTML = '';
  examSelect.innerHTML = '';
  
  // Populate new options
  const countries = Object.keys(examOptions[course]);
  countries.forEach(country => {
    const option = document.createElement('option');
    option.text = country;
    option.value = country;
    countrySelect.add(option);
  });
  
  // Populate exams based on the first country
  const selectedCountry = countries[0];
  populateExams(course, selectedCountry);
}

// Function to populate exam dropdown based on selected course and country
function populateExams(course, country) {
  const examSelect = document.getElementById('exam');
  
  // Clear previous options
  examSelect.innerHTML = '';
  
  // Populate new options
  const exams = examOptions[course][country];
  exams.forEach(exam => {
    const option = document.createElement('option');
    option.text = exam;
    option.value = exam;
    examSelect.add(option);
  });
}

// Add event listener to country dropdown to dynamically update exams
document.getElementById('country').addEventListener('change', function() {
  const selectedCountry = this.value;
  populateExams(selectedCourseName, selectedCountry);
});
function submitForm() {
  // Prevent default form submission
  event.preventDefault();

  // Get the selected country , token and exam values
  const country = document.getElementById('country').value;
  const exam = document.getElementById('exam').value;
  const token = localStorage.getItem('token');

  console.log("Selected Country:", country);
  console.log("Selected Exam:", exam);


  const url = `/exam?country=${encodeURIComponent(country)}&exam=${encodeURIComponent(exam)}`;

  fetch(url, {
    method :'POST',
    headers : {
        'Content-Type': 'application/json' , 
        'Authorization': token
    },
    body : JSON.stringify({country ,  exam})
})
.then(response => {

  if(response.status == 403) {
    alert('Please login');
    
    return 403;
  }

  return response.json()
})
.then(data => {
    console.log(data)

    if(data == 403)
    {
      window.location.href = 'login';
    }
    else if(selectedCourseName === 'Offline Test') 
    {
      window.location.href = `offlineExam.html?country=${encodeURIComponent(country)}&exam=${encodeURIComponent(exam)}`;
    }
    else 
    {
    window.location.href = `instructions.html?country=${encodeURIComponent(country)}&exam=${encodeURIComponent(exam)}`;
    }
    

})
.catch(error => console.log(error))

  return false; // Important to return false to prevent default form submission
}

function questionDisplayer() {

  const country = document.getElementById('countrySelect').value;
  const exam = document.getElementById('examSelect').value;

  fetch(`/country=${country}/exam=${exam}` , {
      method :'POST',
      headers : {
          'Content-Type': 'application/json'
      },
      body : JSON.stringify({country ,  exam})
  })
  .then(response = response.json())
  .then(data => {
      console.log(data)
      window.location.href = `mockPage.html?country=${encodeURIComponent(country)}&exam=${encodeURIComponent(exam)}`;

  })
  .catch(error => console.log(error))
  

}



function checkToken() {
  const token = localStorage.getItem('token');
  if (!token) {
      return false;
  }

  
  const payload = JSON.parse(atob(token.split('.')[1]));
  const exp = payload.exp;
  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime >= exp) {
      localStorage.removeItem('token');
      alert('Session has expired. Please log in again.');
      window.location.href = '/login';
      return false;
  }

  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  checkToken();
});

document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userAnswers')
  localStorage.removeItem('correctAnswers')
  window.location.href = '/logout';
});


