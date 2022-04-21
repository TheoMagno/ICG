"use strict";

const helper = {

    initEmptyScene: function (sceneElements) {

        // ************************** //
        // Create the 3D scene
        // ************************** //
        sceneElements.sceneGraph = new THREE.Scene();

        // ************************** //
        // Add camera
        // ************************** //
        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000 );
        sceneElements.camera = camera;
        camera.position.set(0, 250, 200);
        camera.lookAt(0, 0, 0);

        // ************************** //
        // NEW --- Control for the camera
        // ************************** //
        sceneElements.control = new THREE.OrbitControls(camera);
        sceneElements.control.screenSpacePanning = true;


        // ************************** //
        // Illumination
        // ************************** //

        // ************************** //
        // Add ambient light
        // ************************** //
        const ambientLight = new THREE.AmbientLight('rgb(255,255,255)', 1);
        sceneElements.sceneGraph.add(ambientLight);
        ambientLight.castShadow = true;

        // ************************* //
        // Add center pivots
        // ************************* //

       // ***************************** //
        // Add spotlight (with shadows)
        // ***************************** //
        const spotLight = new THREE.SpotLight('rgb(255, 255, 255)', 0.5);
        spotLight.position.set(0, 200, 50);
        sceneElements.sceneGraph.add(spotLight);

        // Setup shadow properties for the spotlight
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;

        // Give a name to the spot light
        spotLight.name = "light_1";

        const spotLight_2 = new THREE.SpotLight('rgb(255, 255, 255)', 0.5);
        spotLight_2.position.set(-50, 200, 50);
        sceneElements.sceneGraph.add(spotLight_2);

        // Setup shadow properties for the spotlight
        spotLight_2.castShadow = true;
        spotLight_2.shadow.mapSize.width = 2048;
        spotLight_2.shadow.mapSize.height = 2048;

        // Give a name to the spot light
        spotLight_2.name = "light_2";

        const spotLight_3 = new THREE.SpotLight('rgb(255, 255, 255)', 0.5);
        spotLight_3.position.set(50, 200, 50);
        sceneElements.sceneGraph.add(spotLight_3);

        // Setup shadow properties for the spotlight
        spotLight_3.castShadow = true;
        spotLight_3.shadow.mapSize.width = 2048;
        spotLight_3.shadow.mapSize.height = 2048;

        // Give a name to the spot light
        spotLight_3.name = "light_3";
        

        // *********************************** //
        // Create renderer (with shadow map)
        // *********************************** //
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        sceneElements.renderer = renderer;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor('rgb(0, 0, 0)', 1.0);
        renderer.setSize(width, height);
        
        // Setup shadowMap property
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;


        // **************************************** //
        // Add the rendered image in the HTML DOM
        // **************************************** //
        const htmlElement = document.querySelector("#Tag3DScene");
        htmlElement.appendChild(renderer.domElement);
    },

    render: function render(sceneElements) {
        sceneElements.renderer.render(sceneElements.sceneGraph, sceneElements.camera);
    },
};