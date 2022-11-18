// const image0 = new Image();
// const image1 = new Image();

// if (!image0 || !image1) {
//   console.log('Failed to create the image object.');
// }
// image.onload = async function () {
//   render(image);
// }
// image.src = './container.jpg';
main();

async function main() {
  // 从本地加载着色器文件
  const { vs, fs } = await readShaderFile('vertexShaderSource.glsl', 'fragmentShaderSource.glsl');
  // 初始化着色器
  const ourShader = new Shader(gl, vs, fs);

  if (!ourShader) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // 初始化顶点信息
  const n = initVerBuffers(gl, ourShader.program);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // 纹理信息
  if (!initTexture(gl, ourShader.program)) {
    console.log('Failed to initialize the texture.');
    return;
  }

  gl.clearColor(0.2, 0.3, 0.3, 1);

  // 初始化顶点信息
  //----------------------------------------------------------------------------
  function initVerBuffers(gl, program) {


    const vertices = [
      // position    // color       // texcoord
      0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, // top right
      0.5, -0.5, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, // bottom right
      -0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, // bottom left
      -0.5, 0.5, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0  // top left 
    ];

    const indices = new Int32Array([
      0, 1, 3,
      1, 2, 3
    ]);
    // 创建与绑定vao
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vbo = gl.createBuffer();
    const ebo = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const FSIZE = vertices.BYTES_PER_ELEMENT;

    const positionAttributeLocation = gl.getAttribLocation(program, 'aPos');
    if (positionAttributeLocation < 0) {
      console.log('Failed to get aPos.');
      return -1;
    }

    const colorAttributeLocation = gl.getAttribLocation(program, 'aColor');
    if (colorAttributeLocation < 0) {
      console.log('Failed to get aColor.');
      return -1;
    }

    const texCoordAttributeLocation = gl.getAttribLocation(program, 'aTexCoord');
    if (texCoordAttributeLocation < 0) {
      console.log('Failed to get aTexCoord.');
      return -1;
    }

    // position
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 8 * FSIZE, 0);
    gl.enableVertexAttribArray(positionAttributeLocation);

    // color
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 8 * FSIZE, 3 * FSIZE);
    gl.enableVertexAttribArray(colorAttributeLocation);

    // texcoord
    gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 8 * FSIZE, 6 * FSIZE);
    gl.enableVertexAttribArray(texCoordAttributeLocation);

    return 1;
  }

  // 纹理信息
  //--------------------------------------------------------------------------------------
  function initTexture(gl, program) {
    const texture0 = gl.createTexture();
    const texture1 = gl.createTexture();
    if (!texture0 || !texture1) {
      console.log('Failed to create the texture object.');
      return false;
    }

    const u_Sample0 = gl.getUniformLocation(program, 'texture1');
    const u_Sample1 = gl.getUniformLocation(program, 'texture2');
    if (!u_Sample0 || !u_Sample1) {
      console.log('Failed to get the storage location of texture');
      return false;
    }
    // 创建图片对象
    const image0 = new Image();
    const image1 = new Image();
    if (!image0 || !image1) {
      console.log('Failed to create the image object.');
      return false;
    }

    // 图片加载完成事件处理函数
    image0.onload = function () {
      loadTexture(gl, texture0, u_Sample0, image0, 0);
    }
    image1.onload = function () {
      loadTexture(gl, texture1, u_Sample1, image1, 1)
    }
    // 加载图片
    image0.src = './container.jpg';
    image1.src = './awesomeface.png';

    return true;
  }

  let g_texUnit0 = false,
    g_texUnit1 = false;

  function loadTexture(gl, texture, u_Sample, image, texUnit) {
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // 激活纹理单元
    if (texUnit == 0) {
      gl.activeTexture(gl.TEXTURE0);
      g_texUnit0 = true;
    } else {
      gl.activeTexture(gl.TEXTURE1);
      g_texUnit1 = true;
    }
    // 绑定纹理对象到目标对象上
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 设置纹理环绕方式
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    // 设置过滤方式
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // gl.generateMipmap(gl.TEXTURE_2D);

    // 将图像设置到纹理
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sample, texUnit);

    gl.clear(gl.COLOR_BUFFER_BIT);

    if (g_texUnit0 && g_texUnit1) {
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0)
    }
  }




}

