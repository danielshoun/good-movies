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
})