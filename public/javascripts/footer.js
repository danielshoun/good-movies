document.addEventListener('DOMContentLoaded', e => {
	const scrollTopBtn = document.querySelector('.scrollTop');

	window.onscroll = function() {scrollFunction()};

	function scrollFunction() {
		if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
			scrollTopBtn.style.display = "block";
		} else {
			scrollTopBtn.style.display = "none";
		}
	}
	scrollTopBtn.addEventListener('click', e => {
		document.documentElement.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	});
});
