import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class FeatherApp {
	constructor() {
		this.container = document.getElementById("feather");
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			this.container.offsetWidth / this.container.offsetHeight,
			0.1,
			1000
		);
		this.camera.position.z = 5;
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(
			this.container.offsetWidth,
			this.container.offsetHeight
		);
		this.container.appendChild(this.renderer.domElement);
		this.light = new THREE.AmbientLight(0xffffff, 1);
		this.scene.add(this.light);
		this.loader = new GLTFLoader();

		this.loader.load(
			"assets/feather.glb",
			(gltf) => {
				this.feather = gltf.scene;
				const scaleFactor = 10;
				this.feather.scale.set(scaleFactor, scaleFactor, scaleFactor);
				this.scene.add(this.feather);
				this.rotationSpeed = 0.01;
				this.animate();

				window.addEventListener("mousemove", (event) => {
					const x = (event.clientX / window.innerWidth) * 2 - 1;
					const y = -(event.clientY / window.innerHeight) * 2 + 1;
					this.feather.position.x = x * 2;
					this.feather.position.y = y * 2;
				});
			},
			undefined,
			(error) => {
				console.error("An error occurred loading the GLTF model:", error);
			}
		);

		window.addEventListener("resize", () => {
			this.camera.aspect =
				this.container.offsetWidth / this.container.offsetHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(
				this.container.offsetWidth,
				this.container.offsetHeight
			);
		});
	}

	animate() {
		requestAnimationFrame(() => this.animate());
		if (this.feather) {
			this.feather.rotation.y += this.rotationSpeed;
		}
		this.renderer.render(this.scene, this.camera);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	new FeatherApp();
});
