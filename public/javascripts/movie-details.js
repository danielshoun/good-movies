document.addEventListener('DOMContentLoaded', () => {
    const editReviewButton = document.querySelector('#edit-review-button')
    const deleteReviewButton = document.querySelector('#delete-review-button')
    const addToListButton = document.querySelector('.add-to-list-button');
    const starFive = document.querySelector('#star5')
    const starFour = document.querySelector('#star4')
    const starThree = document.querySelector('#star3')
    const starTwo = document.querySelector('#star2')
    const starOne = document.querySelector('#star1')
    const starArr = [starOne, starTwo, starThree, starFour, starFive]

    starArr.forEach(star => {
        star.addEventListener('click', async(e) => {
            const score = e.target.value;
            const ratingContainer = document.querySelector('.rating-container')
            const movieId = ratingContainer.getAttribute("movieId")

            const body = { movieId: movieId, rating:score }


            try {
                const res = await fetch("/ratings", {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                if(!res.ok){
                    throw res;
                } else {
                    console.log("Movie Has been rated")
                }


            } catch(e) {
                console.log(e)
            }
        })
    })

    addToListButton.addEventListener('click', async (e) => {
        const listSelect = document.querySelector('.dropdown-list')
        const listId = listSelect.value

        const body = {
            movieId: listSelect.getAttribute('movieId')
        }

        try {
            const res = await fetch(`/lists/${listId}`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(!res.ok) {
                throw res;
            } else {
                const addToListContainer = document.querySelector('.add-to-list-container');
                const newParagraph = document.createElement('p')
                newParagraph.innerText = 'Movie added to list.'
                addToListContainer.appendChild(newParagraph);
            }
        } catch (e) {
            console.log(e);
        }
    })

    deleteReviewButton.addEventListener('click', async (e) => {
        const movieId = deleteReviewButton.getAttribute('movieId');
        try {
            let res = await fetch(`/reviews/${movieId}`, {
                method: 'DELETE'
            });

            console.log(res);

            if(!res.ok) {
                throw res;
            } else {
                location.reload();
            }
        } catch (e) {
            console.log(e);
        }

    });

    editReviewButton.addEventListener('click', async (e) => {
        const ownReviewDiv = document.querySelector('.own-review');
        const ownReviewName = document.querySelector('.own-review-username');
        const ownReviewText = document.querySelector('.own-review-text');
        const ownReviewDate = document.querySelector('.own-review-date');

        // 	textarea(rows="5" id="reviewText" name="reviewText" placeholder="Add your review here...")
        const newTextArea = document.createElement('textarea');
        newTextArea.setAttribute('rows', '5');
        newTextArea.setAttribute('id', 'reviewText');
        newTextArea.setAttribute('name', 'reviewText');
        newTextArea.setAttribute('placeholder', 'Add your review here...');
        newTextArea.value = ownReviewText.innerText;

        const newButtonDiv = document.createElement('div')
        const newButton = document.createElement('button');
        newButton.classList.add('buttonPrimary');
        newButton.innerText = 'Save';
        newButtonDiv.appendChild(newButton)


        ownReviewDiv.removeChild(ownReviewText);
        ownReviewDiv.insertBefore(newTextArea, ownReviewDate);
        ownReviewDiv.insertBefore(newButtonDiv, ownReviewDate);

        newButton.addEventListener('click', async (e) => {
            const movieId = editReviewButton.getAttribute('movieId');
            const body = {
                newReview: newTextArea.value
            }
            try {
                let res = await fetch(`/reviews/${movieId}`, {
                    method: 'PUT',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if(!res.ok) {
                    throw res;
                } else {
                    location.reload();
                }
            } catch (e) {
                console.log(e);
            }
        })
    })
})
