var answersLength;
document.addEventListener('DOMContentLoaded', () => {
  function updateExamName() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const selectedExam = urlParams.get('exam');
    document.getElementById('selectedExam').textContent = selectedExam;
  }
    async function fetchAnswers() {
      const urlParams = new URLSearchParams(window.location.search);
      const country = urlParams.get('country');
      const exam = urlParams.get('exam');
      const token = localStorage.getItem('token');
  
      const response = await fetch(`/fetch_offline_answers?country=${encodeURIComponent(country)}&exam=${encodeURIComponent(exam)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
  
      const data = await response.json();
      displayAnswers(data);
    }
  
    function displayAnswers(answers) {
      const container = document.getElementById('answer-container');
      container.innerHTML = ''; // Clear any existing content
  
      answers.forEach((a, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-container';
        answerDiv.innerHTML = `
          <p><strong>Question ${index + 1}:</strong> ${a.question}</p>
          <p><strong>Answer:</strong> ${a.answer}</p>
          <div class="marks-container">
          <div style = "display:flex">
            <label for="scored-marks-${index}" style = "font-size:20px"><strong>Scored Marks:</strong></label>
            <input type="number"  id="scored-marks-${index}" name="scoredMarks[]" max="${a.marks}" min="0" required>
           </div>
            <label for="total-marks-${index} style="text-align:center;"><strong>Max Marks:</strong> ${a.marks}</label>
          </div>
        `;
        container.appendChild(answerDiv);

        // Add input event listener to validate max marks
      const input = answerDiv.querySelector(`#scored-marks-${index}`);
      input.addEventListener('input', () => {
        if (parseFloat(input.value) > a.marks) {
          alert(`Question ${index + 1} should not exceed max marks`);
          input.value = 0;

        }
        if (parseFloat(input.value) < 0) {
          input.value = 0;
        }
      });
    
        
      });
  
      answersLength = answers.length
    }
    
    
    

    
  
    fetchAnswers();
    updateExamName();
  });

  function updateTotalScore(answersLength) {
    let total = 0;
    for(let index = 0 ; index < answersLength;index++)
    {
    let val = document.getElementById(`scored-marks-${index}`).value;
    console.log(`scored-marks-${index}`)
    console.log(val);
     total += parseFloat(val) || 0;
  }
  console.log(total)
  document.getElementById('total-score').innerText = `Total Score: ${total}`;

  return total
}

async function calculateAndSubmit() {
  // Calculate the total score
  
  totalMarks = updateTotalScore(answersLength);
  total_questions = answersLength;

  // Prepare data for submission
  const urlParams = new URLSearchParams(window.location.search);
  const country = urlParams.get('country');
  const exam = urlParams.get('exam');
  const token = localStorage.getItem('token');
  


  // Send data to server
  await fetch('/submit_offline_marks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ country, exam, totalMarks , total_questions})
  });

  
}

function goHome() {
    window.location.href = '/';
  }

  