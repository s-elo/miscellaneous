<template>
  <div class="rasterizor-container">
    <canvas ref="canvasRef" width="600" height="600"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Rasterizor } from '../rasterizor';
// import { Point, Color } from '../utils';

const canvasRef = ref<HTMLCanvasElement | null>(null);

const rasterizor = ref<Rasterizor | null>(null);
onMounted(() => {
  if (!canvasRef.value) return;


  rasterizor.value = new Rasterizor({
    canvas: canvasRef.value,
  });

  // const points = [
  //   new Point(-200, -250, 0.3), 
  //   new Point(200, 50, 0.1), 
  //   new Point(20, 250, 1.0), 
  // ] as const;

  // rasterizor.value.drawWireframeTriangle(...points, new Color(0, 0 ,0));
  // rasterizor.value.drawShadedTriangle(...points, new Color(0, 255, 0));
  // rasterizor.value.render();

  rasterizor.value.drawProjectedSquare();
});
</script>

<style scoped lang="scss">
.rasterizor-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>