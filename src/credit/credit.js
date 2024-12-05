import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';  

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

scene.add(new THREE.AmbientLight(0xffffff, 1.0));

scene.background = new THREE.Color(0x000000);

const loader = new FontLoader();

var starWarsText;
loader.load('/helvetiker_regular.typeface.json', function (font) {

    const text = 'Mael Advisse\ntest mdr\ntest 2'

    const geometry = new TextGeometry(text, {
        font: font,
        size: 4,
        depth: 1,
    });

    geometry.computeBoundingBox();

    const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    const textHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y;

    const materials = [
        new THREE.MeshPhongMaterial({ color: 0xffffff }), // front
        new THREE.MeshPhongMaterial({ color: 0x999999 }) // side
    ];

    starWarsText = new THREE.Mesh(geometry, materials);
    starWarsText.castShadow = true
    starWarsText.position.z = -50
    starWarsText.position.x = -textWidth / 2;
    starWarsText.position.y = -textHeight / 2;
    starWarsText.rotation.x = - Math.PI / 4
    scene.add(starWarsText)
});


// ANIMATE
function animate() {
    if (starWarsText) {
        starWarsText.position.y += 0.05;
        starWarsText.position.z -= 0.05;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();
