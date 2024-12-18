import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Add this import
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'; // Add this import
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';

const navbarHeight = document.querySelector('.navbar').offsetHeight; // Get navbar height
const sizes = {
    width: document.querySelector('.right-content').offsetWidth,
    height: window.innerHeight - navbarHeight
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 );
camera.position.z = 10;
camera.lookAt(0, 0, 0); 

const pointLight1 = new THREE.PointLight(0xffffff, 2, 0, 0); // Increased intensity
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, .5);
pointLight2.position.set(-500, 100, -400);
scene.add(pointLight2);

const backLight = new THREE.PointLight(0xffffff, 1.5);
backLight.position.set(0, 0, -10);
scene.add(backLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.outputEncoding = THREE.sRGBEncoding;

const asciiEffect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
// const asciiEffect = new AsciiEffect(renderer, '@#%*+=-:. ', { invert: false });

asciiEffect.domElement.style.color = 'white';
// asciiEffect.domElement.style.color = 'black';


asciiEffect.setSize(sizes.width, sizes.height);
document.querySelector('.right-content').appendChild(asciiEffect.domElement);

const controls = new OrbitControls(camera, asciiEffect.domElement);

const loader = new STLLoader();
loader.load(
    // '/models/Miffy.stl',
    '/models/test.stl',
    (geometry) => {
      geometry.computeBoundingBox(); // Calculate bounding box
  
      const boundingBox = geometry.boundingBox;
      console.log('Bounding Box:', boundingBox);
  
      const size = new THREE.Vector3();
      boundingBox.getSize(size);
      console.log('Size of the Model:', size);
  
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      console.log('Center of the Model:', center);
  
      geometry.translate(-center.x, -center.y, -center.z);
  
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const mesh = new THREE.Mesh(geometry, material);

     mesh.rotation.x = -Math.PI / 2; // rotate 90 deg around the x-axis

      // mesh.scale.set(0.045, 0.045, 0.045); // scale down
      mesh.scale.set(0.075, 0.075, 0.075); // scale down
  
      scene.add(mesh);

      // **Backdrop Mesh for Contrast**
      // const backdropMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      // const backdropMesh = new THREE.Mesh(geometry, backdropMaterial);
      // backdropMesh.rotation.x = -Math.PI / 2;
      // backdropMesh.scale.set(0.072, 0.072, 0.072); // Slightly larger than the ASCII model
      // backdropMesh.position.set(0, 0, -0.02); // Slightly behind the ASCII mesh
      // scene.add(backdropMesh);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
      console.error('An error occurred:', error);
    }
);

const radius = 5; // Distance of the camera from the object
let theta = 0;   // Horizontal angle (azimuth)
let phi = Math.PI / 4; // Vertical angle (inclination)

// function animate() {
//     theta += 0.01; // Horizontal rotation
//     phi = Math.PI / 4 + 0.6 * Math.sin(Date.now() * 0.0005); // Smooth vertical oscillation

//     // camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
//     camera.position.y = radius * Math.cos(phi); 
//     camera.position.z = radius * Math.sin(phi) * Math.sin(theta);

//   camera.lookAt(0, 0, 0);

//   asciiEffect.render(scene, camera);
//   requestAnimationFrame(animate);
// }

function animate() {
  theta += 0.005; // Increment theta for rotation

  // Set the camera position to rotate around the z-axis
  camera.position.x = radius * Math.cos(theta);
  camera.position.z = radius * Math.sin(theta); 
  camera.position.y = 0; // Keep z constant for a flat rotation in the xy-plane

  // Always look at the center of the scene
  camera.lookAt(0, 0, 0);

  // Render the scene with the ASCII effect
  asciiEffect.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
