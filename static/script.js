  
function checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    // Decode the token to check its expiry
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


    
    function resetPassword() {
    const email = document.getElementById('resetEmail').value;
   
   
    if (!email) {
        document.getElementById('resetError').textContent = 'Please enter your email';
        return;
    }

    fetch('/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            document.getElementById('resetError').textContent = '';
        } else {
            document.getElementById('resetError').textContent = 'Failed to send reset email';
        }
    })
    .catch(error => console.error('Error:', error));
}



function signUp() {
    const username = document.getElementById('newUsername').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !email || !password || !confirmPassword) {
        document.getElementById('signupError').textContent = 'Please fill in all fields';
        return;
    }

    if (password !== confirmPassword) {
        document.getElementById('signupError').textContent = 'Passwords do not match';
        return;
    }

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, name , email, password, confirmPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            document.getElementById('signupError').textContent = '';
            window.location.href = 'login'; // Redirect to login page
        } else {
            document.getElementById('signupError').textContent = 'Sign up failed';
        }
    })
    .catch(error => console.error('Error:', error));
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        document.getElementById('error').textContent = 'Please enter both username and password';
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // alert('Login successful!');
            document.getElementById('error').textContent = '';
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            
            localStorage.setItem('token' , data.token);
            accessProtectedRoute(data.token);
            window.location.href = '/'
    
          } else {
            document.getElementById('error').textContent = data.message;
        }
    })
    .catch(error => console.error('Error:', error));
}

function submitNewPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const url = window.location.href;
    const token = url.split('/').pop();
    console.log(token)

    if (!newPassword || !confirmPassword) {
      document.getElementById('resetError').textContent = 'Please fill out all fields';
      return;
    }

    fetch(`/reset/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ new_password: newPassword, confirm_password: confirmPassword })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert(data.message);
        document.getElementById('resetError').textContent = '';
      } else {
        document.getElementById('resetError').textContent = 'Failed to reset password';
      }
    })
    .catch(error => console.error('Error:', error));
  }

  function accessProtectedRoute(token) {
    fetch('/protected', {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert(data.message);
    })
    .catch(error => console.error('Error:', error));
}






  