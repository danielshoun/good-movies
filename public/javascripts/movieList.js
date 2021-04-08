document.addEventListener('DOMContentLoaded', () => {
    const newButton = document.querySelector('.newListButton');
    const nameInput = document.querySelector('.newListInput');

    newButton.addEventListener('click', async e => {
        nameInput.setAttribute('type', 'text');
        newButton.classList.add('hiddenButton')


    })

    nameInput.addEventListener('keypress', async e => {
        const body = {newListName: nameInput.value}

        if (e.key === 'Enter') {
            try {
                let res = await fetch('/lists', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if(!res.ok) {
                    throw res;
                } else {
                    const newList = await res.json();
                    const movieListUl = document.querySelector('.movieListUl')
                    const newLi = document.createElement('li')
                    newLi.classList.add('movieListLi')
                    const newLink = document.createElement('a')
                    newLink.setAttribute('href', `/lists/${newList.id}`)
                    newLink.classList.add('listLink')
                    newLink.innerText = newList.name
                    newLi.appendChild(newLink)
                    movieListUl.appendChild(newLi)
                    nameInput.setAttribute('type', 'hidden')
                    newButton.classList.remove('hiddenButton')
                    nameInput.value = ''
                }
            } catch (e) {
                console.log("Nope.")
            }

        }
    })


    document.addEventListener('click', (e) => {
        if (e.target !== nameInput && e.target !== newButton) {
            if (nameInput.getAttribute('type') === 'text') {
                nameInput.setAttribute('type', 'hidden')
                nameInput.value = ''
                newButton.classList.remove('hiddenButton')
            }
        }
    })

    //trash can
    const trashCans = document.querySelectorAll('.far.fa-trash-alt')
    trashCans.forEach(trashCan => {
        trashCan.addEventListener('click', async e => {
            let movieListToDelete = e.target.getAttribute('listId')
            let movieToDelete = e.target.getAttribute('movieId')
            let body = {
                movieId: movieToDelete,
                listId: movieListToDelete
            }

            try {
                let res = await fetch('/lists', {
                    method: 'DELETE',
                    body: JSON.stringify(body),
                    headers: {'Content-Type': 'application/json'}
                })

                if (!res.ok) {
                    throw res
                } else {
                    let row = e.target.parentElement.parentElement
                    let tBody = row.parentElement
                    tBody.removeChild(row)
                }
            } catch (error) {
                console.log('error:', error)
            }
        })
    })

    //plus sign
    const plusSigns = document.querySelectorAll(".fas.fa-plus")
    plusSigns.forEach(plusSign => {
        plusSign.addEventListener('click', async e => {
            let watchedList = 1;
            let movieToAdd = e.target.getAttribute('movieId')
            let body = {
                movieListId: watchedList,
                movieId: movieToAdd
            }

            try {
                let res = await fetch('/lists', {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {'Content-Type': 'application/json'}
                })

                if(!res.ok) {
									throw res
								} else {
									console.log(body)
                    let plusParent = plusSign.parentElement
                    plusParent.removeChild(plusSign)
                    plusParent.innerHTML = "✔";
                }
            } catch (error) {
                console.log(error)
            }
        })
    })
})
