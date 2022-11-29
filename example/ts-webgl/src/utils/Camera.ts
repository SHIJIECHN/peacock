import { mat4, vec3, glMatrix } from 'gl-matrix'

interface CameraData {
  position: vec3,
  worldUp: vec3,
  yaw: number,
  pitch: number,
}

// define serveral posible options for camera movement
export enum Camera_Movement {
  FORWARD,
  BACKWARD,
  LEFT,
  RIGHT
}

// default camera value
const YAW = -90;
const PITCH = 0;
const SPEED = 2.5;
const SENSITIVITY = 0.1;
const ZOOM = 45;

const optionsDefault = {
  position: vec3.clone([0, 0, 0]),
  worldUp: vec3.clone([0, 1, 0]),
  yaw: YAW,
  pitch: PITCH
}

export default class Camera {
  position: vec3; // camear world position
  front: vec3 = [0, 0, -1]; // camera view direction
  up: vec3 = [0, 1, 0]; // camera up direction: the positive direction of camera y axis
  right: vec3 = [0, 1, 0]; // camera right direction: the positivew direction of world x axis
  worldUp: vec3; // up direction of world coordinate
  yaw: number; // yaw angle 偏航角
  pitch: number; // pitch angle 俯仰角
  movementSpeed: number = SPEED; // camera move speed
  mouseSensitivity: number = SENSITIVITY; // the sensitivity mouse
  zoom: number = ZOOM;


  /**
   * 创建一个照相机
   * @param position position camera world position, the default value is [0,0,0]
   * @param worldUp worldUp up direction of world, the default value is [0,1,0]
   * @param yaw yaw angle
   * @param pitch pitch angle
   */
  constructor(
    {
      position = optionsDefault.position,
      worldUp = optionsDefault.worldUp,
      yaw = optionsDefault.yaw,
      pitch = optionsDefault.pitch
    } = {}
  ) {
    // camera attrbute
    this.position = position;
    this.worldUp = worldUp;
    // euler angles
    this.yaw = yaw;
    this.pitch = pitch

    this.updateCameraVectors();
  }

  // returns the view matrxi calculated using Enuler angles and the lookAt Matrix 获得当前的观察矩阵
  public getViewMatrix() {
    const center = vec3.add(vec3.create(), this.position, this.front);
    return mat4.lookAt(mat4.create(), this.position, center, this.up);
  }

  /**
   * 相机移动，可以配合键盘模拟相机移动的效果
   * @param direction 
   * @param deltaTime 
   */
  processKeyboard(direction: Camera_Movement, deltaTime: number) {
    let velocity = this.movementSpeed * deltaTime;
    let movement: vec3;
    switch (direction) {
      case Camera_Movement.FORWARD:
        movement = vec3.scale(vec3.create(), this.front, velocity);
        vec3.add(this.position, this.position, movement);
        break;
      case Camera_Movement.BACKWARD:
        movement = vec3.scale(vec3.create(), this.front, velocity);
        vec3.sub(this.position, this.position, movement);
        break;
      case Camera_Movement.LEFT:
        movement = vec3.scale(vec3.create(), this.right, velocity);
        vec3.sub(this.position, this.position, movement);
        break;
      case Camera_Movement.RIGHT:
        movement = vec3.scale(vec3.create(), this.right, velocity);
        vec3.add(this.position, this.position, movement);
        break;
    }
  }

  /**
   * 处理鼠标移动，改变偏航角和俯仰角，模拟摄像机转向动作
   */
  public processMouseMovement(xOffset: number, yOffset: number, constrainPitch: boolean = true) {
    xOffset *= this.mouseSensitivity;
    yOffset *= this.mouseSensitivity;

    this.yaw += xOffset;
    this.pitch -= yOffset;
    if (constrainPitch) {
      if (this.pitch > 89) this.pitch = 89;
      if (this.pitch < -89) this.pitch = -89;
    }
    this.updateCameraVectors();
  }

  /**
   * processes input received from a mouse scroll-wheel event
   * @param yOffset 
   */
  public processMouseScroll(yOffset: number) {
    this.zoom -= yOffset;
    if (this.zoom < 1) this.zoom = 1;
    if (this.zoom > 45) this.zoom = 45;

    this.updateCameraVectors();
  }



  // calculates the front vector from Camera's(updated) Enuler Angles
  private updateCameraVectors() {
    const x = Math.cos(glMatrix.toRadian(this.yaw)) * Math.cos(glMatrix.toRadian(this.pitch));
    const y = Math.sin(glMatrix.toRadian(this.pitch));
    const z = Math.sin(glMatrix.toRadian(this.yaw)) * Math.cos(glMatrix.toRadian(this.pitch));

    vec3.normalize(this.front, [x, y, z]);
    vec3.cross(this.right, this.front, this.worldUp)
    // vec3.normalize(this.right, this.right);
    vec3.cross(this.up, this.right, this.front)
    // vec3.normalize(this.up, this.up);
    // normalize
  }

}