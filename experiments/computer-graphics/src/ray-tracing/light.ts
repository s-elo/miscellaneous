import type { Vec } from '../utils';

export enum LightType {
  POINT,
  DIRECTIONAL,
  AMBIENT,
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

    const reflection = surfaceNor
      .mul(2 * surfaceNor.dot(lightDirection))
      .sub(lightDirection);
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
}
