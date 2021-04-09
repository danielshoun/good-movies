document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.querySelector('.search-bar');
    const searchButton = document.querySelector('.search-button');

    searchButton.addEventListener('click', (e) => {
        window.location.href = `/movies?title=${searchBar.value}&page=1`;
    })

    searchBar.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
            window.location.href = `/movies?title=${searchBar.value}&page=1`;
        }
    })
})