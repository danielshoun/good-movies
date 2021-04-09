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
    const labelArr = Array.from(document.querySelectorAll('label')).reverse();
    const ratingContainer = document.querySelector('.rating-container')
    const prevRating = ratingContainer.getAttribute('prevRating');

    starArr.forEach((star, i) => {

        if(prevRating !== '' && star.value <= parseInt(prevRating)) {
            star.classList.add('prev-rating')
            labelArr[i].classList.add('prev-rating')
        }

        star.addEventListener('click', async(e) => {
            const score = e.target.value;
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
                    starArr.forEach((star, j) => {
                        star.classList.remove('prev-rating')
                        labelArr[j].classList.remove('prev-rating')
                    })
                }
            } catch(e) {
                if(e.status === 401) {
                    window.location.href = '/users/login'
                }
            }
        })
    })

    if(addToListButton) {
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
                if(e.status === 500) {
                    if(!document.querySelector('.list-settings-error')) {
                        const addToListContainer = document.querySelector('.add-to-list-container');
                        const newErrorDiv = document.createElement('div')
                        newErrorDiv.classList.add('list-settings-error');
                        newErrorDiv.innerText = 'There was a problem adding this movie to your list.'
                        addToListContainer.appendChild(newErrorDiv)
                    }
                }
            }
        })
    }

    if(deleteReviewButton) {
        deleteReviewButton.addEventListener('click', async (e) => {
            const movieId = deleteReviewButton.getAttribute('movieId');
            try {
                let res = await fetch(`/reviews/${movieId}`, {
                    method: 'DELETE'
                });

                if(!res.ok) {
                    throw res;
                } else {
                    location.reload();
                }
            } catch (e) {
                if(e.status === 500) {
                    if(!document.querySelector('.list-settings-error')) {
                        const addReviewContainer = document.querySelector('.add-review-container');
                        const newErrorDiv = document.createElement('div')
                        newErrorDiv.classList.add('list-settings-error');
                        newErrorDiv.innerText = 'There was a problem deleting your review.'
                        addReviewContainer.appendChild(newErrorDiv)
                    }
                }
            }

        });
    }

    if(editReviewButton) {
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
                    if(e.status === 500) {
                        if(!document.querySelector('.list-settings-error')) {
                            const addReviewContainer = document.querySelector('.add-review-container');
                            const newErrorDiv = document.createElement('div')
                            newErrorDiv.classList.add('list-settings-error');
                            newErrorDiv.innerText = 'There was a problem deleting your review.'
                            ownReviewDiv.appendChild(newErrorDiv)
                        }
                    }
                }
            })
        })
    }
})
