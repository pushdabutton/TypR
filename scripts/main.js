// import * as THREE from '../js/three';
import GLTFLoader from '../js/GLTFLoader';
import wordList from './words'

//loading Screen--------------------------------------------

// An object to hold all the things needed for our loading screen
var loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 100),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshBasicMaterial({ color: 0x4444ff })
    )
};
var loadingManager = null;
var RESOURCES_LOADED = false;



loadingScreen.box.position.set(0, 0, 5);
loadingScreen.camera.lookAt(loadingScreen.box.position);
loadingScreen.scene.add(loadingScreen.box);

// Create a loading manager to set RESOURCES_LOADED when appropriate.
// Pass loadingManager to all resource loaders.
loadingManager = new THREE.LoadingManager();

loadingManager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total);
};

loadingManager.onLoad = function () {
    console.log("loaded all resources");
    RESOURCES_LOADED = true;
};



//Scene and Camera-------------------------------------------
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000)
camera.position.z = 15;
camera.position.x = -10;
camera.position.y = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
})


//Backgorund Image-------------------------------------------

let TextureLoader = new THREE.TextureLoader(loadingManager);
TextureLoader.load('3Dmodels/space_background.jpeg', function (texture) {
    scene.background = texture;
});






//rifle------------------------------------------------------
let rifle2;
const loader = new GLTFLoader(loadingManager);
loader.load('3Dmodels/Rifle2.glb', function (gltf) {
    rifle2 = gltf.scene;
    rifle2.scale.x = rifle2.scale.y = rifle2.scale.z = 5;
    // rifle2.rotation.y = Math.PI * .5;
    rifle2.rotation.y = Math.PI;
    scene.add(rifle2);
})
let flash;
loader.load('3Dmodels/muzzle_flashes.glb', function (gltf){
    flash = gltf.scene;
})
//floor and background assets------------------------------------------------------


let meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 10000, 100, 100),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    );
    meshFloor.rotation.x = Math.PI / 2; // Rotate the floor 90 degrees
    meshFloor.position.y -= 10
    meshFloor.position.z -= 200
    scene.add(meshFloor);

    // camera.position.set(0, player.height, -5);
    // camera.lookAt(new THREE.Vector3(0, 1.8, 0));
let planet;
// // const loader = new GLTFLoader();
loader.load('3Dmodels/stace_station.glb', function (gltf) {
    planet = gltf.scene;
    planet.scale.x = planet.scale.y = planet.scale.z = 15;
    planet.rotation.y = Math.PI * .75;
    // planet.rotation.x = 
    // planet.rotation.x = Math.PI * .5;
    // planet.position.x = 400;
    planet.position.z = -2000; 
    planet.position.y = 500;
    planet.position.x = -600


    scene.add(planet);
    let light4 = new THREE.PointLight(0xFFFFFF, 2, 1500)
    light4.position.set(planet.position.x, planet.position.y + 100, planet.position.z - 100);
    scene.add(light4); 
})

let tie;
// // const loader = new GLTFLoader();
loader.load('3Dmodels/tie-fighter.glb', function (gltf) {
    tie = gltf.scene;
    tie.scale.x = tie.scale.y = tie.scale.z = 15;
    tie.rotation.y = Math.PI * .10;
    // tie.rotation.x = 
    // tie.rotation.x = Math.PI * .5;
    // tie.position.x = 400;
    tie.position.z = -800;
    tie.position.y = 300;
    tie.position.x = 300


    scene.add(tie);
})


//words------------------------------------------------------

let textloader = new THREE.FontLoader(loadingManager);
let meshWord;
const randomWord = () => wordList[Math.floor(Math.random() * wordList.length)]



const wordSplitter = (word) => {
    let words = word.split('')
    return words
}

let letterList; 


const letterGenerator = function(word) {
    let letters = wordSplitter(word)
    letterList = [];
    letters.forEach(el => {
        textloader.load('node_modules/three/examples/fonts/gentilis_bold.typeface.json', function (font) {
            let textGeo = new THREE.TextGeometry(el, {
                font: font,
                size: 50,
                height: 5,
                // curveSegments: 70,
                bevelEnabled: true,
                bevelSize: 2,
                bevelOffset: 0,
                bevelSegments: 1

            });


            meshWord = new THREE.Mesh(
                textGeo,
                new THREE.MeshLambertMaterial({ color: 0xe62444 })
            );


            meshWord.rotation.x = Math.PI * .1;
            // meshWord.rotation.y = Math.PI * .2;


            scene.add(meshWord)
            letterList.push(meshWord)

        });
    })
}

let light3 = new THREE.PointLight(0xFFFFFF, 2, 1500)
light3.position.set(camera.position.x, camera.position.y + 100, camera.position.z - 100);
scene.add(light3);


//KeyPress--------------------------------------------------
// document.addEventListener('keydown', (e) => {
//     let value = String.fromCharCode(e.keyCode);
//     console.log(value)
// })




// let meshWord2;
// textloader.load('node_modules/three/examples/fonts/droid/droid_sans_regular.typeface.json', function (font) {

//     let textGeo2 = new THREE.TextGeometry(randomWord, {
//         font: font,
//         size: 50,
//         height: 5,
//         curveSegments: 50,
//         bevelEnabled: false,
//         bevelThickness: 1,
//         bevelSize: 8,
//         bevelOffset: 0,
//         bevelSegments: 50
//     });
    

//     meshWord2 = new THREE.Mesh(
//         textGeo2,
//         new THREE.MeshLambertMaterial({ color: 0x00f0ff })
//         );

        
//     meshWord2.rotation.x = Math.PI * .1;
    

//     scene.add(meshWord2)
//     let light3 = new THREE.PointLight(0xFFFFFF, 2, 1000)
//     light3.position.set(camera.position.x, camera.position.y, camera.position.z);
//     scene.add(light3);   
// });



//lighting=--------------------------------------------------
// let light = new THREE.PointLight(0xFFFFFF, 1, 1000)
// light.position.set(0, 0, 0);
// scene.add(light);




//Render------------------------------------------------------


let movingUp = false
let xOffset = -200
let yOffset = 65
let zOffset = -1000
let newWord = false 

// letterGenerator(randomWord())

document.addEventListener('keyup', (e) => {
    if (String.fromCharCode(e.keyCode) === " "){
        if(letterList){
            letterList.forEach(el => {
                scene.remove(el)
            })
        }
        letterList = [];
        letterGenerator(randomWord())
        newWord = true
        zOffset = -1000  
        
    }
})
let currentLetter;
let muzzle = false
let light2 = new THREE.PointLight(0xFFFFFF, 1, 500)
scene.add(light2);

document.addEventListener('keydown', (e) => {
    let value = String.fromCharCode(e.keyCode);
    currentLetter = value.toLowerCase()
    if(!(value == " ") && !(e.keyCode == 17)) {
        muzzle = true

        
        flash.rotation.y = Math.PI;
        scene.add(flash)
        flash.children[1].material.color.r = 1
        flash.children[1].material.color.g = 0.15
        flash.children[1].material.color.b = 0
        flash.position.z = rifle2.position.z - 28;
        flash.position.x = rifle2.position.x;
        flash.position.y = rifle2.position.y + 3;
        flash.scale.x = flash.scale.y = flash.scale.z = 2;
        light2.intensity = 2
        light2.position.set(flash.position.x, flash.position.y, flash.position.z);
    }

})

let gMode = false
document.addEventListener('keydown', (e) => {
    if (e.keyCode == 17){
        if(gMode) {
            rifle2.rotation.z = 0
            gMode = false
        }else {
            rifle2.rotation.z = Math.PI * -.25
            gMode = true
        }
    }

})

const render = function () {

    if (RESOURCES_LOADED == false) {
        requestAnimationFrame(render);

        loadingScreen.box.position.x -= 0.05;
        if (loadingScreen.box.position.x < -10) loadingScreen.box.position.x = 10;
        loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);

        renderer.render(loadingScreen.scene, loadingScreen.camera);
        return; // Stop the function here.
    }

    if(rifle2){
        requestAnimationFrame(render);   
        renderer.render(scene, camera);
        camera.position.z -= 0.3;
        rifle2.position.z -= 0.3;
        light3.position.z -= 0.3;
        planet.rotation.z -= 0.006;
        planet.position.z -= 0.06;

        tie.position.x -= 0.3
        tie.position.z -= 1

        // if (camera.position.z > meshFloor.position.z - 500) { meshFloor.position.z = camera.position.z - 500}
        
        
        // const WordMaker = () => {
            // debugger
            if(newWord){
                for (let i = 0; i < letterList.length; i++) {
                    let wordOffset = i * 50
                let el = letterList[i];
                let mOffset = 0
                if (el.geometry.parameters.text == 'm') {mOffset = -18}
                el.position.x = camera.position.x + xOffset + wordOffset + mOffset
                el.position.y = camera.position.y + yOffset
                el.position.z = camera.position.z + zOffset
                
                if(el.position.z >= camera.position.z - 100) {
                    newWord = false
                    scene.remove(el)
                }
                // if(currentLetter === null) {
                    
                    // }
                    if (el.geometry.parameters.text === currentLetter && i == 0){
                        // debugger
                        scene.remove(el)
                        currentLetter = ""
                        letterList.shift()
                    }
                    // const keyPress = document.addEventListener('keydown', (e) => {
                //     let value = String.fromCharCode(e.keyCode);
                //     if (el.geometry.parameters.text === value.toLowerCase()){
                    //         scene.remove(el)
                    //     }
                //     document.removeEventListener('keydown', keyPress)
                //     // console.log(el)
                //     // debugger
                // })
            }   
            zOffset += 4
        }
            
        // }
        // meshWord2.position.x = camera.position.x + xOffset
        // meshWord2.position.y = camera.position.y + yOffset
        // meshWord2.position.z = camera.position.z + zOffset
        // zOffset += 1
        // light3.position.x = camera.position.x - 100
        // light3.position.y = camera.position.y
        // light3.position.z = camera.position.z - 200
        
        
        
        
        
        if (movingUp) {rifle2.position.y -= 0.02}
        else if (!movingUp) {rifle2.position.y += 0.02}
        
        if (rifle2.position.y > 0.3) {
            movingUp = true;
            rifle2.position.y = 0.3
        }
        else if (rifle2.position.y < -0.3) {movingUp = false;}
        let riflezPos
        if(muzzle && !gMode){
            rifle2.position.y += 0.2
            rifle2.rotation.z += 0.1
            riflezPos = rifle2.position.z
            rifle2.position.z += 0.3
            muzzle = false
        }else
        
        if (rifle2.rotation.z > 0 && !gMode) {
            rifle2.rotation.z -= 0.15
            rifle2.position.z += 0.1
        }else if (rifle2.rotation.z < 0 && !gMode){
            debugger
            rifle2.rotation.z = 0
            scene.remove(flash)
            light2.intensity = 0
            rifle2.position.z = camera.position.z - 12
        }
        if (rifle2.position.z < riflezPos) {
            rifle2.position.z = riflezPos
        }
    }
} 

render();
























// let raycaster = new THREE.Raycaster();
// let mouse = new THREE.Vector2();
// let geometry = new THREE.BoxGeometry(1, 1, 1);
// let material = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });
//let mesh = new THREE.Mesh(geometry, material);

//scene.add(mesh);

// let meshX = -10;
// for (let i = 0; i < 15; i++) {
    //     let mesh = new THREE.Mesh(geometry, material);
//     mesh.position.x = (Math.random() - 0.5) * 10;
//     mesh.position.y = (Math.random() - 0.5) * 10;
//     mesh.position.z = (Math.random() - 0.5) * 10;
//     scene.add(mesh);
//     meshX += 1;
// }



// function onMouseMove(event) {
    //     event.preventDefault();
    
    //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

//     raycaster.setFromCamera(mouse, camera);

//     let intersects = raycaster.intersectObjects(scene.children, true);
//     for (let i = 0; i < intersects.length; i++) {
//         this.tl = new TimelineMax();
//         this.tl.to(intersects[i].object.scale, 1, { x: 2, ease: Expo.easeOut })
//         this.tl.to(intersects[i].object.scale, .5, { x: .5, ease: Expo.easeOut })
//         this.tl.to(intersects[i].object.position, .5, { x: 2, ease: Expo.easeOut })
//         this.tl.to(intersects[i].object.rotation, .5, { y: Math.PI * .5, ease: Expo.easeOut }, "=-1.5")
//     }
// }



// window.addEventListener('mousemove', onMouseMove);

// renderer.render(scene, camera)
// let mtlLoader = new THREE.MTLLoader();
// mtlLoader.setResourcePath('/3Dmodels/');
// mtlLoader.setPath('/3Dmodels/');
// mtlLoader.load('rifle.mtl', function (materials) {

//     materials.preload();

//     let objLoader = new THREE.OBJLoader();
//     objLoader.setMaterials(materials);
//     objLoader.setPath('/3Dmodels/');
//     objLoader.load('rifle.obj', function (object) {
//         console.log(object)
//         scene.add(object);
//         // object.position.z -= 1000;

//     });

// });



// const objloader = new THREE.OBJLoader();
// objloader.load('3Dmodels/rifle.obj', handle_load)

// console.log(objloader)

// function handle_load(geometry, materials) {
//     let mesh = new THREE.Mesh(geometry, materials);
//     scene.add(mesh)
//     mesh.position.z = -1000
// }

// loader.load('path/to/model.glb', function (gltf) {

//     scene.add(gltf.scene);

// })

// const animate = function() {
//     requestAnimationFrame(animate);
// }