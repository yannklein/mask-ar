"use strict";

let THREECAMERA = null;

// callback: launched if a face is detected or lost.
function detect_callback(faceIndex, isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback(): DETECTED');
  } else {
    console.log('INFO in detect_callback(): LOST');
  }
}

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
  const threeStuffs = THREE.JeelizHelper.init(spec, detect_callback);

  // Scene objects
  createGltf(threeStuffs, 11, {x:0, y:-0.1, z:0});

  //CREATE THE CAMERA
  THREECAMERA = THREE.JeelizHelper.create_camera();

  // CREATE AN AMBIENT LIGHT
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  threeStuffs.scene.add(ambientLight);

  // CREATE A DIRECTIONALLIGHT
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(100, 1000, 1000);
  threeStuffs.scene.add(dirLight);

} // end init_threeScene()

// launched by body.onload():
function main(){
  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    callback: function(isError, bestVideoSettings){
      init_faceFilter(bestVideoSettings);
    }
  })
}

function init_faceFilter(videoSettings){
  JEEFACEFILTERAPI.init({
    followZRot: true,
    canvasId: 'jeeFaceFilterCanvas',
    NNCpath: './lib/', // root of NNC.json file
    maxFacesDetected: 1,
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. ERR =', errCode);
        return;
      }

      console.log('INFO: JEEFACEFILTERAPI IS READY');
      init_threeScene(spec);
    },

    // called at each render iteration (drawing loop):
    callbackTrack: function(detectState){
      THREE.JeelizHelper.render(detectState, THREECAMERA);
    }
  }); //end JEEFACEFILTERAPI.init call
}

