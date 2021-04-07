document.addEventListener('DOMContentLoaded', () => {
    const trashCans = document.querySelectorAll('.far.fa-trash-alt')
    const editPencils = document.querySelectorAll('.fas.fa-pencil-alt')

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
})