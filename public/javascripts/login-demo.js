document.addEventListener("DOMContentLoaded", () => {
    let emailForm = document.querySelector('#email');
    let passwordForm = document.querySelector('#password');
    let formContainer = document.querySelector('form');
    let demoButton = document.querySelector('#demoButton');

    demoButton.addEventListener('click', (e) => {
        emailForm.value = 'demo@demo.com';
        passwordForm.value = 'demopassworD1!';
        // formContainer.submit()
    })
})