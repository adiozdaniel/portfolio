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
	constructor(containerSelector, bannerCount, commonConfig) {
		this.container = document.querySelector(containerSelector);
		this.bannerCount = bannerCount;
		this.commonConfig = commonConfig;

		if (this.container) {
			this.initializeBanners();
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
}

// Usage
document.addEventListener("DOMContentLoaded", () => {
	const commonConfig = {
		basePath: "/images",
		mask: "/images/bottle-cane.png",
		aspectRatio: "2 / 5",
	};

	// Initialize banners
	new BannerManager(".banner-container", 3, commonConfig);

	// Add scroll handlers for interactivity
	document.querySelectorAll(".engineer").forEach((engineer) => {
		new EngineerScrollHandler(engineer);
	});
});
