// Handles mouse movement, scrolling, and touch swipes for continuous horizontal scroll with limits
document.querySelectorAll(".engineer").forEach((engineer) => {
	let lastScroll = 0;
	const maxScroll = 200;
	const minScroll = -200;

	engineer.addEventListener("mousemove", function (e) {
		const bounds = engineer.getBoundingClientRect();
		const x = e.clientX - bounds.left;
		const y = e.clientY - bounds.top;
		const left = (x / bounds.width - 0.5) * 200;
		const top = (y / bounds.height - 0.5) * -20;
		engineer.style.setProperty("--left", `${left}px`);
		engineer.style.setProperty("--top", `${top}px`);
	});

	engineer.addEventListener("mouseleave", function () {});

	engineer.addEventListener(
		"wheel",
		function (e) {
			e.preventDefault();
			let scrollAmount = e.deltaY > 0 ? 10 : -10;

			if (lastScroll + scrollAmount > maxScroll) {
				lastScroll = maxScroll;
			} else if (lastScroll + scrollAmount < minScroll) {
				lastScroll = minScroll;
			} else {
				lastScroll += scrollAmount;
			}

			engineer.style.setProperty("--left", `${lastScroll}px`);
		},
		{ passive: false }
	);

	let touchStart = 0;

	engineer.addEventListener("touchstart", function (e) {
		touchStart = e.touches[0].clientX;
	});

	engineer.addEventListener("touchmove", function (e) {
		let touchMove = e.touches[0].clientX;
		let touchDelta = touchMove - touchStart;
		let swipeLeft = (touchDelta / window.innerWidth) * 200;

		if (swipeLeft > maxScroll) swipeLeft = maxScroll;
		if (swipeLeft < minScroll) swipeLeft = minScroll;

		engineer.style.setProperty("--left", `${swipeLeft}px`);
	});
});
