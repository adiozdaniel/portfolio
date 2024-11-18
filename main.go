package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
)

// Gmail SMTP configuration
const (
	smtpServer = "smtp.gmail.com"
	smtpPort   = "587"
	username   = "adiozdaniel@gmail.com"
	password   = ""
)

// Email struct to handle JSON data
type Email struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

func main() {
	http.HandleFunc("/submit", corsMiddleware(submitContactForm))

	log.Println("Server starting on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// CORS middleware to add the necessary headers
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight requests (OPTIONS)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// Handle form submission and send email
func submitContactForm(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	if r.Header.Get("Content-Type") != "application/json" {
		http.Error(w, "Content-Type must be application/json", http.StatusUnsupportedMediaType)
		return
	}

	var email Email
	err := json.NewDecoder(r.Body).Decode(&email)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	subject := "New Contact Form Submission"
	body := fmt.Sprintf("Name: %s\nEmail: %s\nMessage:\n%s", email.Name, email.Email, email.Message)
	message := []byte("To: " + username + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"Content-Type: text/plain; charset=UTF-8\r\n\r\n" + body)

	auth := smtp.PlainAuth("", username, password, smtpServer)
	err = smtp.SendMail(smtpServer+":"+smtpPort, auth, username, []string{username}, message)
	if err != nil {
		http.Error(w, "Failed to send email: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Prepare a success response
	response := map[string]string{
		"status":  "success",
		"message": "Your message has been sent successfully. Thank you for contacting us!",
	}

	// Write JSON response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
