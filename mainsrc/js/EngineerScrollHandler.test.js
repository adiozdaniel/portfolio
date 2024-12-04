import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/dom";

// Mock document elements for testing
const mockElement = {
	style: {},
	addEventListener: vi.fn(),
	getBoundingClientRect: vi.fn().mockReturnValue({
		left: 0,
		top: 0,
		width: 100,
		height: 100,
	}),
};

describe("EngineerScrollHandler", () => {
	let handler;

	beforeEach(() => {
		// Create a new instance of EngineerScrollHandler with the mocked element
		handler = new EngineerScrollHandler(mockElement);
	});

	it("should initialize event listeners correctly", () => {
		expect(mockElement.addEventListener).toHaveBeenCalledTimes(5); // 5 event listeners in total
		expect(mockElement.addEventListener).toHaveBeenCalledWith(
			"mousemove",
			expect.any(Function)
		);
		expect(mockElement.addEventListener).toHaveBeenCalledWith(
			"mouseleave",
			expect.any(Function)
		);
		expect(mockElement.addEventListener).toHaveBeenCalledWith(
			"wheel",
			expect.any(Function)
		);
		expect(mockElement.addEventListener).toHaveBeenCalledWith(
			"touchstart",
			expect.any(Function)
		);
		expect(mockElement.addEventListener).toHaveBeenCalledWith(
			"touchmove",
			expect.any(Function)
		);
	});

	it("should update style on mousemove", () => {
		// Simulate a mousemove event
		const event = {
			clientX: 50,
			clientY: 50,
		};

		handler.handleMouseMove(event);

		// Check if the style properties are set correctly
		expect(mockElement.style.setProperty).toHaveBeenCalledWith("--left", "0px");
		expect(mockElement.style.setProperty).toHaveBeenCalledWith(
			"--top",
			"-10px"
		);
	});

	it("should update style on wheel scroll", () => {
		const wheelEvent = {
			preventDefault: vi.fn(),
			deltaY: 10,
		};

		handler.handleWheelScroll(wheelEvent);

		expect(wheelEvent.preventDefault).toHaveBeenCalled();
		expect(mockElement.style.setProperty).toHaveBeenCalledWith(
			"--left",
			"10px"
		);
	});

	it("should not exceed max scroll on wheel scroll", () => {
		// Set a scroll value that exceeds maxScroll
		handler.lastScroll = 200;

		const wheelEvent = {
			preventDefault: vi.fn(),
			deltaY: 10,
		};

		handler.handleWheelScroll(wheelEvent);

		// Ensure lastScroll does not exceed maxScroll
		expect(handler.lastScroll).toBe(200);
	});

	it("should handle touch start and move correctly", () => {
		// Simulate touchstart and touchmove
		const touchStartEvent = {
			touches: [{ clientX: 50 }],
		};

		handler.handleTouchStart(touchStartEvent);

		const touchMoveEvent = {
			touches: [{ clientX: 100 }],
		};

		handler.handleTouchMove(touchMoveEvent);

		// Check if style properties are set correctly after touchmove
		expect(mockElement.style.setProperty).toHaveBeenCalledWith(
			"--left",
			"100px"
		);
	});
});
