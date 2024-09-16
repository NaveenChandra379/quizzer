document.addEventListener('DOMContentLoaded', () => {
    let questions = [];
    let currentQuestionIndex = 0;
    
    async function fetchQuestions() {
        const urlParams = new URLSearchParams(window.location.search);
        const country = urlParams.get('country');
        const exam = urlParams.get('exam');
        const token = localStorage.getItem('token');
    
        const response = await fetch(`/fetch_offline_questions?country=${encodeURIComponent(country)}&exam=${encodeURIComponent(exam)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        
        const data = await response.json();
        questions = data;  // Save the questions to the variable
        displayAllQuestions(questions);
    }
    function updateExamName() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const selectedExam = urlParams.get('exam');
        document.getElementById('selectedExam').textContent = selectedExam;
      }
    
    function displayAllQuestions(questions) {
        const container = document.getElementById('question-container');
        container.innerHTML = ''; // Clear any existing content
    
        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.innerHTML = `
           <div style="display:flex; align-items: center; justify-content: space-between;">
            <p style="margin-right: 20px;"><strong>Question ${index + 1}:</strong> ${q.question}</p> 
            <p style="margin-left: 20px;"><strong>Max Marks:</strong> ${q.marks}</p>
           </div>
            `;
            container.appendChild(questionDiv);
        });
    }
    
    fetchQuestions();
    updateExamName();
});

function handleSubmit(){

        const urlParams = new URLSearchParams(window.location.search);
        const country = urlParams.get('country');
        const exam = urlParams.get('exam');
    window.location.href = `/submit_offline_exam?country=${encodeURIComponent(country)}&exam=${encodeURIComponent(exam)}`
}
