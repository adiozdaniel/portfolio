import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/dom";

// Mocking document methods for testing
const mockContainer = {
	querySelector: vi.fn().mockReturnValue({
		appendChild: vi.fn(),
	}),
};

describe("BannerManager", () => {
	it("should initialize banners correctly", () => {
		const manager = new BannerManager(".banner-container", 3);

		expect(mockContainer.querySelector).toHaveBeenCalledWith(
			".banner-container"
		);
		expect(manager.container.appendChild).toHaveBeenCalledTimes(3); // Three banners created
	});

	it("should log an error if the container is not found", () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		const manager = new BannerManager(".non-existent-container", 3);

		expect(consoleError).toHaveBeenCalledWith(
			'Container ".non-existent-container" not found.'
		);

		consoleError.mockRestore();
	});

	it("should inject dynamic styles", () => {
		const manager = new BannerManager(".banner-container", 2);
		const styleTag = document.head.querySelector("style");

		expect(styleTag).not.toBeNull();
		expect(styleTag.textContent).toContain("banner-1");
		expect(styleTag.textContent).toContain("banner-2");
	});
});
