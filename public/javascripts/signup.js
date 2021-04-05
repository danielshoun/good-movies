document.addEventListener("DOMContentLoaded", () => {
    const signUpForm = document.querySelector(".sign-up-form")
    signUpForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(signUpForm);

        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");
        const confirmedPassword = formData.get("confirmedPassword")
        const _csrf = formData.get("_csrf")

        const body = {username, email, password, confirmedPassword, _csrf};

        try {
           const res = await fetch('/users/signup', {
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