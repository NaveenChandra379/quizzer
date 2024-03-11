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
    'India': ['NEET-PG', 'AIIMS-PG'],
    'Germany': ['Approbation', 'GK'],
    'Japan': ['JMLE', 'JHLE'],
    'France': ['ECN', 'ENS'],
    'Australia': ['AMC', 'ASC'],
    'Brazil': ['USMLE', 'NBDE'],
    'Canada': ['MCCEE', 'LMCC']
  }
};
// Variable to store the selected course name
let selectedCourseName = '';

// Get the modal
var modal = document.getElementById("myModal");

// Get the buttons that open the modal
let btns = document.querySelectorAll(".course button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks a button, open the modal 
btns.forEach(function(btn, index) {
  btn.onclick = function() {
    modal.style.display = "block";
    const courses = ['Engineering', 'Management', 'Language', 'Medical'];
    selectedCourseName = courses[index];
    populateCountries(selectedCourseName);
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
