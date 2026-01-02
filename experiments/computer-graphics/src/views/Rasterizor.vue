<template>
  <div class="rasterizor-container">
    <div class="render-options">
      <div v-for="key in Object.keys(renderOptions)" :key="key" class="item">
        <label>{{ key }}</label>
        <input type="checkbox" v-model="renderOptions[key as keyof Scene['renderOptions']]" />
      </div>
    </div>
    <div class="scene">
      <canvas ref="canvasRef" width="600" height="600"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Rasterizor, type Scene } from '../rasterizor';
import { IdenticalMatrix4x4, makeOYRotationMatrix } from '../rasterizor/helpers';
import { Camera, Instance } from '../rasterizor/entities';
import { CUBE } from '../rasterizor/models';
import { Vec } from '../utils';

const canvasRef = ref<HTMLCanvasElement | null>(null);

const rasterizor = ref<Rasterizor | null>(null);

const renderOptions = ref<Scene['renderOptions']>({
  depthBuffering: true,
  backfaceCulling: true,
  renderTriangleOutlines: true,
});

watch(
  renderOptions,
  (newOptions) => {
    if (rasterizor.value) {
      rasterizor.value.scene.renderOptions = {
        ...rasterizor.value.scene.renderOptions,
        ...newOptions,
      };
      rasterizor.value.reset();
      rasterizor.value.render();
    }
  },
  { deep: true }
);

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
        // this one should be partially clipped
        // FIXME: not working, probably due to the clipping planes
        // but can clipped by ignore the out-of-boundary points
        new Instance(CUBE, new Vec(1.5, 0, 4.5), IdenticalMatrix4x4, 0.75)
      ],
      camera: new Camera(
        new Vec(-3, 1, 2), 
        // new Vec(0, 0, 0),
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .render-options {
    display: flex;
    color: black;
    width: 600px;
    .item {
      margin-right: 20px;
      label {
        margin-right: 5px;
      }
    }
  }
  .scene {
    border: 1px solid #ccc;
  }
}
</style>