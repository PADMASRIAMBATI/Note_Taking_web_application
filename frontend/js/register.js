document.getElementById('register-button').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    if (username.length < 5) {
        messageElement.textContent = 'Username must be at least 5 characters long.';
        return;
    }

    if (password.length < 8) {
        messageElement.textContent = 'Password must be at least 8 characters long.';
        return;
    }

    // Perform registration (e.g., send data to the server)
    console.log('Registering:', username);
    messageElement.textContent = 'Registration successful!';
    document.getElementById('register-form').reset();
});
