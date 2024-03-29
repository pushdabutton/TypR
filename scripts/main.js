
import GLTFLoader from '../js/GLTFLoader';
import wordList from './words'

//loading Screen--------------------------------------------
// An object to hold all the things needed for our loading screen
let loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 100),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshBasicMaterial({ color: 0xe62444 })
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

//game Over--------------------------------------------------
let textloader = new THREE.FontLoader();
let gameOver = false
let GameOverMesh;
let gameOverObj = {
    textloader,
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, 1280 / 720, 0.1, 2000),
}
let light4 = new THREE.PointLight(0xFFFFFF, 2, 1500)

const finalScore = (scorePoints) => {
    textloader.load('3Dmodels/Guardians_Regular.json', function (font) {
        let GameOverGeo = new THREE.TextGeometry(`Game Over \nScore ${scorePoints}`, {
            font: font,
            size: 50,
            height: 5,
            curveSegments: 70,
            bevelEnabled: true,
            bevelSize: 2,
            bevelOffset: 0,
            bevelSegments: 1

        });

        GameOverMesh = new THREE.Mesh(
            GameOverGeo,
            new THREE.MeshLambertMaterial({ color: 0xe62444 })
            );



        // meshWord.rotation.x = Math.PI * .1;
        // meshWord.rotation.y = Math.PI * .2;


        GameOverMesh.position.set(-300, 0, 5);
        gameOverObj.scene.add(GameOverMesh)
        gameOverObj.scene.add(light4)

    });
}

// gameOverObj.camera.lookAt(gameOverObj.message.position);
// gameOverObj.scene.add(GameOverMesh);




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

let ironman;
// // const loader = new GLTFLoader();
loader.load('3Dmodels/iron_man.glb', function (gltf) {
    ironman = gltf.scene;
    ironman.scale.x = ironman.scale.y = ironman.scale.z = 15;
    ironman.rotation.y = Math.PI * .10;
    ironman.position.z = -800;
    ironman.position.y = 100;
    ironman.position.x = 100

    ironman.rotation.x = Math.PI * -.40
    ironman.rotation.y = Math.PI
    scene.add(ironman);
})

//words------------------------------------------------------

// let textloader = new THREE.FontLoader(loadingManager);
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

//Instructions------------------------------------------------------------
let meshInst;
textloader.load('3Dmodels/Guardians_Regular.json', function (font) {
    let instGeo = new THREE.TextGeometry("Type.R \nPress Space \nFor New Words", {
        font: font,
        size: 50 ,
        height: 5,
        curveSegments: 70,
        bevelEnabled: true,
        bevelSize: 2,
        bevelOffset: 0,
        bevelSegments: 1

    });


    meshInst = new THREE.Mesh(
        instGeo,
        new THREE.MeshLambertMaterial({ color: 0xe62444 })
    );


    meshInst.rotation.x = Math.PI * .1;
    // meshWord.rotation.y = Math.PI * .2;


    scene.add(meshInst)
});

//score------------------------------------------------------------------


let score;
textloader.load('3Dmodels/Guardians_Regular.json', function (font) {
    let scoreGeo = new THREE.TextGeometry("Score ", {
        font: font,
        size: 2,
        height: 2,
        curveSegments: 70,
        // bevelEnabled: true,
        // bevelSize: 2,
        // bevelOffset: 0,
        // bevelSegments: 1

    });


    score = new THREE.Mesh(
        scoreGeo,
        new THREE.MeshLambertMaterial({ color: 0xe62444 })
    );


    score.rotation.y = Math.PI * .07;
    // meshWord.rotation.y = Math.PI * .2;


    scene.add(score)
});
let scorePoints = 0;
let scoreNum3D;

const pointUpdate = (scorePoints) => {
    textloader.load('3Dmodels/Guardians_Regular.json', function (font) {
        if(scoreNum3D) {scene.remove(scoreNum3D)}
        let scoreNumGeo = new THREE.TextGeometry(scorePoints.toString(), {
            font: font,
            size: 2,
            height: 2,
            curveSegments: 70,
            // bevelEnabled: true,
            // bevelSize: 2,
            // bevelOffset: 0,
            // bevelSegments: 1

        });


        scoreNum3D = new THREE.Mesh(
            scoreNumGeo,
            new THREE.MeshLambertMaterial({ color: 0xe62444 })
        );


        scoreNum3D.rotation.y = Math.PI * .08;
        // meshWord.rotation.y = Math.PI * .2;


        scene.add(scoreNum3D)
    });


}

//Time Left--------------------------------------------------
let timeLeftMesh;


const timeLeft = () => {
    textloader.load('3Dmodels/Guardians_Regular.json', function (font) {
        let timeLeftGeo = new THREE.TextGeometry(`Time Left`, {
            font: font,
            size: 20,
            height: 5,
            curveSegments: 70,
            bevelEnabled: true,
            bevelSize: 2,
            bevelOffset: 0,
            bevelSegments: 1

        });

        timeLeftMesh = new THREE.Mesh(
            timeLeftGeo,
            new THREE.MeshLambertMaterial({ color: 0xe62444 })
        );



        // meshWord.rotation.x = Math.PI * .1;
        // meshWord.rotation.y = Math.PI * .2;


        // timeLeftMesh.position.set(-300, 0, 5);
        timeLeftMesh.rotation.x = Math.PI * .1;
        scene.add(timeLeftMesh)



    });
}
timeLeft()
let timeLeftNum
const timeUpdate = (timeLeftInt) => {
    textloader.load('3Dmodels/Guardians_Regular.json', function (font) {
        if (timeLeftNum) { scene.remove(timeLeftNum) }
        let scoreNumGeo = new THREE.TextGeometry(timeLeftInt.toString(), {
            font: font,
            size: 20,
            height: 5,
            curveSegments: 70,
            // bevelEnabled: true,
            // bevelSize: 2,
            // bevelOffset: 0,
            // bevelSegments: 1

        });


        timeLeftNum = new THREE.Mesh(
            scoreNumGeo,
            new THREE.MeshLambertMaterial({ color: 0xe62444 })
        );


        // timeLeftNum.rotation.y = Math.PI * .08;
        timeLeftNum.rotation.x = Math.PI * .1;


        scene.add(timeLeftNum)
    });


}
timeUpdate(1000)


//audio-----------------------------------------------------------------
const songs = ['audio/Ghetto Gaza_3.mp3', 'audio/Sacrifice_3.mp3', 'audio/reptar_4.mp3', 'audio/Futuristic Love Cannon.mp3', 'audio/The Last Strand (2).mp3', 'audio/Futuristic Love Cannon.mp3', 'audio/Only Human_4.mp3', 'audio/City_5.mp3']
let song;

// song = document.createElement("audio");
// document.body.appendChild(song)
// song.setAttribute("loop")
// song.style.display = "hidden"


const playSong = () => {
    // song = new Audio(songs[Math.floor(Math.random() * songs.length)])
    // song.play()
    // song.loop()
    song = document.createElement("audio");
    document.body.appendChild(song)
    song.src = songs[Math.floor(Math.random() * songs.length)]
    song.volume = 0.30 
    console.log("song volume", song.volume)
    song.setAttribute("loop", "")
    song.setAttribute("autoplay", "")
    song.style.display = "hidden"
}
const stopSong = () => {
    // var element = document.getElementById(elementId);
    song.parentNode.removeChild(song);
}


//Render and EventListners------------------------------------------------
let songPlaying = false


document.addEventListener('keyup', (e) => {
    if (e.keyCode === 16) {
        if (!songPlaying){
            playSong()
            songPlaying = true
        }else{
            stopSong()
            songPlaying = false
        }
    }
})




let movingUp = false
let xOffset = -300
let yOffset = 65
let zOffset = -1000
let newWord = false 


// letterGenerator(randomWord())
let start = false
let startPos;
document.addEventListener('keyup', (e) => {
    if (String.fromCharCode(e.keyCode) === " "){

        if(!start) {
            start = true
            startPos = camera.position.z
        }

        if(letterList){
            letterList.forEach(el => {
                scene.remove(el)
                if(scorePoints > 0) {scorePoints -= 1}
            })
        }
        
        if(meshInst){
            scene.remove(meshInst)
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
let gunshot = new Audio("audio/gunshot.wav")
let gunshot2 = new Audio("audio/gunshot.wav")
let gunshot3 = new Audio("audio/gunshot.wav")
let gunshot4 = new Audio("audio/gunshot.wav")
let gunshot5 = new Audio("audio/gunshot.wav")
let gunshot6 = new Audio("audio/gunshot.wav")
let gunshot7 = new Audio("audio/gunshot.wav")
let gunshot8 = new Audio("audio/gunshot.wav")
let gunshot9 = new Audio("audio/gunshot.wav")
let gunshot10 = new Audio("audio/gunshot.wav")
let startSong = true

let gunshots = [gunshot, gunshot2, gunshot3, gunshot4, gunshot5, gunshot6, gunshot7, gunshot8, gunshot9, gunshot10]
let i = 0
document.addEventListener('keydown', (e) => {
    let value = String.fromCharCode(e.keyCode);
    currentLetter = value.toLowerCase()
    if(!(value == " ") && !(e.keyCode == 17) && !(e.keyCode == 16)) {
        muzzle = true

        
        flash.rotation.y = Math.PI;
        scene.add(flash)
        flash.children[1].material.color.r = 1
        flash.children[1].material.color.g = 0
        flash.children[1].material.color.b = 0.2
        flash.children[1].material.opacity = .5

        flash.position.z = rifle2.position.z - 28;
        flash.position.x = rifle2.position.x;
        flash.position.y = rifle2.position.y + 3;
        flash.scale.x = flash.scale.y = flash.scale.z = 2;
        light2.intensity = 7
        light2.position.set(flash.position.x, flash.position.y, flash.position.z - 20);


        gunshots[i].play()
        i += 1
        debugger
        if(i == gunshots.length) i = 0

        // debugger
        if(currentLetter !== letterList[0].geometry.parameters.text && scorePoints > 0){
            scorePoints -= 1
        }
    }

})

let gMode = false
document.addEventListener('keyup', (e) => {
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
let scorer = true
const render = function () {

    if(start && camera.position.z < startPos - 1000) {
        gameOver = true
    }
    
    
    if (RESOURCES_LOADED == false) {
        requestAnimationFrame(render);
        
        loadingScreen.box.position.x -= 0.05;
        if (loadingScreen.box.position.x < -10) loadingScreen.box.position.x = 10;
        loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
        
        renderer.render(loadingScreen.scene, loadingScreen.camera);
        return; // Stop the function here.
    }
    if(gameOver){
        requestAnimationFrame(render);
        if(scorer){
            finalScore(scorePoints)
            scorer = false
        }
        GameOverMesh.position.z -= 0.05;
        GameOverMesh.position.z -= 0.5;
        light4.position.set(GameOverMesh.position.x, GameOverMesh.position.y, GameOverMesh.position.z + 100)
        // if (gameOverObj.message.position.x < -10) gameOverObj.message.position.x = 10;
        // gameOverObj.message.position.z = gameOverObj.camera.position.z - 100;
        renderer.render(gameOverObj.scene, gameOverObj.camera);
        if(GameOverMesh.position.z < -500) {location.reload()}
        return; // Stop the function here.
    }


    if(meshInst) {
        meshInst.position.x = camera.position.x + xOffset - 400
        meshInst.position.y = camera.position.y + yOffset + 200
        meshInst.position.z = camera.position.z + zOffset + 100
    }
    pointUpdate(scorePoints)

    if(scoreNum3D){
        score.position.x = camera.position.x - 40
        score.position.y = camera.position.y - 15
        score.position.z = camera.position.z - 30 
        scoreNum3D.position.x = camera.position.x - 22
        scoreNum3D.position.y = camera.position.y - 13.5
        scoreNum3D.position.z = camera.position.z - 30 
    }

    if(timeLeftMesh){
        debugger
        timeLeftMesh.position.set(camera.position.x, camera.position.y + 180, camera.position.z - 300)
        timeLeftNum.position.set(camera.position.x + 250, camera.position.y + 180, camera.position.z - 300)
        timeUpdate(Math.floor(985 + camera.position.z))
    }


    if(camera.position.z < -500) {
        // ironman.position.z = camera.position.z - 200
        ironman.rotation.y += 0.02
        ironman.position.y -= 0.2
        ironman.position.x += 0.2
    }

    if(rifle2){
        requestAnimationFrame(render);   
        renderer.render(scene, camera);

        if (startSong) {
            playSong()
            startSong = false
            songPlaying = true
        }

        if(camera.position.z < -1000) {
            ship.rotation.y += 0.05
            ship.position.z -= 0.5
        }else {
            ship.rotation.y += 0.01
        }

        if(start){
            camera.position.z -= 0.3;
            rifle2.position.z -= 0.3;
            light3.position.z -= 0.3;
            planet.rotation.z -= 0.006;
            planet.position.z -= 0.06;
            tie.position.x -= 0.3
            tie.position.z -= 1
        }

        

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
                    if(scorePoints > 0) {scorePoints -= 1}
                }

                if (el.geometry.parameters.text === currentLetter && i == 0){
                    scene.remove(el)
                    currentLetter = ""
                    letterList.shift()
                    scorePoints += 1;
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

