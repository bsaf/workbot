<template>
  <div id="screen-algorithm">

    <h1 class="screen-title">The Algorithm</h1>
    <h2 class="screen-subtitle">
      The algorithm retunes itself every 60 seconds to reflect the decision making personality of three different businesses.
    </h2>

    <!-- COMPANY PRESETS -->
    <div class="company-presets">
      <div
        v-for="(company, index) in presets"
        class="company"
        :class="{ active : selectedPreset === index }"
        @click="loadPreset(index)"
      >
        <div class="title">
          <span v-if="selectedPreset === index">Deciding as </span>
          {{company.title}}
        </div>
        <div class="subtitle">{{company.subtitle}}</div>
      </div>
    </div>

    <algo-slider v-for="(slider, index) in settings"
                 :slider="slider"
                 :expanded="index === selected"
                 :index="index"
                 :key="slider.title"
                 @valueChanged="updateValue"
                 >
    </algo-slider>

  </div>
</template>

<script>

import AlgoSlider from './AlgoSlider'

export default {
  components: { AlgoSlider },
  props: [ 'settings' ],

  mounted() {
    this.$bus.$emit('stopTracking')
    window.addEventListener('keydown', this.handleKeypress)
    this.cycleSettings = window.setInterval(() => {
      this.moveSelection(1)
    }, 1000 * 7)
    this.cyclePresets = window.setInterval(() => {
      this.selectedPreset++
      if (this.selectedPreset > this.presets.length - 1) this.selectedPreset = 0
      this.loadPreset(this.selectedPreset)
    }, 1000 * 60)
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeypress)
    window.clearInterval(this.cycleSettings)
    this.cycleSettings = null
    window.clearInterval(this.cyclePresets)
    this.cyclePresets = null
  },

  data() {
    return {
      selected: 0,
      selectedPreset: 0,
      cycleSettings: null,
      cyclePresets: null,
      presets: [
        {
          'title': 'Über',
          'subtitle': 'An autonomous taxi service.',
          'settings': [ 50, 90, 30, 100, 80, 35, 100, 0, 55, 20, 0 ]
        },
        {
          'title': 'Petegonia',
          'subtitle': 'An ethical apparel maker.',
          'settings': [ 90, 0, 0, 0, 40, 50, 0, 60, 10, 70, 80 ]
        },
        {
          'title': 'Gügl',
          'subtitle': 'A global technology provider.',
          'settings': [ 80, 50, 15, 20, 0, 60, 30, 90, 25, 70, 80 ]
        },
      ]
    }
  },

  methods: {
    handleKeypress(e) {
      switch (e.keyCode) {
        case 40: // -- down
          this.moveSelection(1)
          break;
        case 38: // -- up
          this.moveSelection(-1)
          break;
        default:
          break;
      }
    },
    moveSelection(amount) {
      this.selected = this.selected + amount
      if (this.selected > this.settings.length - 1) { this.selected = 0 }
      if (this.selected < 0) { this.selected = this.settings.length - 1 }
    },
    updateValue(slider, amount) {
      this.$emit('sliderValueChanged', slider, amount)
    },
    loadPreset (index) {
      this.selectedPreset = index
      var selectedCompany = this.presets[index]
      this.$emit('selectedCompanyChanged', selectedCompany)
      var settingIndex = 0
      this.presets[index].settings.forEach((setting) => {
        this.$emit('setSliderTo', this.settings[settingIndex], setting)
        settingIndex++
      })
    }
  }
}

</script>

<style lang="scss" scoped>

@import '../sass/variables';

#screen-algorithm {
  height: 100vh;
  padding: 20px 0 0 0;
}

.company-presets {
  display: flex;
  justify-content: space-between;
  padding: 20px 300px 40px 300px;
}

.company-presets .company {
  width: 350px;
  text-align: center;
  cursor: pointer;
  padding: 10px 20px;
  transition: 0.3s all ease-in-out;
  opacity: 0.3;
}

.company.active {
  transform: scale(1.3);
  opacity: 1;
}

.company .title {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 10px;
}

.company .subtitle {
  font-size: 20px;
}

</style>
