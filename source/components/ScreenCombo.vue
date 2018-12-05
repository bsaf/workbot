<template>
  <div class="combo-container">

    <div class="mini-screen">
      <ScreenAlgorithm></ScreenAlgorithm>
    </div>
    <div class="mini-screen">
      <ScreenCamera class="combo-screen"></ScreenCamera>
    </div>
    <div class="mini-screen">
      <ScreenBrowser></ScreenBrowser>
    </div>

  </div>
</template>

<script>

import ScreenCamera from '../components/ScreenCamera'
import ScreenAlgorithm from '../components/ScreenAlgorithm'
import ScreenBrowser from '../components/ScreenBrowser'

export default {
  components: { ScreenCamera, ScreenBrowser, ScreenAlgorithm }
}
</script>

<style lang="scss" scoped>

.combo-container {
  background: grey;
  display: flex;
  align-content: center;
  justify-content: space-between;
  height: 100vh;
  width: 100%;
}

.mini-screen {
  background: blue;
  border: 3px solid grey;
  width: 33%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
}

.mini-screen .combo-screen {
  height: 33vh!important;
}

</style>
