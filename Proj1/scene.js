"use strict";

// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null,
    renderer: null,
};

const objects = [];

// Functions are called
//  1. Initialize the empty scene
//  2. Add elements within the scene
//  3. Animate
helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);

// HANDLING EVENTS

// Event Listeners

window.addEventListener('resize', resizeWindow);

//To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false, keyEnter = false, keyEsc;
document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

// Update render image size and camera aspect when the window is resized
function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 13: //Enter
            keyEnter = true;
            break;
        case 27: //Esc
            keyEsc = true;
            break;
        case 68: //d
            keyD = true;
            break;
        case 83: //s
            keyS = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 87: //w
            keyW = true;
            break;
    }
}
function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 13: //Esc
            keyEnter = false;
            break;
        case 27: //Esc
            keyEsc = false;
            break;
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;
    }
}

//////////////////////////////////////////////////////////////////

function createDisk(outerRadius) {
    const innerRadius = 1;
    const height = 1;
    
    // Adapted from https://stackoverflow.com/questions/47419409/three-js-custom-hollow-cylinder-geometry

    var arcShape = new THREE.Shape();
    arcShape.moveTo(outerRadius * 2, outerRadius);
    arcShape.absarc(outerRadius, outerRadius, outerRadius, 0, Math.PI * 2, false);
    var holePath = new THREE.Path();
    holePath.moveTo(outerRadius + innerRadius, outerRadius);
    holePath.absarc(outerRadius, outerRadius, innerRadius, 0, Math.PI * 2, true);
    arcShape.holes.push(holePath);

    var loader = new THREE.TextureLoader();
    loader.setCrossOrigin("");
    var texture1 = loader.load("https://threejs.org/examples/textures/crate.gif");
    texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
    texture1.repeat.set(0.05, 0.05);
    var texture2 = loader.load("https://threejs.org/examples/textures/hardwood2_diffuse.jpg");
    texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(0.1, 0.1);

    var geometry = new THREE.ExtrudeGeometry(arcShape, {
    amount: height,
    bevelEnabled: false,
    steps: 1,
    curveSegments: 60
    });
    geometry.center();
    geometry.rotateX(Math.PI * -.5);
    var mesh = new THREE.Mesh(geometry, [new THREE.MeshPhongMaterial({
    map: texture1
    }), new THREE.MeshPhongMaterial({
    map: texture2
    })]);
   
    return mesh;
}

function createDisks(numberOfDisks) {
    for (let i=0; i<numberOfDisks*2; i++) {
        var disk = createDisk(Math.floor(i/2)+3);
        disk.position.set(-50, numberOfDisks*2-i + 106.5, 0);
        sceneElements.sceneGraph.add(disk);
    }
}

// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {
    // Load textures
    var loader = new THREE.TextureLoader();
    loader.setCrossOrigin("");
    var texture = loader.load("https://threejs.org/examples/textures/hardwood2_diffuse.jpg");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.1, 0.1);

    var floor = loader.load("https://threejs.org/examples/textures/floors/FloorsCheckerboard_S_Diffuse.jpg");
    floor.wrapT = floor.wrapS = THREE.RepeatWrapping;
    floor.repeat.set(2, 2);

    // ************************** //
    // Create table
    // ************************** //
    var tableGeometry = new THREE.BoxGeometry(200, 100, 100);
	var tableMaterial = new THREE.MeshPhongMaterial({ color: 0x966F33 });
	var table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = 50;
	table.receiveShadow = true;
    sceneGraph.add(table);

    // ************************** //
    // Create ground
    // ************************** //
    var groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    var groundMaterial = new THREE.MeshPhongMaterial({ map: floor });
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI/2;
    sceneGraph.add(ground);

    // ************************** //
    // Create base
    // ************************** //
    var baseGeometry = new THREE.BoxGeometry( 150, 10, 50 );
    var base = new THREE.Mesh( baseGeometry, [new THREE.MeshPhongMaterial({
        map: texture
        }), new THREE.MeshPhongMaterial({
        map: texture
        }), new THREE.MeshPhongMaterial({
            map: texture
        }), new THREE.MeshPhongMaterial({
            map: texture
        }), new THREE.MeshPhongMaterial({
            map: texture
        }), new THREE.MeshPhongMaterial({
            map: texture
        })]);
    base.position.y = 102.5;
    sceneGraph.add(base);

    // ************************** //
    // Create towers
    // ************************** //
    var towerGeometry = new THREE.CylinderGeometry( 1, 1, 50, 32 );
    var towerMaterial = new THREE.MeshStandardMaterial( { metalness:1 } );
    var tower_1 = new THREE.Mesh( towerGeometry, towerMaterial );
    tower_1.position.set(0, 125, 0);

    var tower_2 = new THREE.Mesh( towerGeometry, towerMaterial );
    tower_2.position.set(50, 125, 0);

    var tower_3 = new THREE.Mesh( towerGeometry, towerMaterial );
    tower_3.position.set(-50, 125, 0);

    sceneGraph.add( tower_1, tower_2, tower_3 );

    // ************************** //
    // Create disks
    // ************************** //

    // Ask the user the number of pair of disks
    let numberOfDisks = prompt("Please enter number of pairs of disks", 0);
    // Call function to create the disks
    createDisks(numberOfDisks);

    sceneGraph.traverse( function( node ) {

        if ( node instanceof THREE.Mesh ) {
            node.receiveShadow = true;
            node.castShadow = true;
        }
    
    } );
}

// Displacement value
var delta = 0.1;

function computeFrame(time) {
    // Can extract an object from the scene Graph from its name

    // Rendering
    helper.render(sceneElements);

    // NEW --- Update control of the camera
    sceneElements.control.update();

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}