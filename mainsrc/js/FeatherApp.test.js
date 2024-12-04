import { describe, it, expect, vi, beforeEach } from "vitest";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Mock the GLTFLoader to prevent actual file loading during testing
vi.mock("three/examples/jsm/loaders/GLTFLoader", () => ({
	GLTFLoader: vi.fn().mockImplementation(() => ({
		load: vi.fn((url, onLoad) => {
			const mockGLTF = {
				scene: new THREE.Group(),
			};
			onLoad(mockGLTF); // Simulate the model being loaded
		}),
	})),
}));

// Create a mock for the WebGLRenderer
vi.mock("three", () => ({
	WebGLRenderer: vi.fn().mockImplementation(() => ({
		setSize: vi.fn(),
		render: vi.fn(),
		domElement: document.createElement("canvas"),
	})),
	PerspectiveCamera: vi.fn(),
	AmbientLight: vi.fn(),
	DirectionalLight: vi.fn(),
	MeshStandardMaterial: vi.fn(),
	Group: vi.fn(),
}));

// Define the FeatherApp class based on your provided code
class FeatherApp {
	constructor() {
		this.container = document.createElement("div");
		this.container.style.position = "fixed";
		this.container.style.top = "0";
		this.container.style.left = "0";
		this.container.style.width = "100%";
		this.container.style.height = "100%";
		this.container.style.zIndex = "-1";

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.camera.position.z = 5;
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.physicallyCorrectLights = true;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.container.appendChild(this.renderer.domElement);

		this.light = new THREE.AmbientLight(0xffffff, 1);
		this.scene.add(this.light);

		this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
		this.directionalLight.position.set(5, 5, 5);
		this.scene.add(this.directionalLight);

		this.loader = new GLTFLoader();
		this.rotationSpeed = 0.01;
		this.featherScale = 10;

		this.loadFeatherModel();
	}

	loadFeatherModel() {
		this.loader.load(
			"assets/feather.glb",
			(gltf) => {
				this.feather = gltf.scene;
				this.setFeatherScale(this.featherScale);
				this.scene.add(this.feather);
			},
			undefined,
			(error) => {
				console.error("An error occurred loading the GLTF model:", error);
			}
		);
	}

	setFeatherScale(scaleFactor) {
		if (this.feather) {
			this.feather.scale.set(scaleFactor, scaleFactor, scaleFactor);
		}
	}

	onMouseMove(event) {
		if (this.feather) {
			const x = (event.clientX / window.innerWidth) * 2 - 1;
			const y = -(event.clientY / window.innerHeight) * 2 + 1;
			this.feather.position.x = x * 2;
			this.feather.position.y = y * 2;
		}
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	animate() {
		requestAnimationFrame(() => this.animate());
		if (this.feather) {
			this.feather.rotation.y += this.rotationSpeed;
		}
		this.renderer.render(this.scene, this.camera);
	}
}

describe("FeatherApp", () => {
	let featherApp;

	beforeEach(() => {
		featherApp = new FeatherApp();
		document.body.appendChild(featherApp.container);
	});

	it("should create the container and initialize the scene", () => {
		expect(featherApp.container).toBeTruthy();
		expect(featherApp.scene).toBeInstanceOf(THREE.Scene);
	});

	it("should load the feather model and scale it", () => {
		expect(featherApp.feather).toBeTruthy();
		expect(featherApp.feather.scale.x).toBe(10); // Default scale is set to 10
		featherApp.setFeatherScale(15);
		expect(featherApp.feather.scale.x).toBe(15); // Check if scale updates to 15
	});

	it("should move the feather model on mousemove", () => {
		featherApp.feather = new THREE.Group(); // Ensure a valid model exists
		featherApp.onMouseMove({ clientX: 100, clientY: 100 });
		expect(featherApp.feather.position.x).toBeGreaterThan(0); // Check if position changes
		expect(featherApp.feather.position.y).toBeGreaterThan(0); // Check if position changes
	});

	it("should resize the renderer and camera on window resize", () => {
		featherApp.onWindowResize();
		expect(featherApp.renderer.setSize).toHaveBeenCalled();
		expect(featherApp.camera.aspect).toBe(
			window.innerWidth / window.innerHeight
		);
	});

	it("should rotate the feather model during animation", () => {
		const initialRotation = featherApp.feather.rotation.y;
		featherApp.animate();
		expect(featherApp.feather.rotation.y).toBeGreaterThan(initialRotation);
	});
});
