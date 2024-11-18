import { jest } from "@jest/globals";

class ContactForm {
	constructor(formSelector) {
		this.form = document.querySelector(formSelector);

		if (this.form) {
			this.addEventListeners();
		} else {
			console.error("Form not found!");
		}
	}

	// Method to handle form submission
	async handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(this.form);
		const data = Object.fromEntries(formData);

		this.setLoading(true);

		try {
			const response = await fetch("http://localhost:3000/submit", {
				method: this.form.method || "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}

			const result = await response.json();
			this.handleSuccess(result);
		} catch (error) {
			this.handleError(error);
		} finally {
			this.setLoading(false);
		}
	}

	// Add event listeners
	addEventListeners() {
		this.form.addEventListener("submit", (event) => this.handleSubmit(event));
	}

	// Show or hide loading indicator
	setLoading(isLoading) {
		const submitButton = this.form.querySelector("button[type='submit']");
		if (submitButton) {
			submitButton.disabled = isLoading;
			submitButton.textContent = isLoading ? "Sending..." : "Send Message";
		}
	}

	// Handle successful form submission
	handleSuccess(response) {
		alert(response.message || "Message sent successfully!");
		console.log("Response:", response);
		this.form.reset();
	}

	// Handle errors during form submission
	handleError(error) {
		alert("Failed to send the message. Please try again.");
		console.error("Error:", error);
	}
}

describe("ContactForm", () => {
	let form, contactForm;

	beforeEach(() => {
		document.body.innerHTML = `
      <form class="contact-form">
        <input name="name" value="John Doe" />
        <input name="email" value="john@example.com" />
        <button type="submit">Send Message</button>
      </form>
    `;
		form = document.querySelector(".contact-form");
		contactForm = new ContactForm(".contact-form");
	});

	test("should instantiate the ContactForm class", () => {
		expect(contactForm).toBeInstanceOf(ContactForm);
		expect(contactForm.form).toBe(form);
	});

	test("should disable the submit button when loading", () => {
		const submitButton = form.querySelector("button[type='submit']");
		contactForm.setLoading(true);
		expect(submitButton.disabled).toBe(true);
		expect(submitButton.textContent).toBe("Sending...");

		contactForm.setLoading(false);
		expect(submitButton.disabled).toBe(false);
		expect(submitButton.textContent).toBe("Send Message");
	});

	test("should handle form submission successfully", async () => {
		// Mock the fetch API
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ message: "Message sent successfully!" }),
			})
		);

		const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
		const formData = { name: "John Doe", email: "john@example.com" };

		// Simulate the form submit
		const submitEvent = new Event("submit");
		form.dispatchEvent(submitEvent);

		// Wait for async operations to complete
		await Promise.resolve();

		expect(fetch).toHaveBeenCalledWith(
			"http://localhost:3000/submit",
			expect.objectContaining({
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			})
		);

		expect(alertMock).toHaveBeenCalledWith("Message sent successfully!");
		expect(form.reset).toHaveBeenCalled();

		alertMock.mockRestore();
	});

	test("should handle form submission error", async () => {
		// Mock the fetch API to simulate an error
		global.fetch = jest.fn(() => Promise.reject(new Error("Network Error")));

		const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

		// Simulate the form submit
		const submitEvent = new Event("submit");
		form.dispatchEvent(submitEvent);

		// Wait for async operations to complete
		await Promise.resolve();

		expect(fetch).toHaveBeenCalled();
		expect(alertMock).toHaveBeenCalledWith(
			"Failed to send the message. Please try again."
		);

		alertMock.mockRestore();
	});
});
