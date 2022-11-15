const vs = `#version 300 es
in vec2 a_position;
uniform mat3 u_matrix;
void main(){
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
}
`;

const fs = `#version 300 es
precision highp float;
uniform vec4 u_color;
out vec4 outColor;
void main(){
  outColor = u_color;
}
`;

function main() {
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    console.log('gl error')
    return;
  }

  const program = webglUtils.createProgramFromSources(gl, [vs, fs]);
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  // console.log(positionAttributeLocation); // 0
  // 获取u_color统一变量的位置
  const colorLocation = gl.getUniformLocation(program, 'u_color');
  // console.log(colorLocation);// WebGLUniformLocation {}
  // 获取u_matrix统一变量的位置
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const position = [
    -1, -2,
    2, 2,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);


  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttributeLocation);

  const size = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  requestAnimationFrame(drawScene);

  function drawScene(now) {
    // 设置画布大小
    resizeCanvasToDisplay(gl.canvas);
    // 重置画布尺寸的时候还需要调用gl.viewport设置视域
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    now *= 0.001;

    gl.useProgram(program);
    gl.bindVertexArray(vao);
    const matrix = m3.rotation(now);
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    gl.uniform4fv(colorLocation, [0, 1, 0, 1]);

    const primitiveType = gl.LINES;
    const offset = 0;
    const count = 2;
    gl.drawArrays(primitiveType, offset, count);

    requestAnimationFrame(drawScene);
  }

  /**
   * 调整画布大小与浏览器显示大小相同
   * @param {*} canvas 
   * @returns 
   */
  function resizeCanvasToDisplay(canvas) {
    // 获取浏览器显示的画布的CSS像素值
    // const displayWidth = canvas.clientWidth;
    // const displayHeight = canvas.clientHeight;

    const dpr = window.devicePixelRatio; // 分辨率
    // const displayWidth = Math.round(canvas.clientWidth * dpr);
    // const displayHeight = Math.round(canvas.clientHeight * dpr);

    const { width, height } = canvas.getBoundingClientRect();
    const displayWidth = Math.round(width * dpr);
    const displayHeight = Math.round(height * dpr);

    // 检查画布大小是否相同
    const needResize = canvas.width !== displayWidth
      || canvas.height !== displayHeight;

    if (needResize) {
      // 使画布大小相同
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    return needResize;
  }
}

main();