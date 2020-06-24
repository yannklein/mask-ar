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

   // CREATE A CUBE
  // const cubeGeometry = new THREE.BoxGeometry(1,1,1);
  // const cubeMaterial = new THREE.MeshNormalMaterial();
  // const threeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  // threeCube.frustumCulled = false;
  // threeStuffs.faceObject.add(threeCube);

  const loader = new THREE.TextureLoader();

  loader.load(
    './images/logo.png',
    (texture) => {
      const leftGlass = createCircle({
        matParams: {
          map: texture,
          side: THREE.DoubleSide
        },
        position: { x: -0.32, y: 0.2, z: 0.6 },
        radius: 0.2
      });
      leftGlass.frustumCulled = false;
      threeStuffs.faceObject.add(leftGlass);

      const rightGlass = createCircle({
        matParams: {
          map: texture,
          side: THREE.DoubleSide
        },
        position: { x: 0.32, y: 0.2, z: 0.6 },
        radius: 0.2
      });
      rightGlass.frustumCulled = false;
      threeStuffs.faceObject.add(rightGlass);
    },
    //onProgress
    undefined,
    // onError callback
   (err) => {
      console.error( 'An error happened.' );
    }
  );

  createGltf(threeStuffs, 0.13);

  const invisiblePlane = createPlane();
  invisiblePlane.frustumCulled = false;
  threeStuffs.faceObject.add(invisiblePlane);

  //CREATE THE CAMERA
  THREECAMERA = THREE.JeelizHelper.create_camera();
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

