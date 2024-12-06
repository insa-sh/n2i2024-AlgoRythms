import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

/*---[Scene setup]---*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

scene.add(new THREE.AmbientLight(0xffffff, 1.0));
scene.background = new THREE.Color(0x000000);

/*---[Text handling]---*/
const textureLoader = new THREE.TextureLoader();
const loader = new FontLoader();
const lineGroup = new THREE.Group();
scene.add(lineGroup);

let stop = false;

let textMeshes = [];

loader.load('/helvetiker_regular.typeface.json', function (font) {
    const texts = [
        { text: 'Press s to stop the scrolling', link: '', direction: 'vertical' },
        { text: 'Mael Advisse', link: '', direction: 'horizontal' },
        { text: '(Github)', link: 'https://github.com/maeladv', direction: 'horizontal' },
        { text: '- three.js expert', link: '', direction: 'vertical' },
        { text: 'Louison Bednarowicz', link: '', direction: 'horizontal' },
        { text: '(Github)', link: 'https://github.com/BillyTheSecond', direction: 'horizontal' },
        { text: '- frontend master', link: '', direction: 'vertical' },
        { text: 'Alexandre Boisfer', link: '', direction: 'horizontal' },
        { text: '(Github)', link: 'https://github.com/LeSurvivant9', direction: 'horizontal' },
        { text: '- jok3r mdr', link: '', direction: 'vertical' },
        { text: 'Nouhaila El Airouko', link: '', direction: 'horizontal' },
        { text: '(Github)', link: 'https://github.com/Westwoodrit', direction: 'horizontal' },
        { text: '- js, le J c\'est le S', link: '', direction: 'vertical' },
        { text: 'Ambre Petit', link: '', direction: 'horizontal' },
        { text: '(Github)', link: 'https://github.com/RedPrismey', direction: 'horizontal' },
        { text: '- je suis la', link: '', direction: 'vertical' },
        { text: 'Graphique de nos branches :', link: '', direction: 'vertical' },
    ];

    const xspacing = 2;
    const yspacing = 3;

    let xOffset = 0;
    let yOffset = 0;

    let currentLineGroup = new THREE.Group();

    texts.forEach((textData) => {
        createTextMesh(font, textData, xOffset, yOffset, currentLineGroup);
        const lastTextMesh = textMeshes[textMeshes.length - 1];
        const textWidth = lastTextMesh.geometry.boundingBox.max.x - lastTextMesh.geometry.boundingBox.min.x;
        const textHeight = lastTextMesh.geometry.boundingBox.max.y - lastTextMesh.geometry.boundingBox.min.y;

        if (textData.direction === 'vertical') {
            yOffset -= textHeight + yspacing;
            xOffset = 0;

            centerLineGroup(currentLineGroup);

            lineGroup.add(currentLineGroup);
            currentLineGroup = new THREE.Group();
        } else {
            xOffset += textWidth + xspacing;
        }
    });

    if (currentLineGroup.children.length > 0) {
        centerLineGroup(currentLineGroup);
        lineGroup.add(currentLineGroup);
    }

    scene.add(lineGroup);
    const texture = textureLoader.load('/fish.png', () => {
      const aspect = texture.image.width / texture.image.height;

      const planeGeometry = new THREE.PlaneGeometry(15 * aspect, 15);
      const planeMaterial = new THREE.MeshBasicMaterial({ map: texture });
      const imageMesh = new THREE.Mesh(planeGeometry, planeMaterial);

      imageMesh.position.x = xOffset;
      imageMesh.position.y = yOffset - 12;
      imageMesh.position.z = -20;
      imageMesh.rotation.x = -Math.PI/4;

      lineGroup.add(imageMesh);
  });


    /*---[For links handling]---*/
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick, false);

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    function onClick(event) {
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(clickableTextMeshes.map(item => item.mesh));

        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            const clickedText = clickableTextMeshes.find(item => item.mesh === clickedMesh);
            if (clickedText && clickedText.link) {
                window.open(clickedText.link, '_blank').focus();
            }
        }
    }
    
});

const clickableTextMeshes = [];

function createTextMesh(font, textData, xOffset, yOffset, lineGroup) {
    const geometry = new TextGeometry(textData.text, {
        font: font,
        size: 4,
        depth: 1,
    });

    geometry.computeBoundingBox();

    let materials;
    if (textData.link) {
        materials = [
            new THREE.MeshPhongMaterial({ color: 0x0000ff }), // front
            new THREE.MeshPhongMaterial({ color: 0x000099 }) // side
        ];
    } else {
        materials = [
            new THREE.MeshPhongMaterial({ color: 0xffffff }), // front
            new THREE.MeshPhongMaterial({ color: 0x999999 }) // side
        ];
    }

    const textMesh = new THREE.Mesh(geometry, materials);
    textMesh.position.z = -80;
    lineGroup.position.y = 30;
    textMesh.position.x = xOffset ;
    textMesh.position.y = yOffset;

    if (textData.link) {
        clickableTextMeshes.push({ mesh: textMesh, link: textData.link });
    }

    lineGroup.add(textMesh);
    textMeshes.push(textMesh);
}

function centerLineGroup(lineGroup) {
    let totalWidth = 0;
    let totalSpacing = 0;

    lineGroup.children.forEach((mesh, index) => {
        const textWidth = mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x;
        totalWidth += textWidth;

        if (index < lineGroup.children.length - 1) {
            totalSpacing += 2; 
        }
    });

    totalWidth += totalSpacing;

    const centerOffset = -totalWidth / 2;

    lineGroup.position.x = centerOffset;
    lineGroup.rotation.x = -Math.PI / 4;
}

const spaceTexture = textureLoader.load('/star.jpg');
scene.background = spaceTexture;

/*---[User interaction handling]---*/
function handleScroll(event) {
    const delta = event.deltaY;

    lineGroup.position.y += delta * 0.05;
    lineGroup.position.z -= delta * 0.05;
}
window.addEventListener('wheel', handleScroll);

function handleSKeyPress(event) {
    if (event.key === 's' || event.key === 'S') {
        stop = !stop;
    }
}
window.addEventListener('keydown', handleSKeyPress);

function animate() {
    if (!stop) {
        lineGroup.position.y += 0.05;
        lineGroup.position.z -= 0.05;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();
