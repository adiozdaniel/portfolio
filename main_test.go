package main

import (
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
