"use strict";

// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null,
    renderer: null,
};

const objects = [];
const stack_1 = [];
const stack_2 = [];
const stack_3 = [];
const stacks = [stack_1, stack_2, stack_3];
var numberOfDisks = 0;
const A = [[0],[]];
const B = [[1],[]];
const C = [[2],[]];
const solution = [];
var steps = 0;
var selected = null;
var simulate = false;
var tilt = 0;
var finished = false;
const colors = [0x0000FF, 0xFF0000];

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
var key1 = false, key2 = false, key3 = false, keyEnter = false;
document.addEventListener('keydown', onDocumentKeyDown, false);

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
        case 13:
            keyEnter = true;
            break;
        case 49:
            key1 = true;
            break;
        case 50:
            key2 = true;
            break;
        case 51:
            key3 = true;
            break;
        case 97:
            key1 = true;
            break;
        case 98:
            key2 = true;
            break;
        case 99:
            key3 = true;
            break;
    }
}

//////////////////////////////////////////////////////////////////

function createDisk(outerRadius, color) {
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

    /*var loader = new THREE.TextureLoader();
    loader.setCrossOrigin("");
    var texture1 = loader.load("https://threejs.org/examples/textures/crate.gif");
    texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
    texture1.repeat.set(0.05, 0.05);
    var texture2 = loader.load("https://threejs.org/examples/textures/hardwood2_diffuse.jpg");
    texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(0.1, 0.1);    
      
    Implementação antiga, seguindo a fonte e usando texturas, troquei as texturas para cores para diferenciar mais facilmente os discos com mesmo tamanho */

    var geometry = new THREE.ExtrudeGeometry(arcShape, {
    amount: height,
    bevelEnabled: false,
    steps: 1,
    curveSegments: 60
    });
    geometry.center();
    geometry.rotateX(Math.PI * -.5);
    var mesh = new THREE.Mesh(geometry, [new THREE.MeshPhongMaterial({color: colors[color]})]);
   
    return mesh;
}

function createDisks(numberOfDisks) {
    for (let i=numberOfDisks*2-1; i>=0; i--) {
        var disk = createDisk(Math.floor(i/2)+3, i%2);
        disk.position.set(-50, numberOfDisks*2-i + 107, 0);
        sceneElements.sceneGraph.add(disk);
        disk.name = "disk_"+i;
        stack_1.push(disk.name);
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
    numberOfDisks = prompt("Please enter number of pairs of disks", 0);
    // Call function to create the disks
    createDisks(numberOfDisks);

    sceneGraph.traverse( function( node ) {

        if ( node instanceof THREE.Mesh ) {
            node.receiveShadow = true;
            node.castShadow = true;
        }
    
    } );

    for (let i = numberOfDisks; i>0; i--) {
        A[1].push(i);
        A[1].push(i);
    }

    // Ask the user the number of pair of disks
    let response = prompt("Do you want to play?", "No");
    if (response=="No") {
        solve(numberOfDisks*2, A, C, B);
        simulate=true;
    }
}

function solve(n, source, target, auxiliary) {
    if (n > 0) {
        //Move n - 1 disks from source to auxiliary, so they are out of the way
        solve(n - 1, source, auxiliary, target);

        //Move the nth disk from source to target
        target[1].push(source[1].pop());

        //Display our progress
        steps += 1;
        var move = [source[0], target[0]];
        solution.push(move);

        //Move the n - 1 disks that we left on auxiliary onto target
        solve(n - 1, auxiliary, target, source);
    }
}


// Displacement value
var delta = 1;
var step = 0;

function computeFrame() {
    if (step < solution.length && simulate==true) {
        const move = solution[step];
        var target_position_x = 50*(move[1]-1);
        var target_position_y = 108 + stacks[move[1]].length;
        const disk_name = stacks[move[0]].pop();
        stacks[move[0]].push(disk_name);
        const disk = sceneElements.sceneGraph.getObjectByName(disk_name);

        if (disk.position.y<160 && disk.position.x != target_position_x) {
            disk.position.y += delta;
        }
        else if (disk.position.y >= 160 && disk.position.x > target_position_x) {
            disk.position.x -= delta;
        }
        else if (disk.position.y >= 160 && disk.position.x < target_position_x) {
            disk.position.x += delta;
        }
        else if (disk.position.x == target_position_x && disk.position.y > target_position_y) {
            disk.position.y -= delta;
        }
        else if (disk.position.x == target_position_x && disk.position.y == target_position_y) {
            stacks[move[0]].pop();
            stacks[move[1]].push(disk_name);
            step += 1;
        }
    }

    if (step==solution.length && simulate==true) {
        alert("Problem solved with "+step+" moves.");
        step += 1;
    }

    else {
        if (key1) {
            if (selected == null) {
                const disk_name = stacks[0].pop();
                const disk = sceneElements.sceneGraph.getObjectByName(disk_name);
                selected = disk;
            }
            else if (selected.position.y<160) {
                selected.position.y += delta;
            }
            else if (selected.position.y>=160 && selected.position.x==-50) {
                key1 = false;
            }
            else if (selected.position.y>=160 && selected.position.x>-50) {
                selected.position.x -= delta;
            }
            else if (selected.position.y>=160 && selected.position.x<-50) {
                selected.position.x += delta;
            }
        }
        if (key2) {
            if (selected == null) {
                const disk_name = stacks[1].pop();
                const disk = sceneElements.sceneGraph.getObjectByName(disk_name);
                selected = disk;
            }
            else if (selected.position.y<160) {
                selected.position.y += delta;
            }
            else if (selected.position.y>=160 && selected.position.x==0) {
                key2 = false;
            }
            else if (selected.position.y>=160 && selected.position.x>0) {
                selected.position.x -= delta;
            }
            else if (selected.position.y>=160 && selected.position.x<0) {
                selected.position.x += delta;
            }
        }
        if (key3) {
            if (selected == null) {
                const disk_name = stacks[2].pop();
                const disk = sceneElements.sceneGraph.getObjectByName(disk_name);
                selected = disk;
            }
            else if (selected.position.y<160) {
                selected.position.y += delta;
            }
            else if (selected.position.y>=160 && selected.position.x==50) {
                key3 = false;
            }
            else if (selected.position.y>=160 && selected.position.x>50) {
                selected.position.x -= delta;
            }
            else if (selected.position.y>=160 && selected.position.x<50) {
                selected.position.x += delta;
            }
        }
        if (keyEnter) {
            var stack = stacks[(selected.position.x+50)/50];
            if (tilt==0 && stack.length > 0 && Math.floor((parseInt(selected.name.substring(5))+2)/2)>Math.floor((parseInt(stack[stack.length-1].substring(5))+2)/2)) {
                tilt = 4;
            }
            else if (tilt != 0) {
                selected.position.x += tilted[tilt-1];
                tilt -= 1;
                if (tilt==0) keyEnter = false;
            }
            else if (selected.position.y > 108 + stack.length) {
                selected.position.y -= delta;
            }
            else {
                stack.push(selected.name);
                selected = null;
                keyEnter = false;
                steps += 1;
            }
        }
        if (stack_3.length==numberOfDisks*2 && finished==false) {
            alert("Congratulations! You have finished the Double Tower of Hanoi with "+steps+" moves.");
            steps += 1;
            finished = true;
        }
    }

    // Rendering
    helper.render(sceneElements);

    // NEW --- Update control of the camera
    sceneElements.control.update();

    requestAnimationFrame(computeFrame);
}