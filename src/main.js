import * as THREE from 'three';
import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import Hydra from 'hydra-synth'
import { FontLoader } from '../static/jsm/loaders/FontLoader.js';
import * as Tone from 'tone'; 
import * as TWEEN from 'tween';

const { Grain } = require('./Grain')
const { map_range } = require('./maprange.js');
const { GLoop } = require('./GrainTwLoop.js'); 

let boolCosa = false;  
let clicBool = false; 

var freq = 1;
let tamoRedy = false; 

var AudioContext = window.AudioContext || window.webkitAudioContext
const audioCtx = new AudioContext()

const cosa = new Grain(audioCtx);

const gloop = new GLoop();  

// console.log(cosa); 

const params = {pointer: 0, freqScale: 1};
let rand = Math.random(); 
let twCount = 0; 

Tone.Transport.bpm.value = 70;

const metalNode = new Tone.Gain(0.075).toDestination(); 
const metal = new Tone.MetalSynth({
}).connect(metalNode);

const gainNode = new Tone.Gain(0.075).toDestination();

var reverb = new Tone.Freeverb({
    roomSize  : 0.97,
    dampening  : 1000
});

const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
	partials: [0, 2, 3, 4, 8],
    }
}).connect(reverb);
reverb.connect(gainNode); 

const gainKick = new Tone.Gain(0.35).toDestination();
const kick = new Tone.MembraneSynth().connect(gainKick);

var snare = new Tone.NoiseSynth(
    {	
	noise  : {
	    type  : "brown"
	}  ,
	envelope  : {
	    attack  : 0.001 ,
	    decay  : 0.01 ,
	    sustain  : 0.15
	}
    }
).toDestination(); 

// Super rutina 

var kickCount = 0; 
var snareCount = 0;
var metalCount = 0; 

const loop = new Tone.Loop((time) => {
    // triggered every eighth note.
    // console.log(time);
    if(kickSeq[kickCount] == 1  ){
	kick.triggerAttackRelease("C1", "32n");
    }
    
    if(snareSeq[snareCount] == 1){
	snare.triggerAttackRelease( "8n");
    }

    if(metalSeq[metalCount] == 1){
	metal.triggerAttackRelease('C0', '32n'); 
    }
    
    kickCount++;
    snareCount++;
    metalCount++;

    /*
    if(kickCount == kickSeq.length){
	kickCount = 0; 
    }

    if(snareCount == snareSeq.length){
	snareCount = 0; 
    }

    if(metalCount == metalSeq.length){
	metalCount = 0; 
	}
    */
    
}, "16n").start(0); 

var kickSeq = [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]; 
var snareSeq = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
var metalSeq = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]; 

// console.log(kickSeq.length); 

//////////////////////////////////////////////////
// INTERSECTED

let raycaster;
let INTERSECTED; 
const pointer = new THREE.Vector2();
 
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
elCanvas.style.display = 'none';     

let scene, camera, renderer2, planes = []; 
let mouseX=0, mouseY=0; 
let controls; 
let cubos = [];

///////////////////////////////////////////////////
// render target

const rtWidth = 1920*2;
const rtHeight = 1080*2;
const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, { format: THREE.RGBAFormat } );
const rtFov = 75;
const rtAspect = rtWidth / rtHeight;
const rtNear = 0.1;
const rtFar = 5;
const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
rtCamera.position.z = 4;
const rtScene = new THREE.Scene();
//rtScene.background = 0x000000; 
//rtScene.background = new THREE.Color( 0x000000 );
rtScene.background = vit; 
let fuente;
let text = new THREE.Mesh();

const materialrt = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: renderTarget.texture,
    transparent: true,
    //roughness: 0.4,
    //metalness: 0.2
});

init()
document.addEventListener( 'mousemove', onDocumentMouseMove );

function init(){

    raycaster = new THREE.Raycaster();
    loadFont(); 
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / (window.innerHeight), 0.1, 1000 );
    camera.position.z = 18; 

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
	    const geometry = new THREE.BoxGeometry(2, 2, 0.5); 
	    change_uvs( geometry, ux, uy, i, j );

	    materials[ cubeCount] = new THREE.MeshPhongMaterial( { color: 0xffffff, map: renderTarget.texture, shininess: 0.9} );
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


    // decodeAndPlay(); 
    
    window.addEventListener( 'resize', onWindowResize);

    //controls = new OrbitControls( camera, renderer2.domElement );
    //controls.maxDistance = 300;
    //controls.maxAzimuthAngle = Math.PI * 2; 
    document.addEventListener( 'mousemove', onPointerMove );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );

    container.appendChild( renderer2.domElement );
    animate(); 

}

function animate() {
    requestAnimationFrame( animate );
    //TWEEN.update(); 
    // raycaster

    if(boolCosa){
	gloop.update();
	cosa.pointer = map_range(gloop.paramsInit.pointer, 0, 1, 0, cosa.buffer.duration);
	cosa.freqScale = gloop.paramsInit.freqScale; 
    }
    
    camera.updateMatrixWorld();

    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( scene.children, false );
 
    if ( intersects.length > 0 ) {
	if ( INTERSECTED != intersects[ 0 ].object && intersects[0].object.material.emissive != undefined ) { // si INTERSECTED es tal objeto entonces realiza tal cosa

	    //console.log(INTERSECTED); 

	    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
	    
	    INTERSECTED = intersects[ 0 ].object;
	    INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
	    INTERSECTED.material.emissive.setHex( 0xb967ff );
	    document.getElementById("container").style.cursor = "pointer";

	    const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5"];

	   clicBool = true; 
	    // console.log(clicBool); 
	   
	    
	}
	
    } else {
	
	if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
	document.getElementById("container").style.cursor = "default";
	INTERSECTED = null;
    }


    var time2 = Date.now() * 0.00001;
    
    text.position.x = Math.sin(time2*20) * 10; 
    text.position.y = Math.cos(time2*25) * 1 -2 ; 

    vit.needsUpdate = true;

    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;

    camera.lookAt( scene.position );

    //camera.position.x = Math.sin( .5 * Math.PI * ( mouse[ 0 ] - .5 ) )*-4 ;
    //camera.position.y = Math.sin( .25 * Math.PI * ( mouse[ 1 ] - .5 ) ) *4;
    //camera.position.z = Math.cos( .5 * Math.PI * ( mouse[ 0 ] - .5 ) )*2;
    
    //cube.rotation.x += 0.01;
    //cube.rotation.y -= 0.02;
    
    renderTarget.flipY = true;
    renderTarget.needsUpdate = true;
    renderer2.setRenderTarget(renderTarget);
    
    renderer2.setClearColor(0x000000, 0);
    renderer2.render(rtScene, rtCamera);
    renderer2.setRenderTarget(null);

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

function loadFont(){
    const loader = new FontLoader();
    const font = loader.load(
	// resource URL
	'fonts/Dela_Gothic_One_Regular.json',
	
	// onLoad callback
	function ( font ) {
	    fuente = font;
	    console.log(font);
	    fBool = true; 
	    texto(); 
	})
}

function texto( mensaje= "IMPERMANENT IMPERMANENT IMPERMANENT\nIMPERMANENT IMPERMANENT IMPERMANENT" ){
    //const materialT = new THREE.MeshStandardMaterial({color: 0xffffff, metalnenss: 0.8, roughness: 0.2, flatShading: true});

    const materialT = new THREE.MeshBasicMaterial({color: 0xffffff});
    text.material = materialT; 
    const shapes = fuente.generateShapes( mensaje, 2 );
    const geometry = new THREE.ShapeGeometry( shapes );
    // textGeoClon = geometry.clone(); // para modificar
    text.geometry.dispose(); 
    text.geometry= geometry;
    geometry.computeBoundingBox();
    geometry.computeVertexNormals(); 
    const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
    const yMid = 0.5 * ( geometry.boundingBox.max.y - geometry.boundingBox.min.y );
    geometry.translate( xMid, yMid, 0 );
    //geometry.rotation.x = Math.PI*2;
    text.geometry= geometry;
    text.rotation = Math.PI * time; 
    rtScene.add(text);
    text.rotation.y = Math.PI * 2
    //text.rotation.z = Math.PI *2
    
    //text.position.y = 0;
    //text.position.x = -4; 
    //let lineasSelectas = [];
    
}


function onPointerMove( event ) {
    
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
}

// Idea: podría hacer secuenciadores y modificar el bpm con tweenjs

// primer paso, iniciar un kick 

/*

const loop = new Tone.Loop((time) => {
	// triggered every eighth note.
	// console.log(time);
	kick.triggerAttackRelease("C2", "8n");

}, "8n").start(0);
Tone.Transporttart();
*/

const infoButton = document.getElementById('sonido');
infoButton.addEventListener('click', sonidoFunc );

function sonidoFunc(){
    Tone.start(); 
    decodeAndPlay();
    console.log("hola"); 
}

function decodeAndPlay(){
    
    const request = new XMLHttpRequest();
    request.open('GET', 'snd/ani.mp3', true);
    request.responseType = 'arraybuffer';
    self.buffer = 0; 
    request.onload = function() {
	let audioData = request.response;
	audioCtx.decodeAudioData(audioData, function(buffer) {
	    // buffer = buffer2;
	    console.log("holo"); 
	    // const post = new Post(a.audioCtx); 
	   //cosa = new Grain(audioCtx);
	    // cosa2 = new Grain(a.audioCtx);
	    //post.gain(0.5);
	    //buffer, pointer, freqScale, windowSize, overlaps, windowratio/
	    cosa.set(buffer, Math.random(), 4 , 2, 0.25, 0.05);
	    // console.log(cosa.buffer); 
	    cosa.start();

	    Tone.Transport.start();
	    // gloop.seqpointer = [0.1, 0.3, 0.5]; 
	    gloop.start();
	    boolCosa = true;
	    
	    // console.log(gloop.pointer); 
	    
	    // grainTwLoop(audioCtx); 
	},
				 function(e){"Error with decoding audio data" + e.error});
    }
    request.send();
    tamoRedy = true; 
}

function grainTwLoop(pntr = 0, frqScl = 1, wndwSz = 0.5, vrlps = 0.5, wndwRndRt = 0, time = 8000){
    const tween = nebufferw TWEEN.Tween(params, false)
	  .to({pointer: rand, freqScale: freq}, time) 
	  .easing(TWEEN.Easing.Quadratic.InOut)
	  .onUpdate(() => {
	      //cosa.pointer = params.pointer; 
	      cosa.pointer = map_range(params.pointer, 0, 1, 0, cosa.buffer.duration)
	      // cosa.freqScale = params.freqScale; 
	  })
	  .onComplete(() => {
	      console.log(cosa.pointer); 
	      // console.log(aCtx);
	      cosa.windowRandRatio = 0.1; 
	      rand = Math.random()
	      freq = Math.floor(Math.random() * 2) + 1; 
	      twCount++;
	      console.log(twCount, rand); 
	  })
	  .start()
}

function onDocumentMouseDown( event ){
    if(clicBool){
	console.log("holafuera"); 
	// const nrand = Math.floor(Math.random() * notes.length); 
	// audioCtx.resume(); 
	// console.log(nrand);
	// grainTwLoop();
	kickCount = 0;
	snareCount = 0;
	metalCount = 0;
    }
    // synth.triggerAttackRelease(notes[nrand], "16n");
    clicBool = !clicBool; 
}
