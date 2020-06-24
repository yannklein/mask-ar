const createPlane = (params = {
  matParams: {color: 0xffff00, side: THREE.DoubleSide},
  position: { x:0, y:0.5, z:0.3 },
  rotation: { x:0, y:0, z:0 },
  size: {x:1, y:3}
}) => {
  const geometry = new THREE.PlaneGeometry(params.size.x,params.size.y);
  const material = new THREE.MeshBasicMaterial({
    colorWrite: false,
    // color: params.matParams.color
  });
  const plane = new THREE.Mesh(geometry, material);
  // plane.rotation.x = -Math.PI/2;
  plane.position.y = 0.5;
  plane.position.z = 0.3;
  return plane;
}
