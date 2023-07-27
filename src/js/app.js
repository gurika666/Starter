/* Demo JS */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { gsap } from 'gsap';
import { DoubleSide, EquirectangularRefractionMapping } from 'three';
import { AnimationUtils } from 'three';

const hdrTextureUrl = new URL('../../public/assets/bg.hdr', import.meta.url);
const canvas = document.querySelector('.canvas');

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfefefe);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(0, 0, 6);
orbit.autoRotate = true;

//load manager

const loadManager = new THREE.LoadingManager();
const loaderDiv = document.querySelector('.loader')

loadManager.onLoad = () =>{
  setTimeout(() => {
    
    loaderDiv.classList.remove('loading');
  }, 3000);
}

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
const loader = new RGBELoader(loadManager);

loader.load(hdrTextureUrl, function (texture) {
  texture.mapping = EquirectangularRefractionMapping;
  scene.background = texture;
  // scene.environment = texture;

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 50, 50),
    new THREE.MeshStandardMaterial({
      roughness: 0,
      metalness: 0,
      color: 0xffffff,
      envMap: texture,
    })
  );

  scene.add(sphere);
});

// Sets a 12 by 12 gird helper
// const gridHelper = new THREE.GridHelper(12, 12);
// scene.add(gridHelper);

// Sets the x, y, and z axes with each having a length of 4
// const axesHelper = new THREE.AxesHelper(4);
// scene.add(axesHelper);

function animate() {
  renderer.render(scene, camera);
  orbit.update();
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', resizeEvent);

function resizeEvent() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
