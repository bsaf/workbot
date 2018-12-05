<template>
  <div class="algo-slider" :class="{ expanded : expanded }">
    <div class="name">{{sliderName}}</div>
    <div class="description" v-show="expanded">
      {{slider.description}}
    </div>
    <div class="slider">
      <div class="hover-value" v-if="expanded" :style="hoverValueStyle">{{slider.value}}</div>
      <input type="range" v-model="slider.value"/>
      <div class="influence-label" v-show="expanded">Influence on decision</div>
    </div>
    <div class="value" v-show="!expanded">{{ slider.value ? slider.value : "Off" }}</div>
  </div>
</template>

<script>

export default {
  props: [ 'slider', 'expanded', 'index' ],
  computed: {
    sliderName() {
      if (this.slider.name) { return this.slider.name }
      else { return "No name" }
    },
    hoverValueStyle() {
      return {
        left: `calc(${this.slider.value}% - ${30*this.slider.value/100}px - 33px)`
      }

    }
  },
  watch: {
    expanded: function() {
      if (this.expanded) {
        window.addEventListener('keydown', this.keyPressed)
      }
      else {
        window.removeEventListener('keydown', this.keyPressed)
      }
    }
  },
  methods: {
    keyPressed(e) {
      let inc = 5
      switch (e.keyCode) {
        case 37:
          this.incrementValue(0-inc)
          break;
        case 39:
          this.incrementValue(inc)
          break;
        default:
          break;
      }
    },
    incrementValue(amount) {
      this.$emit('valueChanged', this.slider, amount)
    }
  }
}
</script>

<style lang="scss">

@import '../sass/variables';

.algo-slider {
  font-weight: 500;
  font-size: 20px;
  padding: 0 130px;
  display: flex;
  margin-bottom: 22px;
  transition: 0.3s all ease-in-out;
  &.expanded {
    background: $yellow;
  }
}

.algo-slider .description {
  max-width: 50%;
  margin-top: 20px;
  margin-bottom: 55px;
  font-weight: normal;
  font-size: 18px;
  line-height: 26px;
}

.algo-slider .name {
  width: 180px;
  padding-right: 30px;
}

.algo-slider .slider {
  position: relative;
}

.algo-slider .value {
  width: 40px;
  padding-left: 30px;
}

.algo-slider .hover-value {
  display: inline-block;
  width: 100px;
  font-size: 35px;
  text-align: center;
  position: absolute;
  top: -55px;
}

.algo-slider input {
  -webkit-appearance: none;
  width: 100%;
  user-select: none;
  transition: 0.2s width ease-in-out;
  outline: none;
}

.algo-slider input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: 1px solid #000000;
  width: 12px;
  height: 12px;
  margin-top: -6px;
  border-radius: 30px;
  background: black;
  cursor: pointer;
}

.algo-slider.expanded input[type=range]::-webkit-slider-thumb {
  height: 30px;
  width: 30px;
  margin-top: -15px;
}

.algo-slider input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 1px;
  cursor: pointer;
  background: black;
}

.algo-slider .slider {
  flex-grow: 2;
}

.algo-slider.expanded {
  display: block;
  padding-top: 30px;
  padding-bottom: 30px;
  .name {
    font-size: 30px;
    width: 400px;
  }
}

.algo-slider .influence-label {
  font-weight: normal;
  text-align: center;
  margin-top: 20px;
}

</style>
