import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON, { ConeTwistConstraint } from 'cannon'
import { Scene } from 'three'
let force
//var orbit = new THREE.OrbitControls( camera, renderer.domElement )

  //Camera, scene, and renderer
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 2000);
  scene.add(camera);
  camera.position.set(0,35,70);

  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //Orbit Controls
  //var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

  //Lights
  var ambientLight = new THREE.AmbientLight(0xf1f1f1);
  scene.add(ambientLight);

  var spotLight = new THREE.DirectionalLight(0xffffff);
  spotLight.position.set(50,50,50);
  scene.add(spotLight);

  //Objects (We build a mesh using a geometry and a material)

  //Earth
  var earthGeometry = new THREE.SphereGeometry(10, 50, 50);
  var earthMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture("/images/earth_3.jpg"),
    color: 0xf2f2f2,
    specular: 0xbbbbbb,
    shininess: 2
  });
  var earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);

  //Clouds
  var cloudGeometry = new THREE.SphereGeometry(10.3,  50, 50);
  var cloudMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture("/images/clouds_2.jpg"),
    transparent: true,
    opacity: 0.1
  });
  var clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
  scene.add(clouds);

  //Stars
  var starGeometry = new THREE.SphereGeometry(1000, 50, 50);
  var starMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture("/images/galaxy_starfield.png"),
    side: THREE.DoubleSide,
    shininess: 0
  });
  var starField = new THREE.Mesh(starGeometry, starMaterial);
  scene.add(starField);

  //Moon 
  var moonGeometry = new THREE.SphereGeometry(3.5, 50,50);
  var moonMaterial = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture("/images/moon_texture.jpg")
  });
  var moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.set(35,0,0);
  scene.add(moon);

  //Camera vector
  var earthVec = new THREE.Vector3(0,0,0);

  var r = 35;
  var theta = 0;
  var dTheta = 2 * Math.PI / 1000;

  var dx = .01;
  var dy = -.01;
  var dz = -.05;



  //Render loop
  var render = function() {
    earth.rotation.y += .0009;
    clouds.rotation.y += .00005;

    //Moon orbit        
    theta += dTheta;
    moon.position.x = r * Math.cos(theta);
    moon.position.z = r * Math.sin(theta);

    //Flyby
    if (camera.position.z < 0) {
      dx *= -1;
    }
    camera.position.x += dx;
    camera.position.y += dy;
    camera.position.z += dz;

    camera.lookAt(earthVec);

    //Flyby reset
    if (camera.position.z < -100) {
      camera.position.set(0,35,70);
    }

    camera.lookAt(earthVec);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();
