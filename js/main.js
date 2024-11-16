class EngineerScrollHandler {
	constructor(engineer) {
		this.engineer = engineer;
		this.lastScroll = 0;
		this.maxScroll = 200;
		this.minScroll = -200;
		this.touchStart = 0;

		this.initializeEventListeners();
	}

	initializeEventListeners() {
		this.engineer.addEventListener(
			"mousemove",
			this.handleMouseMove.bind(this)
		);
		this.engineer.addEventListener(
			"mouseleave",
			this.handleMouseLeave.bind(this)
		);
		this.engineer.addEventListener("wheel", this.handleWheelScroll.bind(this), {
			passive: false,
		});
		this.engineer.addEventListener(
			"touchstart",
			this.handleTouchStart.bind(this)
		);
		this.engineer.addEventListener(
			"touchmove",
			this.handleTouchMove.bind(this)
		);
	}

	handleMouseMove(e) {
		const bounds = this.engineer.getBoundingClientRect();
		const x = e.clientX - bounds.left;
		const y = e.clientY - bounds.top;
		const left = (x / bounds.width - 0.5) * 200;
		const top = (y / bounds.height - 0.5) * -20;
		this.engineer.style.setProperty("--left", `${left}px`);
		this.engineer.style.setProperty("--top", `${top}px`);
	}

	handleMouseLeave() {}

	handleWheelScroll(e) {
		e.preventDefault();
		let scrollAmount = e.deltaY > 0 ? 10 : -10;

		if (this.lastScroll + scrollAmount > this.maxScroll) {
			this.lastScroll = this.maxScroll;
		} else if (this.lastScroll + scrollAmount < this.minScroll) {
			this.lastScroll = this.minScroll;
		} else {
			this.lastScroll += scrollAmount;
		}

		this.engineer.style.setProperty("--left", `${this.lastScroll}px`);
	}

	handleTouchStart(e) {
		this.touchStart = e.touches[0].clientX;
	}

	handleTouchMove(e) {
		let touchMove = e.touches[0].clientX;
		let touchDelta = touchMove - this.touchStart;
		let swipeLeft = (touchDelta / window.innerWidth) * 200;

		if (swipeLeft > this.maxScroll) swipeLeft = this.maxScroll;
		if (swipeLeft < this.minScroll) swipeLeft = this.minScroll;

		this.engineer.style.setProperty("--left", `${swipeLeft}px`);
	}
}

class BannerManager {
	constructor(containerSelector, bannerCount) {
		this.container = document.querySelector(containerSelector);
		this.bannerCount = bannerCount;

		if (this.container) {
			this.initializeBanners();
			this.injectDynamicStyles();
		} else {
			console.error(`Container "${containerSelector}" not found.`);
		}
	}

	initializeBanners() {
		for (let i = 1; i <= this.bannerCount; i++) {
			const engineer = document.createElement("div");
			engineer.classList.add("engineer");

			const bannerDiv = document.createElement("div");
			bannerDiv.id = `banner-${i}`;
			bannerDiv.classList.add("banner");

			engineer.appendChild(bannerDiv);
			this.container.appendChild(engineer);
		}
	}

	injectDynamicStyles() {
		const styleElement = document.createElement("style");
		let styles = "";

		for (let i = 1; i <= this.bannerCount; i++) {
			styles += `
				.banner-container #banner-${i} {
					margin-top: 20px;
					width: 100%;
					height: 592px;
					background: url(/images/banner-${i}.png) var(--left) 0,
						url(/images/bottle-cane.png);
					background-blend-mode: multiply;
					mask-image: url(/images/bottle-cane.png);
					mask-size: contain;
					transition: transform 0.7s ease-out;
					transform-origin: center;
					transform: perspective(500px) rotateY(var(--left)) rotateX(var(--top));
				}

				.banner-container #banner-${i} {
					background-image: url(/images/banner-${i}.png), url(/images/bottle-cane.png);
					aspect-ratio: 2 / 5;
					background-size: auto 100%, cover;
				}
			`;
		}

		styleElement.textContent = styles;
		document.head.appendChild(styleElement);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	new BannerManager(".banner-container", 7);

	document.querySelectorAll(".engineer").forEach((engineer) => {
		new EngineerScrollHandler(engineer);
	});
});
