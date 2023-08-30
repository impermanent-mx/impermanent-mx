import * as THREE from 'three';

let escene, camera, renderer, cube; 

init()

function init(){

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / (window.innerHeight), 0.1, 1000 );
    camera.position.z = 4; 

    const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    cube = new THREE.Mesh( geometry, material ); 
    scene.add( cube );
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    let container = document.getElementById('container');
    
    window.addEventListener( 'resize', onWindowResize);

    container.appendChild( renderer.domElement );
    animate(); 

}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
}


function animate() {
    requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y -= 0.02; 
    renderer.render( scene, camera );

}
