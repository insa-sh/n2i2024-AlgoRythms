import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';  

/*---[Scene setup]---*/
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

/*---[Text handling]---*/
const loader = new FontLoader();

const textGroup = new THREE.Group();
scene.add(textGroup);

let textMeshes = [];
loader.load('/helvetiker_regular.typeface.json', function (font) {
    const texts = ['TEXT 1', 'TEXT 2', 'TEXT 3'];  // Array of text to generate
    const spacing = 6;

    texts.forEach((text, index) => {
        createTextMesh(font, text, index * spacing);
    });

    const pivot = new THREE.Object3D();
    pivot.position.set(0, 20, 0);
    textMeshes.forEach(mesh => {
        pivot.add(mesh);  // Add each text mesh to the pivot
    });

    scene.add(pivot);

    pivot.rotation.x = -Math.PI / 4;

    window.textPivot = pivot;


    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick, false);

    function onMouseMove(event) {
        // Normalize mouse coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    function onClick(event) {
        // Set up raycast to detect click on any text mesh
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections with the array of text meshes
        const intersects = raycaster.intersectObjects(textMeshes);

        if (intersects.length > 0) {
            // When the user clicks on any text, open the link
            window.location.href = 'https://www.example.com'; // Replace with your desired link
        }
    }

});

function createTextMesh(font, text, yOffset) {
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

    const textMesh = new THREE.Mesh(geometry, materials);
    textMesh.castShadow = true;
    textMesh.position.z = -50;
    textMesh.position.x = -textWidth / 2;
    textMesh.position.y = yOffset - textHeight / 2;
    textGroup.add(textMesh); 
    scene.add(textMesh);

    // Add to array
    textMeshes.push(textMesh);
}

function rotateTextBlock(angle) {
    textMeshes.forEach((mesh) => {
        // Apply rotation around X axis
        mesh.rotation.x = angle;
    });
}

// ANIMATE
function animate() {
    if (window.textPivot) {
        window.textPivot.position.y += 0.05;
        window.textPivot.position.z -= 0.05;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();

