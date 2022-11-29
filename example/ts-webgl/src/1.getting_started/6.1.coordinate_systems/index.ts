import { vs, fs } from './6.1.coordinate_systems';
import container from '../../resource/container.jpg';
import awesomeface from '../../resource/container.jpg';


export default function main(gl: WebGL2RenderingContext) {
  const vertices = new Float32Array([
    // positions          // texture coords
    0.5, 0.5, 0.0, 1.0, 1.0, // top right
    0.5, -0.5, 0.0, 1.0, 0.0, // bottom right
    -0.5, -0.5, 0.0, 0.0, 0.0, // bottom left
    -0.5, 0.5, 0.0, 0.0, 1.0  // top left 
  ]);

  const indices = new Int32Array([
    0, 1, 3, // first triangle
    1, 2, 3  // second triangle
  ]);

  const vbo = gl.createBuffer();
  const vao = gl.createVertexArray();
  const ebo = gl.createBuffer();

  gl.bindVertexArray(vao);

  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  const FSIZE = vertices.BYTES_PER_ELEMENT;

  // position attribute
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * FSIZE, 0);
  gl.enableVertexAttribArray(0);
  // texture coord attribute
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * FSIZE, 3 * FSIZE);
  gl.enableVertexAttribArray(1);

  // load and create a texture
  const texture1 = gl.createTexture();
  const texture2 = gl.createTexture();

  // texture1
  //----------------------------------------------------------
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  // set the texture wrapping parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  // set texture filtering parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // texture2
  //----------------------------------------------------------
  gl.bindTexture(gl.TEXTURE_2D, texture2);
  // set the texture wrapping parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  // set texture filtering parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // load image, create  texture and generate mipmaps
  let g_texUnit1 = false,
    g_texUnit2 = false;

  const image1 = new Image();
  const image2 = new Image();

  image1.src = container;
  image2.src = awesomeface;

  image1.onload = function () {
    g_texUnit1 = true;
    if (g_texUnit1 && g_texUnit2) {
      loadTexture();
    }
  }
  image2.onload = function () {
    g_texUnit2 = true;
    if (g_texUnit1 && g_texUnit2) {
      loadTexture();
    }
  }

  function loadTexture() {
    console.log('loadTexture')
  }

}

