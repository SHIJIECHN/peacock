/**
 * gl：canvas上下文
 */
class Shader {
  constructor(gl, vs, fs) {
    this.gl = gl; // canvas上下文
    // 顶点着色器
    const vertexShader = initShader(this.gl, gl.VERTEX_SHADER, vs || vertexShaderSource);
    // 片段着色器
    const fragmentShader = initShader(this.gl, this.gl.FRAGMENT_SHADER, fs || fragmentShaderSource);
    // 着色器程序
    this.program = initProgram(this.gl, vertexShader, fragmentShader);
    gl.useProgram(this.program);
  }

  // 激活着色器程序
  // use() {
  //   this.gl.useProgram(this.program);
  // }

  /**
   * set...方法能够查询unifrom的位置值并设置它的值
   * @param {*} name uniform变量名称
   * @param {*} value  uniform的值
   */
  setBool(name, value) {
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, name), parseInt(value));
  }

  setFloat(name, value) {
    // 新的值被用于uniform
    this.gl.uniform1f(gl.getUniformLocation(this.program, name), value);
  }

  setInt(name, value) {
    this.gl.uniform1i(gl.getUniformLocation(this.program, name), value);
  }

}


// 创建着色器
function initShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  const lastError = gl.getShaderInfoLog(shader);
  console.log('shader init failed. ' + lastError);
  gl.deleteShader(shader);
  return undefined;
}

// 创建着色器程序
function initProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  const lastError = gl.getProgramInfoLog(program);
  console.log('program link failed. ' + lastError)
  return undefined;
}