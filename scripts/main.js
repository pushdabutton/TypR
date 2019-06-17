
import GLTFLoader from '../js/GLTFLoader';
import wordList from './words'

//loading Screen--------------------------------------------

// An object to hold all the things needed for our loading screen
let loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 100),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshBasicMaterial({ color: 0x4444ff })
    )
};
let loadingManager = null;
let RESOURCES_LOADED = false;



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
TextureLoader.load('3Dmodels/space_background.jpg', function (texture) {
    scene.background = texture;
});






//rifle------------------------------------------------------
let rifle2;
const loader = new GLTFLoader(loadingManager);
loader.load('3Dmodels/Rifle2.glb', function (gltf) {
    rifle2 = gltf.scene;
    rifle2.position.z + 10
    rifle2.scale.x = rifle2.scale.y = rifle2.scale.z = 5;
    rifle2.rotation.y = Math.PI;
    scene.add(rifle2);
    rifle2.position.z = camera.position.z - 12
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


let planet;

loader.load('3Dmodels/stace_station.glb', function (gltf) {
    planet = gltf.scene;
    planet.scale.x = planet.scale.y = planet.scale.z = 15;
    planet.rotation.y = Math.PI * .75;
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
    tie.position.z = -800;
    tie.position.y = 300;
    tie.position.x = 300


    scene.add(tie);
})

let ship;
loader.load('3Dmodels/Simple_Ship.glb', function (gltf) {
    ship = gltf.scene;
    ship.scale.x = ship.scale.y = ship.scale.z = 15;
    ship.rotation.y = Math.PI * .10;
    ship.position.z = -2000;
    ship.position.y = 300;
    ship.position.x = -300


    scene.add(ship);
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
        textloader.load('3Dmodels/Guardians_Regular.json', function (font) {
            let textGeo = new THREE.TextGeometry(el, {
                font: font,
                size: 50,
                height: 5,
                curveSegments: 70,
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



//Render and EventListners------------------------------------------------


let movingUp = false
let xOffset = -300
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
let light2 = new THREE.PointLight(0xFFFFFF, 1, 1000)
scene.add(light2);

document.addEventListener('keydown', (e) => {
    let value = String.fromCharCode(e.keyCode);
    currentLetter = value.toLowerCase()
    if(!(value == " ") && !(e.keyCode == 17)) {
        muzzle = true

        
        flash.rotation.y = Math.PI;
        scene.add(flash)
        flash.children[1].material.color.r = 1
        flash.children[1].material.color.g = 0
        flash.children[1].material.color.b = 0.2
        flash.children[1].material.opacity = .5
        debugger
        flash.position.z = rifle2.position.z - 28;
        flash.position.x = rifle2.position.x;
        flash.position.y = rifle2.position.y + 3;
        flash.scale.x = flash.scale.y = flash.scale.z = 2;
        light2.intensity = 7
        light2.position.set(flash.position.x, flash.position.y, flash.position.z - 20);
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

        if(camera.position.z < -1000) {
            ship.rotation.y += 0.05
            ship.position.z -= 0.5
        }else {
            ship.rotation.y += 0.01
        }

        console.log(camera.position.z)

        camera.position.z -= 0.3;
        rifle2.position.z -= 0.3;
        light3.position.z -= 0.3;
        planet.rotation.z -= 0.006;
        planet.position.z -= 0.06;

        tie.position.x -= 0.3
        tie.position.z -= 1

        if(newWord){
            for (let i = 0; i < letterList.length; i++) {
                let wordOffset = i * 70
                let el = letterList[i];
                let iOffset = 0

                if (el.geometry.parameters.text == 'i') {iOffset = 15}

                el.position.x = camera.position.x + xOffset + wordOffset + iOffset
                el.position.y = camera.position.y + yOffset
                el.position.z = camera.position.z + zOffset
                
                if(el.position.z >= camera.position.z - 100) {
                    newWord = false
                    scene.remove(el)
                }

                if (el.geometry.parameters.text === currentLetter && i == 0){
                    // debugger
                    scene.remove(el)
                    currentLetter = ""
                letterList.shift()
            }
        }   
        zOffset += 4
        }
            

        
        
        
        
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
        }

        
        if (rifle2.rotation.z > 0 && !gMode) {
            rifle2.rotation.z -= 0.15
            rifle2.position.z += 0.1
        }else if (rifle2.rotation.z < 0 && !gMode){
            rifle2.rotation.z = 0
            scene.remove(flash)
            light2.intensity = 0
            rifle2.position.z = camera.position.z - 12
        }
        if (rifle2.position.z < riflezPos) {
            rifle2.position.z = riflezPos
        }

        //Gmode---------
        if (muzzle && gMode) {
            // rifle2.position.y += 0.2
            rifle2.rotation.x += 0.2
            riflezPos = rifle2.position.x
            rifle2.position.z += 0.3
            muzzle = false
        }


        if (rifle2.rotation.x > 0 && gMode) {
            rifle2.rotation.x -= 0.15
            rifle2.position.x += 0.1
        } else if (rifle2.rotation.x < 0 && gMode) {
            rifle2.rotation.x = 0
            scene.remove(flash)
            light2.intensity = 0
            rifle2.position.z = camera.position.z - 12
        }
        if (rifle2.position.x > 0) {
            rifle2.position.x -= 0.1
        }
    }
} 

render();

