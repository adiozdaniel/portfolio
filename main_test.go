package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
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
