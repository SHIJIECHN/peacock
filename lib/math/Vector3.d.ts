import { Matrix4 } from './Matrix4';
export declare class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    add(v: Vector3): this;
    dot(v: Vector3): number;
    applyMatrix4(m: Matrix4): this;
}
//# sourceMappingURL=Vector3.d.ts.map