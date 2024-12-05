import './style.css';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


let camera, scene, renderer;
let controls, water, sun;

const loader = new GLTFLoader();

class Boat {
  constructor() {
    loader.load('assets/boat/scene.gltf', (gltf) => {
      scene.add(gltf.scene);
      gltf.scene.position.set(5, 14, 50);
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

  // stop() {
  //   this.speed.vel = 0;
  //   this.speed.rot = 0;
  //   this.speed.xrot = 0;
  // }
  update() {
    if (this.boat) {
      this.boat.translateX(this.speed.vel);
      this.boat.rotation.y += this.speed.rot;
      this.boat.rotation.x += this.speed.xrot;
    }
  }
}

const boat = new Boat();

document.addEventListener('DOMContentLoaded', () => {
  init();
});

function init() {

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
  camera.position.set( 30, 30, 100 );

  //

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
  controls.update();

  const waterUniforms = water.material.uniforms;

  //

  window.addEventListener( 'resize', onWindowResize );

  window.addEventListener( 'keydown', function(e) {
    if (e.key === 'l') {
      boat.speed.xrot = 0.02;
    }

    if (e.key === 'ArrowUp') {
      boat.speed.vel = 0.5;
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
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      boat.speed.vel = 0;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      boat.speed.rot = 0;
    }
  });
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
  render();
  boat.update();

}

function render() {

  water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

  renderer.render( scene, camera );

}