import "./modulepreload-polyfill-3cfb730f.js";
class n {
	constructor(t) {
		(this.form = document.querySelector(t)),
			this.form ? this.addEventListeners() : console.error("Form not found!");
	}
	async handleSubmit(t) {
		t.preventDefault();
		const e = new FormData(this.form),
			o = Object.fromEntries(e);
		this.setLoading(!0);
		try {
			const s = await fetch("https://adioz.co.ke/submit", {
				method: this.form.method || "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(o),
			});
			if (!s.ok) throw new Error(`Error: ${s.statusText}`);
			const r = await s.json();
			this.handleSuccess(r);
		} catch (s) {
			this.handleError(s);
		} finally {
			this.setLoading(!1);
		}
	}
	addEventListeners() {
		this.form.addEventListener("submit", (t) => this.handleSubmit(t));
	}
	setLoading(t) {
		const e = this.form.querySelector("button[type='submit']");
		e &&
			((e.disabled = t), (e.textContent = t ? "Sending..." : "Send Message"));
	}
	handleSuccess(t) {
		alert(t.message || "Message sent successfully!"),
			console.log("Response:", t),
			this.form.reset();
	}
	handleError(t) {
		alert("Failed to send the message. Please try again."),
			console.error("Error:", t);
	}
}
document.addEventListener("DOMContentLoaded", () => {
	new n(".contact-form");
});
//# sourceMappingURL=contact-1af366a6.js.map
