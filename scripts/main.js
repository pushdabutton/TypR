// import * as THREE from '../js/three';
import GLTFLoader from '../js/GLTFLoader';
import wordList from './words'


//Scene and Camera-------------------------------------------
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
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
//rifle------------------------------------------------------
let rifle2;
const loader = new GLTFLoader();
loader.load('3Dmodels/rifle2.glb', function (gltf) {
    rifle2 = gltf.scene;
    rifle2.scale.x = rifle2.scale.y = rifle2.scale.z = 5;
    // rifle2.rotation.y = Math.PI * .5;
    rifle2.rotation.y = Math.PI;
    scene.add(rifle2);
})

//floor------------------------------------------------------


let meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000, 100, 100),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    );
    meshFloor.rotation.x = Math.PI / 2; // Rotate the floor 90 degrees
    meshFloor.position.y -= 10
    meshFloor.position.z -= 200
    scene.add(meshFloor);

    // camera.position.set(0, player.height, -5);
    // camera.lookAt(new THREE.Vector3(0, 1.8, 0));
let stage;
// const loader = new GLTFLoader();
loader.load('3Dmodels/Hallway.glb', function (gltf) {
    stage = gltf.scene;
    // stage.scale.x = stage.scale.y = stage.scale.z = 15;
    // stage.rotation.y = Math.PI * .5;
    // stage.rotation.x = 
    // stage.rotation.x = Math.PI * .5;
    stage.position.x = 100;
    stage.position.z = 20; 
    // stage.position.y = -150;


    scene.add(stage);
})


//words------------------------------------------------------

let textloader = new THREE.FontLoader();
let meshWord;
let randomWord = wordList[Math.floor(Math.random() * wordList.length)]



const wordSplitter = (word) => {
    let words = word.split('')
    return words
}

const letterList = []; 


const letterGenerator = function(word) {
    let letters = wordSplitter(word)

    letters.forEach(el => {
        textloader.load('node_modules/three/examples/fonts/droid/droid_sans_regular.typeface.json', function (font) {
            console.log(el)
            let textGeo = new THREE.TextGeometry(el, {
                font: font,
                size: 50,
                height: 5,
                curveSegments: 50,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 8,
                bevelOffset: 0,
                bevelSegments: 50
            });


            meshWord = new THREE.Mesh(
                textGeo,
                new THREE.MeshLambertMaterial({ color: 0x00f0ff })
            );


            meshWord.rotation.x = Math.PI * .1;


            // scene.add(meshWord)
            letterList.push(meshWord)

        });
    })
}

var light3 = new THREE.PointLight(0xFFFFFF, 2, 1000)
light3.position.set(camera.position.x, camera.position.y, camera.position.z);
scene.add(light3);

letterGenerator(randomWord)

//KeyPress--------------------------------------------------
document.addEventListener('keydown', (e) => {
    let value = String.fromCharCode(e.keyCode);
    console.log(value)
})




let meshWord2;
textloader.load('node_modules/three/examples/fonts/droid/droid_sans_regular.typeface.json', function (font) {

    let textGeo2 = new THREE.TextGeometry(randomWord, {
        font: font,
        size: 50,
        height: 5,
        curveSegments: 50,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 50
    });


    meshWord2 = new THREE.Mesh(
        textGeo2,
        new THREE.MeshLambertMaterial({ color: 0x00f0ff })
    );

    
    meshWord2.rotation.x = Math.PI * .1;
    

    scene.add(meshWord2)
    var light3 = new THREE.PointLight(0xFFFFFF, 2, 1000)
    light3.position.set(camera.position.x, camera.position.y, camera.position.z);
    scene.add(light3);   
});

// //KeyPress--------------------------------------------------
// document.addEventListener('keydown', (e)=>{
//     let value = String.fromCharCode(e.keyCode);
//     console.log(value)
// })

//lighting=--------------------------------------------------
var light = new THREE.PointLight(0xFFFFFF, 1, 1000)
light.position.set(0, 0, 0);
scene.add(light);

var light2 = new THREE.PointLight(0xFFFFFF, 2, 1000)
light.position.set(0, 0, 25);
scene.add(light2);

//Render------------------------------------------------------
let movingUp = false
let xOffset = -150
let yOffset = 20
let zOffset = -400

const letterToScene = (letters) => {
    letters.forEach(el => {
        scene.add(el)
    })
}

letterToScene(letterList)


var render = function () {
    requestAnimationFrame(render);   
    renderer.render(scene, camera);
    camera.position.z -= 0.3;
    rifle2.position.z -= 0.3;
    letterList.forEach(el => {
        debugger
        el.position.x = camera.position.x + xOffset
        el.position.y = camera.position.y + yOffset
        el.position.z = camera.position.z + zOffset
        zOffset += 1
    })

    meshWord2.position.x = camera.position.x + xOffset
    meshWord2.position.y = camera.position.y + yOffset
    meshWord2.position.z = camera.position.z + zOffset
    zOffset += 1
    // light3.position.x = camera.position.x - 100
    // light3.position.y = camera.position.y
    // light3.position.z = camera.position.z - 200
    
    
    if (movingUp) {rifle2.position.y -= 0.02}
    else if (!movingUp) {rifle2.position.y += 0.02}

    if (rifle2.position.y > 0.3) {movingUp = true;}
    else if (rifle2.position.y < -0.3) {movingUp = false;}

} 

render();
























// var raycaster = new THREE.Raycaster();
// var mouse = new THREE.Vector2();
// var geometry = new THREE.BoxGeometry(1, 1, 1);
// var material = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });
//var mesh = new THREE.Mesh(geometry, material);

//scene.add(mesh);

// let meshX = -10;
// for (var i = 0; i < 15; i++) {
    //     var mesh = new THREE.Mesh(geometry, material);
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

//     var intersects = raycaster.intersectObjects(scene.children, true);
//     for (var i = 0; i < intersects.length; i++) {
//         this.tl = new TimelineMax();
//         this.tl.to(intersects[i].object.scale, 1, { x: 2, ease: Expo.easeOut })
//         this.tl.to(intersects[i].object.scale, .5, { x: .5, ease: Expo.easeOut })
//         this.tl.to(intersects[i].object.position, .5, { x: 2, ease: Expo.easeOut })
//         this.tl.to(intersects[i].object.rotation, .5, { y: Math.PI * .5, ease: Expo.easeOut }, "=-1.5")
//     }
// }



// window.addEventListener('mousemove', onMouseMove);

// renderer.render(scene, camera)
// var mtlLoader = new THREE.MTLLoader();
// mtlLoader.setResourcePath('/3Dmodels/');
// mtlLoader.setPath('/3Dmodels/');
// mtlLoader.load('rifle.mtl', function (materials) {

//     materials.preload();

//     var objLoader = new THREE.OBJLoader();
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