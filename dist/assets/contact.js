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
			const response = await fetch("https://adioz.co.ke/submit", {
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

// Initialize the ContactForm class
document.addEventListener("DOMContentLoaded", () => {
	new ContactForm(".contact-form");
});
