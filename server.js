import http from "http";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.user,
		pass: process.env.pass,
	},
});

// HTTP server with CORS support
const server = http.createServer((req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	// Handle preflight request (OPTIONS)
	if (req.method === "OPTIONS") {
		res.statusCode = 204; // No content
		res.end();
		return;
	}

	if (req.method === "POST" && req.url === "/send-email") {
		let body = "";

		req.on("data", (chunk) => {
			body += chunk;
		});

		req.on("end", () => {
			try {
				const formData = JSON.parse(body);

				if (!formData.name || !formData.email || !formData.message) {
					res.statusCode = 400;
					res.setHeader("Content-Type", "application/json");
					res.end(JSON.stringify({ message: "Missing required fields" }));
					return;
				}

				const mailOptions = {
					from: formData.email,
					to: process.env.user,
					subject: "Contact Form Submission",
					text: `You have a new message from ${formData.name} (${formData.email}):\n\n${formData.message}`,
				};

				// Send the email
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						console.error("Error sending email:", error);
						res.statusCode = 500;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ message: "Error sending email" }));
					} else {
						console.log("Email sent: " + info.response);
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ message: "Email sent successfully" }));
					}
				});
			} catch (error) {
				console.error("Error parsing JSON:", error);
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify({ message: "Invalid JSON in request body" }));
			}
		});
	} else {
		res.statusCode = 404;
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ message: "Not Found" }));
	}
});

// Start the server
server.listen(3000, () => {
	console.log("Server is listening on port 3000");
});
