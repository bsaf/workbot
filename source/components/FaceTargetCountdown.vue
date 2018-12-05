<template>
  <div class="faceTargetCountdown" :class="">
    {{counter}}
  </div>
</template>

<script>
export default {

  computed: {
  },

  mounted() {
    setTimeout(() => { this.countdown() }, 1000)
  },
  methods: {
    countdown() {
      if (this.counter > 1) {
        this.counter--
        setTimeout(() => { this.countdown() }, 1000)
      }
      else {
        this.counter = 0
        this.flash()
        this.$emit('countdown-finished')
      }
    },
    flash() {

    }
  },
  data() {
    return {
      counter: 5
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../sass/variables';

.faceTargetCountdown {
  font-size: 300px;
  font-weight: bold;
  color: rgba($yellow, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: white;
  width: 100%;
  height: 100%;
  border-radius: 800px;
  background-color: rgba(255,255,255,0.3);
}

</style>
