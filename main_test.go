package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
)

// Test invalid HTTP methods (only POST should be allowed)
func TestInvalidMethod(t *testing.T) {
	req, err := http.NewRequest("GET", "/submit", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Mock response recorder
	rr := httptest.NewRecorder()

	// Call the handler
	handler := http.HandlerFunc(submitContactForm)
	handler.ServeHTTP(rr, req)

	// Check if the status code is 405 Method Not Allowed
	if rr.Code != http.StatusMethodNotAllowed {
		t.Errorf("Expected status %v, got %v", http.StatusMethodNotAllowed, rr.Code)
	}
}

// Test missing Content-Type (should return 415 Unsupported Media Type)
func TestMissingContentType(t *testing.T) {
	req, err := http.NewRequest("POST", "/submit", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Mock response recorder
	rr := httptest.NewRecorder()

	// Call the handler
	handler := http.HandlerFunc(submitContactForm)
	handler.ServeHTTP(rr, req)

	// Check if the status code is 415 Unsupported Media Type
	if rr.Code != http.StatusUnsupportedMediaType {
		t.Errorf("Expected status %v, got %v", http.StatusUnsupportedMediaType, rr.Code)
	}
}

// Test invalid JSON payload
func TestInvalidJSONPayload(t *testing.T) {
	invalidJSON := []byte(`{"name": "John Doe", "email": "johndoe@example.com", "message": "Hello!"`)

	req, err := http.NewRequest("POST", "/submit", bytes.NewBuffer(invalidJSON))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Mock response recorder
	rr := httptest.NewRecorder()

	// Call the handler
	handler := http.HandlerFunc(submitContactForm)
	handler.ServeHTTP(rr, req)

	// Check if the status code is 400 Bad Request
	if rr.Code != http.StatusBadRequest {
		t.Errorf("Expected status %v, got %v", http.StatusBadRequest, rr.Code)
	}
}

// Test invalid email format
func TestInvalidEmail(t *testing.T) {
	invalidEmail := Email{
		Name:    "John Doe",
		Email:   "invalid-email",
		Message: "Hello!",
	}

	data, err := json.Marshal(invalidEmail)
	if err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest("POST", "/submit", bytes.NewBuffer(data))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Mock response recorder
	rr := httptest.NewRecorder()

	// Call the handler
	handler := http.HandlerFunc(submitContactForm)
	handler.ServeHTTP(rr, req)

	// Check if the status code is 400 Bad Request
	if rr.Code != http.StatusBadRequest {
		t.Errorf("Expected status %v, got %v", http.StatusBadRequest, rr.Code)
	}
}

// Test empty message
func TestEmptyMessage(t *testing.T) {
	emptyMessage := Email{
		Name:    "John Doe",
		Email:   "johndoe@example.com",
		Message: "",
	}

	data, err := json.Marshal(emptyMessage)
	if err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest("POST", "/submit", bytes.NewBuffer(data))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Mock response recorder
	rr := httptest.NewRecorder()

	// Call the handler
	handler := http.HandlerFunc(submitContactForm)
	handler.ServeHTTP(rr, req)

	// Check if the status code is 400 Bad Request
	if rr.Code != http.StatusBadRequest {
		t.Errorf("Expected status %v, got %v", http.StatusBadRequest, rr.Code)
	}
}

// Test successful email submission
func TestSuccessfulEmailSubmission(t *testing.T) {
	// Set environment variables for testing
	os.Setenv("GMAIL_USERNAME", "your-email@gmail.com")
	os.Setenv("GMAIL_PASSWORD", "your-email-password")

	successfulEmail := Email{
		Name:    "John Doe",
		Email:   "johndoe@example.com",
		Message: "Hello!",
	}

	data, err := json.Marshal(successfulEmail)
	if err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest("POST", "/submit", bytes.NewBuffer(data))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Mock response recorder
	rr := httptest.NewRecorder()

	// Call the handler
	handler := http.HandlerFunc(submitContactForm)
	handler.ServeHTTP(rr, req)

	// Check if the status code is 200 OK
	if rr.Code != http.StatusOK {
		t.Errorf("Expected status %v, got %v", http.StatusOK, rr.Code)
	}

	// Check if the response contains a success message
	var response map[string]string
	err = json.NewDecoder(rr.Body).Decode(&response)
	if err != nil {
		t.Fatal(err)
	}

	if response["status"] != "success" {
		t.Errorf("Expected 'success' status, got '%v'", response["status"])
	}
}

// Test server error (e.g., SMTP failure)
func TestServerError(t *testing.T) {
	// Set environment variables for testing with wrong credentials to simulate failure
	os.Setenv("GMAIL_USERNAME", "wrong-email@gmail.com")
	os.Setenv("GMAIL_PASSWORD", "wrong-password")

	emailWithError := Email{
		Name:    "John Doe",
		Email:   "johndoe@example.com",
		Message: "Hello!",
	}

	data, err := json.Marshal(emailWithError)
	if err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest("POST", "/submit", bytes.NewBuffer(data))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Mock response recorder
	rr := httptest.NewRecorder()

	// Call the handler
	handler := http.HandlerFunc(submitContactForm)
	handler.ServeHTTP(rr, req)

	// Check if the status code is 500 Internal Server Error
	if rr.Code != http.StatusInternalServerError {
		t.Errorf("Expected status %v, got %v", http.StatusInternalServerError, rr.Code)
	}
}
