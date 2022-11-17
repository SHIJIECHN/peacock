var image = new Image();
image.onload = function () {
  render(image);
}
image.src = './container.jpg';

function render(image) {
  const ourShader = new Shader(gl);
  // 获取属性位置
  const positionAttributeLocation = gl.getAttribLocation(ourShader.program, 'aPos');
  const colorAttributeLocation = gl.getAttribLocation(ourShader.program, 'aColor');
  const texCoordAttributeLocation = gl.getAttribLocation(ourShader.program, 'aTexCoord');
  // uniforms
  const imageLocation = gl.getUniformLocation(ourShader.program, 'texturel')

  const vertices = new Float32Array([
    // position  // color  // texcoord
    0.5, 0.5, 0, 1, 0, 0, 1, 1,// 上右
    0.5, -0.5, 0, 0, 1, 0, 1, 0,// 下右
    -0.5, -0.5, 0, 0, 0, 1, 0, 0,// 下左
    -0.5, 0.5, 0, 1, 1, 0, 0, 1 // 上左
  ]);
  // const colors = new Float32Array([
  //   1, 0, 0,
  //   0, 1, 0,
  //   0, 0, 1,
  //   1, 1, 0
  // ]);
  // const textureCoords = new Float32Array([
  //   1, 1,
  //   1, 0,
  //   0, 0,
  //   0, 1
  // ]);

  const indices = new Int32Array([
    0, 1, 3,
    1, 2, 3
  ]);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const type = gl.FLOAT;
  const normalize = false;
  // const stride = 0;
  // const offset = 0;
  const FSIZE = vertices.BYTES_PER_ELEMENT;
  // 位置
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionAttributeLocation, 3, type, normalize, 8 * FSIZE, 0);
  gl.enableVertexAttribArray(positionAttributeLocation);

  // 索引
  const ebo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  // 颜色
  // const colorBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  gl.vertexAttribPointer(colorAttributeLocation, 3, type, normalize, 8 * FSIZE, 3 * FSIZE);
  gl.enableVertexAttribArray(colorAttributeLocation);

  // 纹理坐标
  // const texCoordBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW);
  gl.vertexAttribPointer(texCoordAttributeLocation, 2, type, normalize, 8 * FSIZE, 6 * FSIZE);
  gl.enableVertexAttribArray(texCoordAttributeLocation);

  // 创建纹理
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  const mipLevel = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  // gl.texImage2D(gl.TEXTURE_2D,
  //   mipLevel,
  //   internalFormat,
  //   srcFormat,
  //   srcType,
  //   image
  // );

  const dp = new Array(image.height * image.width * 4).fill(255);
  const img = new Uint8Array(dp);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0,
    gl.RGBA, gl.UNSIGNED_BYTE,
    img);

  // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.2, .3, .3, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  ourShader.use();
  gl.bindVertexArray(vao);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.uniform1i(imageLocation, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

  // gl.drawArrays(gl.TRIANGLES, 0, 4);

  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
}


// var vertexShaderSource = `#version 300 es

// // an attribute is an input (in) to a vertex shader.
// // It will receive data from a buffer
// in vec2 a_position;
// in vec2 a_texCoord;

// // Used to pass in the resolution of the canvas
// uniform vec2 u_resolution;

// // Used to pass the texture coordinates to the fragment shader
// out vec2 v_texCoord;

// // all shaders have a main function
// void main() {

//   // convert the position from pixels to 0.0 to 1.0
//   vec2 zeroToOne = a_position / u_resolution;

//   // convert from 0->1 to 0->2
//   vec2 zeroToTwo = zeroToOne * 2.0;

//   // convert from 0->2 to -1->+1 (clipspace)
//   vec2 clipSpace = zeroToTwo - 1.0;

//   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

//   // pass the texCoord to the fragment shader
//   // The GPU will interpolate this value between points.
//   v_texCoord = a_texCoord;
// }
// `;

// var fragmentShaderSource = `#version 300 es

// // fragment shaders don't have a default precision so we need
// // to pick one. highp is a good default. It means "high precision"
// precision highp float;

// // our texture
// uniform sampler2D u_image;

// // the texCoords passed in from the vertex shader.
// in vec2 v_texCoord;

// // we need to declare an output for the fragment shader
// out vec4 outColor;

// void main() {
//   outColor = texture(u_image, v_texCoord);
// }
// `;

// var image = new Image();
// image.src = "./container.jpg";  // MUST BE SAME DOMAIN!!!
// image.onload = function () {
//   render(image);
// };

// function render(image) {
//   // Get A WebGL context
//   /** @type {HTMLCanvasElement} */
//   var canvas = document.querySelector("#canvas");
//   var gl = canvas.getContext("webgl2");
//   if (!gl) {
//     return;
//   }

//   // setup GLSL program
//   var program = webglUtils.createProgramFromSources(gl,
//     [vertexShaderSource, fragmentShaderSource]);

//   // look up where the vertex data needs to go.
//   var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
//   var texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");

//   // lookup uniforms
//   var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
//   var imageLocation = gl.getUniformLocation(program, "u_image");

//   // Create a vertex array object (attribute state)
//   var vao = gl.createVertexArray();

//   // and make it the one we're currently working with
//   gl.bindVertexArray(vao);

//   // Create a buffer and put a single pixel space rectangle in
//   // it (2 triangles)
//   var positionBuffer = gl.createBuffer();

//   // Turn on the attribute
//   gl.enableVertexAttribArray(positionAttributeLocation);

//   // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//   // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
//   var size = 2;          // 2 components per iteration
//   var type = gl.FLOAT;   // the data is 32bit floats
//   var normalize = false; // don't normalize the data
//   var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
//   var offset = 0;        // start at the beginning of the buffer
//   gl.vertexAttribPointer(
//     positionAttributeLocation, size, type, normalize, stride, offset);

//   // provide texture coordinates for the rectangle.
//   var texCoordBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
//     0.0, 0.0,
//     1.0, 0.0,
//     0.0, 1.0,
//     0.0, 1.0,
//     1.0, 0.0,
//     1.0, 1.0,
//   ]), gl.STATIC_DRAW);

//   // Turn on the attribute
//   gl.enableVertexAttribArray(texCoordAttributeLocation);

//   // Tell the attribute how to get data out of texCoordBuffer (ARRAY_BUFFER)
//   var size = 2;          // 2 components per iteration
//   var type = gl.FLOAT;   // the data is 32bit floats
//   var normalize = false; // don't normalize the data
//   var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
//   var offset = 0;        // start at the beginning of the buffer
//   gl.vertexAttribPointer(
//     texCoordAttributeLocation, size, type, normalize, stride, offset);

//   // Create a texture.
//   var texture = gl.createTexture();

//   // make unit 0 the active texture uint
//   // (ie, the unit all other texture commands will affect
//   gl.activeTexture(gl.TEXTURE0 + 0);

//   // Bind it to texture unit 0' 2D bind point
//   gl.bindTexture(gl.TEXTURE_2D, texture);

//   // Set the parameters so we don't need mips and so we're not filtering
//   // and we don't repeat at the edges
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

//   // Upload the image into the texture.
//   var mipLevel = 0;               // the largest mip
//   var internalFormat = gl.RGBA;   // format we want in the texture
//   var srcFormat = gl.RGBA;        // format of data we are supplying
//   var srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
//   gl.texImage2D(gl.TEXTURE_2D,
//     mipLevel,
//     internalFormat,
//     srcFormat,
//     srcType,
//     image);

//   webglUtils.resizeCanvasToDisplaySize(gl.canvas);

//   // Tell WebGL how to convert from clip space to pixels
//   gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

//   // Clear the canvas
//   gl.clearColor(0, 0, 0, 0);
//   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//   // Tell it to use our program (pair of shaders)
//   gl.useProgram(program);

//   // Bind the attribute/buffer set we want.
//   gl.bindVertexArray(vao);

//   // Pass in the canvas resolution so we can convert from
//   // pixels to clipspace in the shader
//   gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

//   // Tell the shader to get the texture from texture unit 0
//   gl.uniform1i(imageLocation, 0);

//   // Bind the position buffer so gl.bufferData that will be called
//   // in setRectangle puts data in the position buffer
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//   // Set a rectangle the same size as the image.
//   setRectangle(gl, 0, 0, image.width, image.height);

//   // Draw the rectangle.
//   var primitiveType = gl.TRIANGLES;
//   var offset = 0;
//   var count = 6;
//   gl.drawArrays(primitiveType, offset, count);
// }

// function setRectangle(gl, x, y, width, height) {
//   var x1 = x;
//   var x2 = x + width;
//   var y1 = y;
//   var y2 = y + height;
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
//     x1, y1,
//     x2, y1,
//     x1, y2,
//     x1, y2,
//     x2, y1,
//     x2, y2,
//   ]), gl.STATIC_DRAW);
// }