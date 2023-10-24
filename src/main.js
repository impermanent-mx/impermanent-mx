import * as THREE from 'three';
import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import Hydra from 'hydra-synth'

let pX = [], pY = [], pZ = [];
let cursorX, cursorY; 

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
const meshes = [],materials = [],xgrid = 4, ygrid = 4;
let material, mesh;
const hydra = new Hydra({
    canvas: document.getElementById("myCanvas"),
    detectAudio: false,
    //makeGlobal: false
}) // antes tenía .synth aqui 
    
let elCanvas = document.getElementById("myCanvas");
vit = new THREE.CanvasTexture(elCanvas);

let scene, camera, renderer2, planes = []; 
let mouseX=0, mouseY=0; 
let controls; 
let cubos = []; 

init()
document.addEventListener( 'mousemove', onDocumentMouseMove );

function init(){

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / (window.innerHeight), 0.1, 1000 );
    camera.position.z = 12; 

    const light = new THREE.PointLight(  0xffffff, 30 );
    light.position.set( 2, 0, 4 );
    scene.add( light );

    const light2 = new THREE.PointLight(  0xffffff, 30 );
    light2.position.set( -2, 0, 4 );
    scene.add( light2 );

    //const geometry = new THREE.BoxGeometry( 2, 4, 0.125 );
    //const geometry = new THREE.PlaneGeometry( 5, 5, 10 );
    //const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide} ); 

    const ux = 1 / xgrid;
    const uy = 1 / ygrid;
    const xsize = 500 / xgrid;
    const ysize = 500 / ygrid;

    let cubeCount = 0;

    document.onmousemove = function(e){
	cursorX = e.pageX;
	cursorY = e.pageY;
    }


    /// boton para 
    
//    osc(2, ()=>cursorX*0.001, 1 ).color(1.75, 0.5, 1.97).rotate(1, 0.1, 0.5).modulateScrollX(o0, 1.001).out(o0);

 
    osc(6, 0, 0.8)  .color(1, 0.1,.90)
	.rotate(0.92, 0.3)  .mult(osc(4, 0.03).thresh(0.4).rotate(0, -0.02))
	.modulateRotate(osc(20, 0).thresh(0.3, 0.6), [1,2,3,4].smooth())  .out(o0)
  

  /*
    osc(4, 0.1, 0.8)  .color(1.04, .9, -1.1)
	.rotate(0.30, 0.1)  .modulate(noise(()=>mouse.Y), () => 0.5 * Math.sin(0.08 * time))
	.modulateRotate(osc(20, 0).thresh(0.3, 0.6), 5).out(o0)
   */
    
    renderer2 = new THREE.WebGLRenderer();
    renderer2.setSize( window.innerWidth, window.innerHeight );
    let container = document.getElementById('container');
    
    

    for(let i = 0; i < xgrid; i++){
	for (let j = 0; j < ygrid; j++){
	    
	    // geometry = new THREE.SphereGeometry(4, 3, 4 );
	    const geometry = new THREE.BoxGeometry(2, 2, 0.2); 
	    change_uvs( geometry, ux, uy, i, j );

	    materials[ cubeCount] = new THREE.MeshPhongMaterial( { color: 0xffffff, map: vit, shininess: 0.9} );
	    // materials[ cubeCount ] = new THREE.MeshLambertMaterial( parameters );
	    material2 = materials[ cubeCount ];
	    
	    cubos[cubeCount] = new THREE.Mesh( geometry, material2 );

	    cubos[cubeCount].position.x = ( i - xgrid / 2.75 ) * 3;
	    cubos[cubeCount].position.y = ( j - ygrid / 2.75 ) * 3;
	    cubos[cubeCount].position.z = (Math.random() * 4)-2;

	    
	    cubos[cubeCount].scale.x = 1 + (Math.random() * 2);
	    cubos[cubeCount].scale.y = 1 + (Math.random() * 2);
	    cubos[cubeCount].lookAt(0, 0, 10); 
	    //cubos[cubeCount].position.x = i + ux ; 
	    // cubos[cubeCount].position.y =1;
	    //cubos[cubeCount].position.z = pZ[cubeCount] *  1;

	    scene.add( cubos[cubeCount] );
	    cubeCount++; 
	}
    }


    
    window.addEventListener( 'resize', onWindowResize);

    //controls = new OrbitControls( camera, renderer2.domElement );
    //controls.maxDistance = 300;
    //controls.maxAzimuthAngle = Math.PI * 2; 

    container.appendChild( renderer2.domElement );
    animate(); 

}

function animate() {
    requestAnimationFrame( animate );

    vit.needsUpdate = true;

    		camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - camera.position.y ) * .05;

				camera.lookAt( scene.position );

    //camera.position.x = Math.sin( .5 * Math.PI * ( mouse[ 0 ] - .5 ) )*-4 ;
    //camera.position.y = Math.sin( .25 * Math.PI * ( mouse[ 1 ] - .5 ) ) *4;
    //camera.position.z = Math.cos( .5 * Math.PI * ( mouse[ 0 ] - .5 ) )*2;
    
    //cube.rotation.x += 0.01;
    //cube.rotation.y -= 0.02; 

    renderer2.render( scene, camera );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 100;
    mouseY = ( event.clientY - windowHalfY ) / 100;
    
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer2.setSize( window.innerWidth, window.innerHeight );
    
}

function change_uvs( geometry, unitx, unity, offsetx, offsety ) {

    const uvs = geometry.attributes.uv.array;

    for ( let i = 0; i < uvs.length; i += 2 ) {
	uvs[ i ] = ( uvs[ i ] + offsetx ) * unitx;
	uvs[ i + 1 ] = ( uvs[ i + 1 ] + offsety ) * unity;	
    }
    
}
