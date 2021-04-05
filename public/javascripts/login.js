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
            const res = await fetch('/users/login', {
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
            }
        }
    })
})