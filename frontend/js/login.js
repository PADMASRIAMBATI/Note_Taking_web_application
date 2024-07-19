document.getElementById('login-button').addEventListener('click', function() {
    // Get input values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    // Clear previous messages
    messageElement.textContent = '';

    // Validate username
    if (username.length < 5) {
        messageElement.textContent = 'Username must be at least 5 characters long.';
        return;
    }

    // Validate password
    if (password.length < 8) {
        messageElement.textContent = 'Password must be at least 8 characters long.';
        return;
    }

    
    // Send data to server
    fetch('http://127.0.0.1:8000/login', { // Correct the URL here
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Server response:', data);  // Debugging: Log server response
        if (data.success) {
            messageElement.textContent = 'Login successful!';
            // Redirect to another page
            window.location.href = 'http://localhost:3000/index.html';  // Ensure this path is correct
        } else {
            messageElement.textContent = data.message || 'Login failed!';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageElement.textContent = 'An error occurred. Please try again.';
    });
});
