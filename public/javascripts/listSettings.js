document.addEventListener('DOMContentLoaded', () => {
    const trashCans = document.querySelectorAll('.far.fa-trash-alt')
    const editPencils = document.querySelectorAll('.fas.fa-pencil-alt')
    const deleteAllButton = document.querySelector('.deleteAllButton')

    deleteAllButton.addEventListener('click', () => {
        const deleteAllContainer = document.querySelector('.deleteAllContainer');
        deleteAllContainer.innerHTML = 'Are you sure you want to delete all of your custom movie lists?'
        let confirmYesButton = document.createElement('button')
        confirmYesButton.classList.add('buttonDelete')
        confirmYesButton.classList.add('confirmButton')
        confirmYesButton.innerText = "Yes"
        let confirmNoButton = document.createElement('button')
        confirmNoButton.classList.add('buttonSecondary')
        confirmNoButton.classList.add('confirmButton')
        confirmNoButton.innerText = "No"
        deleteAllContainer.appendChild(confirmYesButton);
        deleteAllContainer.appendChild(confirmNoButton);

        confirmYesButton.addEventListener('click', async e => {
            // Delete All Movie Lists
        })

        confirmNoButton.addEventListener('click', e => {
            deleteAllContainer.innerHTML = '';
            deleteAllContainer.appendChild(deleteAllButton);
        })
    })

    trashCans.forEach(trashCan => {
        trashCan.addEventListener('click', async e => {
            let movieListToDelete = e.target.getAttribute('listId')

            let body = {
                listId: movieListToDelete
            }

            try {
                let res = await fetch('/lists/settings', {
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

    editPencils.forEach(editPencil => {
        editPencil.addEventListener('click', async e => {
            let movieList = e.target.getAttribute('listId')
            let row = e.target.parentElement.parentElement;
            let nameCell = row.firstChild;

            let newInput = document.createElement('input');
            newInput.setAttribute('type', 'text');
            newInput.setAttribute('value', nameCell.innerHTML)
            nameCell.innerHTML = '';
            nameCell.appendChild(newInput);

            newInput.addEventListener('keypress', async ev => {
                if(ev.key === 'Enter') {
                    let newName = ev.target.value;

                    let body = {
                        newName: newName,
                        listId: movieList
                    }
                    try {
                        let res = await fetch('/lists/settings', {
                            method: 'PUT',
                            body: JSON.stringify(body),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })

                        if(!res.ok) {
                            throw res;
                        } else {
                            nameCell.removeChild(newInput);
                            nameCell.innerHTML = newName;
                        }
                    } catch (e) {
                        console.log(e);
                    }

                }
            })
        })
    })
})