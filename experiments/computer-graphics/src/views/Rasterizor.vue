<template>
  <div class="rasterizor-container">
    <canvas ref="canvasRef" width="600" height="600"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Rasterizor } from '../rasterizor';
import { IdenticalMatrix4x4, makeOYRotationMatrix } from '../rasterizor/helpers';
import { Camera, Instance } from '../rasterizor/entities';
import { CUBE } from '../rasterizor/models';
import { Vec } from '../utils';

const canvasRef = ref<HTMLCanvasElement | null>(null);

const rasterizor = ref<Rasterizor | null>(null);
onMounted(() => {
  if (!canvasRef.value) return;


  rasterizor.value = new Rasterizor({
    canvas: canvasRef.value,
    scene: {
      instances: [
        new Instance(CUBE, new Vec(-1.5, 0, 7), IdenticalMatrix4x4, 0.75),
        new Instance(CUBE, new Vec(1.25, 2.5, 7.5), makeOYRotationMatrix(195)),
        // this one should be clipped
        new Instance(CUBE, new Vec(0, 0, -10), makeOYRotationMatrix(195)),
      ],
      camera: new Camera(
        new Vec(-3, 1, 2), 
        makeOYRotationMatrix(-30)
      )
    }
  });

  rasterizor.value.render();
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