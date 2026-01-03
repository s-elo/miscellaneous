import { EPSILON } from '../constants';
import type { Camera } from '../rasterizor/entities';
import {
  makeTranslationMatrix,
  multiplyMM4,
  multiplyMV,
  transposed,
  Vertex4,
} from '../rasterizor/helpers';
import {
  getClosestIntersectedParams,
  getReflectionDirection,
  Sphere,
  Vec,
} from '../utils';

export enum LightType {
  POINT,
  DIRECTIONAL,
  AMBIENT,
}

export enum LightingModel {
  LM_DIFFUSE = 1,
  LM_SPECULAR = 2,
}

export class Light {
  type: LightType;
  /** position for point type, direction for directional type */
  positionOrDirection?: Vec;
  intensity: number;

  constructor(type: LightType, intensity: number, positionOrDirection?: Vec) {
    this.type = type;
    if (type !== LightType.AMBIENT && positionOrDirection) {
      this.positionOrDirection = positionOrDirection;
    }

    this.intensity = intensity;
  }

  getIntensityAtPoint(
    point: Vec,
    surfaceNor: Vec,
    pointToCamera: Vec,
    spheres: Sphere[],
    specular = -1,
  ) {
    if (this.type === LightType.AMBIENT) {
      return this.intensity;
    }

    if (!this.positionOrDirection) {
      throw new Error(
        'Position or direction is required for positionOrDirection',
      );
    }

    const lightDirection =
      this.type === LightType.POINT
        ? this.positionOrDirection.sub(point)
        : this.positionOrDirection;

    // check shadow
    const { closestSphere } = getClosestIntersectedParams(
      point,
      lightDirection,
      spheres,
      EPSILON,
      Infinity,
    );
    if (closestSphere) {
      return 0;
    }

    const reflection = getReflectionDirection(lightDirection, surfaceNor);
    const reflectionDotPointToCamera = reflection.dot(pointToCamera);
    const specularIntensity =
      specular != -1 && reflectionDotPointToCamera > 0
        ? this.intensity *
          Math.pow(
            reflectionDotPointToCamera /
              (reflection.length() * pointToCamera.length()),
            // The “shininess” of the object is what determines how rapidly the reflected light decreases as you move away from the reflectionVector
            // the greater the specular is, the quicker the decrease will be
            specular,
          )
        : 0;

    const surfaceNorDotLightDirection = surfaceNor.dot(lightDirection);
    // when lighting at the front of the surface
    if (surfaceNorDotLightDirection > 0) {
      return (
        this.intensity *
          (surfaceNorDotLightDirection /
            (surfaceNor.length() * lightDirection.length())) +
        specularIntensity
      );
    }

    return specularIntensity;
  }

  computeIllumination(
    vertex: Vec,
    normal: Vec,
    camera: Camera,
    lightingModel: number,
  ) {
    let illumination = 0;

    if (this.type == LightType.AMBIENT) {
      illumination += this.intensity;
      return illumination;
    }

    let vl = new Vec(0, 0, 0);
    if (this.type == LightType.DIRECTIONAL) {
      const cameraMatrix = transposed(camera.orientation);
      const rotatedLight = multiplyMV(
        cameraMatrix,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Vertex4.fromVec3(this.positionOrDirection!),
      );
      vl = rotatedLight.toVec3();
    } else if (this.type == LightType.POINT) {
      const cameraMatrix = multiplyMM4(
        transposed(camera.orientation),
        makeTranslationMatrix(camera.position.mul(-1)),
      );
      const transformedLight = multiplyMV(
        cameraMatrix,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Vertex4.fromVec3(this.positionOrDirection!),
      );
      vl = vertex.mul(-1).add(transformedLight.toVec3());
    }

    // Diffuse component.
    if (lightingModel & LightingModel.LM_DIFFUSE) {
      const cosAlpha = vl.dot(normal) / (vl.length() * normal.length());
      if (cosAlpha > 0) {
        illumination += cosAlpha * this.intensity;
      }
    }

    // Specular component.
    if (lightingModel & LightingModel.LM_SPECULAR) {
      const reflected = normal.mul(2 * normal.dot(vl)).sub(vl);
      const view = camera.position.sub(vertex);

      const cosBeta =
        reflected.dot(view) / (reflected.length() * view.length());
      if (cosBeta > 0) {
        const specular = 50;
        illumination += Math.pow(cosBeta, specular) * this.intensity;
      }
    }

    return illumination;
  }
}
