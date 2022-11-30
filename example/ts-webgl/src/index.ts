/**
 * @description index
 */
// import main from './1.getting_started/6.1.coordinate_systems'
// import main from './1.getting_started/6.2.coordinate_systems_depth'
// import main from './1.getting_started/6.3.coordinate_systems_multiple'
// import main from './1.getting_started/7.1.camera_circle'
import main from './1.getting_started/7.2.camera_keyboard_dt'

// import main from './02.lighting/1.color'
// import main from './02.lighting/2.1.basic_lighting_diffuse'2.2.basic_lighting_specular
// import main from './02.lighting/2.2.basic_lighting_specular'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl2');
if (!gl) {
  console.log('Failed to get gl ceontext.');
} else {
  main(gl, canvas);
}

