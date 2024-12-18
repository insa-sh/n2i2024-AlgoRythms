import './style.css';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { load } from 'three/examples/jsm/libs/opentype.module.js';

import { loadQuestion2 } from './script.js';


let camera, scene, renderer;
let controls, water, sun;
let boatx = 5, boaty = 14, boatz = 50;
let controlsEnabled = true; // Flag to indicate whether controls are enabled
let collisionDetected = false; // Flag to indicate whether a collision has been detected

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();



class Plane extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.PlaneGeometry( 17, 6 );
    const planeTexture = textureLoader.load("../assets/lyreco.jpg");
    const material = new THREE.MeshStandardMaterial( {map: planeTexture, side: THREE.DoubleSide} );
    super(geometry, material);
    this.position.set(boatx+11, boaty-16, boatz);
    this.rotation.x = Math.PI / 2;
    this.rotation.z = Math.PI / 2;
    this.visible = false;
  }
}

const plane = new Plane();

const pivot = new THREE.Object3D();
pivot.position.set(boatx, boaty, boatz);
pivot.add(plane);


function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Boat {
  constructor() {
    loader.load('assets/boat/scene.gltf', (gltf) => {
      scene.add(gltf.scene);
      gltf.scene.position.set(boatx, boaty, boatz);
      gltf.scene.scale.set(3, 3, 3);
      gltf.scene.rotation.y = Math.PI / 2;

      this.boat = gltf.scene;
      this.speed = {
        vel: 0,
        rot: 0,
        xrot: 0
      }
    });
  }

  update() {
    if (this.boat) {
      this.boat.translateX(this.speed.vel);
      this.boat.rotation.y += this.speed.rot;
      this.boat.rotation.x += this.speed.xrot;
    }
  }
}

const boat = new Boat();
class Question {
  constructor(_scene, i) {
    scene.add(_scene);
    _scene.position.set(random(-200, 200), 10, -random(0, 200));

    this.question = _scene;
    this.collisionDetected = false; // Flag to indicate whether a collision has been detected for this question
    this.indice = i;
    }
}

async function loadModel(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, (gltf) => {
      resolve(gltf.scene);
    });
  });
}

let boatModel = null
async function loadQuestion(i) {
  if (!boatModel) {
    boatModel = await loadModel('assets/question/scene.gltf');
  }
  return new Question(boatModel.clone(), i);
}

loadQuestion().then((question) => {
  console.log(question);
});

let questions = [];
const nbQuestions = 12;

document.addEventListener('DOMContentLoaded', () => {
  init();
});

async function init() {

  const canvas = document.querySelector('.webgl');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  //

  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setAnimationLoop( animate );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  document.body.appendChild( renderer.domElement );

  //

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
  camera.position.set( 0, 50, 100 );

  //

  scene.add(plane);
  scene.add(pivot);

  sun = new THREE.Vector3();

  // Water

  const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

  water = new Water(
    waterGeometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load( 'assets/waternormals.jpg', function ( texture ) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      } ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    }
  );

  water.rotation.x = - Math.PI / 2;

  scene.add( water );

  // Skybox
  const time = performance.now() * 0.001;

  const sky = new Sky();
  sky.scale.setScalar( 10000 );
  scene.add( sky );

  const skyUniforms = sky.material.uniforms;

  skyUniforms[ 'turbidity' ].value = 10;
  skyUniforms[ 'rayleigh' ].value = 2;
  skyUniforms[ 'mieCoefficient' ].value = 0.005;
  skyUniforms[ 'mieDirectionalG' ].value = 0.8;

  const parameters = {
    elevation: 2,
    azimuth: 180
  };

  const pmremGenerator = new THREE.PMREMGenerator( renderer );
  const sceneEnv = new THREE.Scene();

  let renderTarget;

  function updateSun() {

    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

    if ( renderTarget !== undefined ) renderTarget.dispose();

    sceneEnv.add( sky );
    renderTarget = pmremGenerator.fromScene( sceneEnv );
    scene.add( sky );

    scene.environment = renderTarget.texture;

  }

  updateSun();


  controls = new OrbitControls( camera, renderer.domElement );
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set( 0, 10, 0 );
  controls.minDistance = 40.0;
  controls.maxDistance = 200.0;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableRotate = false;
  controls.update();

  const waterUniforms = water.material.uniforms;

  //

  for ( let i = 0; i < nbQuestions; i++ ) {
    const question = await loadQuestion(i);
    questions.push(question);
  }

  window.addEventListener( 'resize', onWindowResize );

  window.addEventListener( 'keydown', function(e) {
    if (e.key === 'l') {
      boat.speed.xrot = 0.1;
        if (boat.boat.position.x == boatx && boat.boat.position.y == boaty && boat.boat.position.z == boatz) {
          plane.visible = true;
          pivot.rotation.set(boat.boat.rotation.x, 0, 0);
      }
    }
    if (e.key === 'r') {
      boat.boat.position.set(boatx, boaty, boatz);
      boat.boat.rotation.set(0, Math.PI / 2, 0);
    }

    if (e.key === 'ArrowUp') {
      boat.speed.vel = 0.7;
    }
    if (e.key === 'ArrowDown') {
      boat.speed.vel = -0.5;
    }

    if (e.key === 'ArrowLeft') {
      boat.speed.rot = 0.04;
    }
    if (e.key === 'ArrowRight') {
      boat.speed.rot = -0.04;
    }
  });

  window.addEventListener( 'keyup', function(e) {
    if (e.key === 'l') {
      boat.speed.xrot = 0;
      boat.boat.rotation.x = 0;
      boat.boat.rotation.y = Math.PI / 2;
      boat.boat.rotation.z = 0;
      boat.boat.position.y = boaty;

      plane.visible = false; 
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      boat.speed.vel = 0;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      boat.speed.rot = 0;
    }
  });
}

const reset = document.querySelector(".button-reset");
reset.addEventListener("click", () => {
  boat.boat.position.set(boatx, boaty, boatz);
  boat.boat.rotation.set(0, Math.PI / 2, 0);
});

const looping = document.querySelector(".button-looping");
looping.addEventListener("mousedown", () => { 
  boat.speed.xrot = 0.1;
    if (boat.boat.position.x == boatx && boat.boat.position.y == boaty && boat.boat.position.z == boatz) {
      plane.visible = true;
      pivot.rotation.set(boat.boat.rotation.x, 0, 0);
      }
});

looping.addEventListener("mouseup", () => { 
  boat.speed.xrot = 0;
  boat.boat.rotation.x = 0;
  boat.boat.rotation.y = Math.PI / 2;
  boat.boat.rotation.z = 0;
  boat.boat.position.y = boaty;
});


function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function sous_question(obj1, obj2) {
  if (!obj1 || !obj2) {
    return false; // Ensure obj1 and obj2 are defined
  }
  let distance = obj1.position.distanceTo(obj2.position);
  if (distance < 25) {
    return true;
  }
  return false;
}

function checkCollisions() {
  if (boat && boat.boat) {
    questions.forEach((question) => {
      if (question.question && !question.collisionDetected) { // Check if a collision has already been detected for this question
        if (sous_question(boat.boat, question.question)) {
          question.collisionDetected = true; // Set the flag to indicate a collision has been detected for this question
          // console.log('Collision detected');
          // console.log(question.indice);
          // Ecrire la fonction quizz ici
          loadQuestion2(question.indice);
          // bloquer le déplacement du bateau
          controlsEnabled = false;

          scene.remove(question.question);
        }
      }
    });
  }
}

// Reset the collision flag when needed (e.g., after handling the collision)
function resetCollisionFlag() {
  collisionDetected = false;
}

function animate() {
  render();
  if (boat && boat.boat) {
    if (controlsEnabled) {
      boat.update();
    }
    // pivot.position.set(boat.boat.position.x, boat.boat.position.y, boat.boat.position.z);
    // pivot.rotation.set(boat.boat.rotation.x, 0, 0);
    pivot.attach(plane);
    // plane.position.set(boat.boat.position.x+5, boat.boat.position.y- 30, boat.boat.position.z-50);
    camera.position.set(boat.boat.position.x, boat.boat.position.y + 50, boat.boat.position.z + 100);
    checkCollisions();
  }
}

function render() {
  water.material.uniforms['time'].value += 1.0 / 60.0;
  renderer.render(scene, camera);
}

export function toggleControl() {
  controlsEnabled = true;
  // console.log('Controls enabled');
}