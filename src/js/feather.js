import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Create Three.js scene
function initializeThreeJS() {
	const container = document.getElementById("feather");

	// Scene setup
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(
		75,
		container.offsetWidth / container.offsetHeight,
		0.1,
		1000
	);
	camera.position.z = 5;

	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	container.appendChild(renderer.domElement);

	const light = new THREE.AmbientLight(0xffffff, 1);
	scene.add(light);

	const loader = new GLTFLoader();
	loader.load(
		"assets/feather.glb",
		(gltf) => {
			const feather = gltf.scene;

			// Scale up the feather model
			const scaleFactor = 10;
			feather.scale.set(scaleFactor, scaleFactor, scaleFactor);

			scene.add(feather);

			// Animate the feather
			let rotationSpeed = 0.01;
			function animate() {
				requestAnimationFrame(animate);
				feather.rotation.y += rotationSpeed;
				renderer.render(scene, camera);
			}

			animate();

			// Allow user interaction
			window.addEventListener("mousemove", (event) => {
				const x = (event.clientX / window.innerWidth) * 2 - 1;
				const y = -(event.clientY / window.innerHeight) * 2 + 1;
				feather.position.x = x * 2;
				feather.position.y = y * 2;
			});
		},
		undefined,
		(error) => {
			console.error("An error occurred loading the GLTF model:", error);
		}
	);

	// Resize listener
	window.addEventListener("resize", () => {
		camera.aspect = container.offsetWidth / container.offsetHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.offsetWidth, container.offsetHeight);
	});
}

document.addEventListener("DOMContentLoaded", () => {
	initializeThreeJS();
});
