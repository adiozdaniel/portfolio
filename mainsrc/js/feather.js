import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class FeatherApp {
	constructor() {
		this.container = document.getElementById("feather");
		this.container.style.position = "fixed"; // Ensure it covers the screen
		this.container.style.top = "0";
		this.container.style.left = "0";
		this.container.style.width = "100%";
		this.container.style.height = "100%";
		this.container.style.zIndex = "-1"; // Keeps it behind other content

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
		this.featherScale = 10; // Default scale factor

		this.loadFeatherModel();

		window.addEventListener("resize", () => this.onWindowResize());
	}

	// Load the feather model
	loadFeatherModel() {
		this.loader.load(
			"assets/feather.glb",
			(gltf) => {
				this.feather = gltf.scene;
				this.setFeatherScale(this.featherScale); // Apply the scale when loaded
				this.scene.add(this.feather);

				gltf.scene.traverse((child) => {
					if (child.isMesh) {
						child.material = new THREE.MeshStandardMaterial({
							map: child.material.map,
						});
					}
				});

				window.addEventListener("mousemove", (event) =>
					this.onMouseMove(event)
				);

				this.animate();
			},
			undefined,
			(error) => {
				console.error("An error occurred loading the GLTF model:", error);
			}
		);
	}

	// Method to change the scale dynamically
	setFeatherScale(scaleFactor) {
		if (this.feather) {
			this.feather.scale.set(scaleFactor, scaleFactor, scaleFactor);
		}
	}

	// Mouse move interaction for feather
	onMouseMove(event) {
		if (this.feather) {
			const x = (event.clientX / window.innerWidth) * 2 - 1;
			const y = -(event.clientY / window.innerHeight) * 2 + 1;
			this.feather.position.x = x * 2;
			this.feather.position.y = y * 2;
		}
	}

	// Resize event for the renderer and camera
	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	// Animation loop
	animate() {
		requestAnimationFrame(() => this.animate());
		if (this.feather) {
			this.feather.rotation.y += this.rotationSpeed;
		}
		this.renderer.render(this.scene, this.camera);
	}
}

// Initialize the FeatherApp once the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	const featherApp = new FeatherApp();

	// featherApp.setFeatherScale(15);
});
