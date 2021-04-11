document.addEventListener('DOMContentLoaded', e => {
	const themeBtn = document.querySelector('.theme-toggle');
	const theme = document.querySelector('#theme-css');

	const currentTheme = localStorage.getItem('theme');

	if (currentTheme === 'dark') {
		// ...then use the .dark-theme class
		theme.href = '/stylesheets/dark-theme.css';
	}

	themeBtn.addEventListener('click', () => {
		let themeName = 'light';
		if (theme.getAttribute('href') === '/stylesheets/light-theme.css') {
			theme.href = '/stylesheets/dark-theme.css';
			themeName = 'dark';
		} else {
			theme.href = '/stylesheets/light-theme.css';
		}

		localStorage.setItem('theme', themeName);
	});
});
