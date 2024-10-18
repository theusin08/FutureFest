const container = document.getElementById('container');
const signInButton = document.getElementById('sign-in');
const signUpButton = document.getElementById('sign-up');

signInButton.addEventListener('click', () => {
    container.classList.remove('active');
});

signUpButton.addEventListener('click', () => {
    container.classList.add('active');
});