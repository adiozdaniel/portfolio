import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// create Three.js scene
const scene = new THREE.Scene();

// create a camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

// create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// load GLTF model
const gltfLoader = new GLTFLoader();
gltfLoader.load("assets/feather.glb", (gltf) => {
	const model = gltf.scene;
	scene.add(model);

	// animate model
	const animate = function () {
		requestAnimationFrame(animate);

		// rotate model
		model.rotation.x += 0.01;
		model.rotation.y += 0.01;

		// render the scene
		renderer.render(scene, camera);
	};

	animate();
});

// resize the scene when the window is resized
window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
