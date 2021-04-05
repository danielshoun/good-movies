document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".log-in-form")
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);

        const email = formData.get("email");
        const password = formData.get("password");
        const _csrf = formData.get("_csrf");

        const body = {email, password, _csrf};

        try {
            const res = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!res.ok) {
                throw res;
            }

            const {
                token,
                user: {id}
            } = await res.json();

            localStorage.setItem("GOOD_MOVIES_ACCESS_TOKEN", token);
            localStorage.setItem("GOOD_MOVIES_CURRENT_USER_ID", id);

            window.location.href = '/';
        } catch (e) {
            console.log(e);
            if(e.status >= 400 && e.status < 600) {
                const errorJSON = await e.json();
                //Figure out rest of error handling in a sec.
                //error div -> fill div w/array of errors
                const errDiv = document.querySelector('.loginErrors')
                let errHTML = ['<div class="errorMessage">Something went wrong! Please try again</div>']
                const { errors } = errorJSON
                if (errors && Array.isArray(errors)) {
                    errHTML = errors.map(msg => `<div class="errorMessage">${msg}</div>`)
                }

                errDiv.innerHTML = errHTML.join('')
            } else {
                //network problem
                window.alert('Oh no! Something went wrong!!!')
            }
        }
    })
})