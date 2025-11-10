<template>
  <div class="ray-tracer-container">
    <canvas ref="canvasRef" width="600" height="600"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RayTracer } from '../ray-tracing';
import { Sphere, Vec, Color } from '../utils';

const canvasRef = ref<HTMLCanvasElement | null>(null);

const rayTracer = ref<RayTracer | null>(null);

onMounted(() => {
  if (!canvasRef.value) return;

  rayTracer.value = new RayTracer({
    canvas: canvasRef.value,
    scene: {
      backgroundColor: new Color(0, 0, 0),
      spheres: [
        new Sphere(new Vec(0, -1, 3), 1, new Color(255, 0, 0), 500, 0.2), // red
        new Sphere(new Vec(-2, 0, 4), 1, new Color(0, 255, 0), 10, 0.4), // green
        new Sphere(new Vec(2, 0, 4), 1, new Color(0, 0, 255), 500, 0.3), // blue
        new Sphere(new Vec(0, -5001, 0), 5000, new Color(255, 255, 0), 1000, 0.5) // yellow
      ]
    }
  })

  rayTracer.value.render()
})
</script>

<style scoped lang="scss">
.ray-tracer-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>