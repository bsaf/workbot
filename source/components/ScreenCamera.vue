<template>
  <div id="app" class="screen-camera">
  
    <!-- Info box -->
    <div class="main-title" :class="decisionClass">
      <transition name="fade" mode="out-in">
        <!-- IDLE -->
        <div v-if="state === 'idle'" key="idle">
          <h1>
            Can I take the<br/>day off?
            <div class="icon-container">
              <img src="../img/camera.png" class="camera-icon icon" />
            </div>
          </h1>
          <div class="info">
            The decision maker assesses how much you deserve time off by retrieving and analysing your unique employee profile.
          </div>
        </div>
        <!-- SEARCHING -->
        <div v-if="state === 'searching'" key="searching">
          <h1>
            Searching for employee&hellip;
            <div class="icon-container">
              <Spinner
                key="searching"
                :size="90"
                :line-size="7"
                :speed="1"
                line-fg-color="rgba(0,0,0,1)"
                line-bg-color="rgba(0,0,0,0.2)"
              >
              </Spinner>
            </div>
          </h1>
        </div>
        <!-- CALCULATING -->
        <div v-if="state === 'calculating'" key="calculating">
          <h1>
            Deciding&hellip;
            <div class="icon-container">
              <Spinner
                key="searching"
                :size="90"
                :line-size="7"
                :speed="1"
                line-fg-color="rgba(0,0,0,1)"
                line-bg-color="rgba(0,0,0,0.2)"
              >
              </Spinner>
            </div>
          </h1>
        </div>
        <!-- DECISION -->
        <div v-if="state === 'decided'" key="decided">
          <h1>THE DECISION</h1>
          <div class="decision-text">
            {{ employee.decisionSentence }}
          </div>
        </div>
        <!-- API ERROR -->
        <div v-if="state === 'apierror'" key="apierror">
          <h1>
            Employee<br/>not found
            <div class="icon-container">
              <img src="../img/camera.png" class="camera-icon icon" />
            </div>
          </h1>
          <div class="info">
            Please try again in a moment.
          </div>
        </div>
      </transition>
    </div>

    <!-- Employee card -->
    <transition
      @before-enter="cardBeforeEnter"
      @enter="cardEnter"
      @leave="cardLeave"
      :css="false"
    >
      <Stats :employee="employee" v-if="showEmployeeCard"></Stats>
    </transition>
  
    <!-- Video feed -->
    <Camera
      :state="state"
      @contacting="contactingFaceAPI"
      @employeeDataReceived="employeeDataReceived"
      @api-error="apiError"
    >
    </Camera>
  
  </div>
</template>

<script>

import gsap from 'gsap'
import Spinner from 'vue-simple-spinner'
import Camera from './Camera'
import Stats from './Stats'
import TitleGenerator from '../js/TitleGenerator'
import StatsGenerator from '../js/StatsGenerator'

export default {
  name: 'app',
  components: { Camera, Stats, Spinner },
  props: ['employee', 'state', 'companyInfo'],

  data() {
    return {
      debug: false,
      employeeData: null
    }
  },

  methods: {
    apiError() {
      this.$emit('api-error')
    },
    contactingFaceAPI() {
      this.$emit('contacting-api')
      console.log("Contacting API")
    },
    employeeDataReceived(e) {
      this.employeeData = e.body[0]
      var decision = {
        body: {
          timestamp: Date.now(),
          title: TitleGenerator.randomTitle(),
          age: e.body[0].faceAttributes.age,
          teamSize: StatsGenerator.teamSize(),
          gender: e.body[0].faceAttributes.gender,
          scheduledWork: StatsGenerator.scheduledWork(),
          demeanor: StatsGenerator.demeanorString(e.body[0].faceAttributes.emotion),
          leaveTaken: StatsGenerator.leaveTaken(),
          tenure: StatsGenerator.tenure(),
          productivity: StatsGenerator.productivity(),
          emotion: e.body[0].faceAttributes.emotion,
          number: this.companyInfo.employeeCount+1
        },
        imageUrl: e.imageUrl // outside of the body because we don't want to upload it to the DB
      }
      console.log('Employee data received')
      this.$emit('newDecisionMade', decision)
    },
    cardBeforeEnter(el) {
      TweenMax.set(el, {
        bottom: "-800px",
        opacity: 0
      })
    },
    cardEnter(el, done) {
      TweenMax.to(el, 1, {
        bottom: "0",
        opacity: 1,
        ease: Elastic.easeOut.config(1, 0.75),
        onComplete: done
      })
    },
    cardLeave(el, done) {
      TweenMax.to(el, 1, {
        bottom: "-800px",
        opacity: 1,
        ease: Elastic.easeIn.config(1, 0.75),
        onComplete: done
      })
    },
  },
  computed: {
    showEmployeeCard() {
      if (!this.employee) return false
      if (this.state === 'calculating' ||
          this.state === 'decided') return true
      else return false
    },
    trackingCamActive() {
      if (this.state === 'idle') return true
      else return false
    },
    decisionClass() {
      if (this.employee) {
        return {
          decision: this.state === 'decided',
          yes: this.employee.decision
        }
      }
      else {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../sass/decisionMaker";
@import "../sass/variables";

#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.main-title {
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 65px;
  width: 700px;
  height: 700px;
  z-index: 100;
  color: black;
  background-color: $yellow;
  transition: 0.3s background ease-in-out;
}

.main-title.decision {
  // defaults to no
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(../img/no.png);
  background-color: white;
}

.main-title.decision.yes {
  // yes is an override
  background-image: url(../img/yes.png);
  background-color: $yellow;
}

.main-title .decision-text {
  padding: 0 60px;
  position: absolute;
  top: 250px;
  font-size: 40px;
  font-weight: 400;
  line-height: 55px;
}

.main-title h1 {
  text-transform: uppercase;
  text-align: center;
  font-weight: 400;
  letter-spacing: 5.6px;
  font-size: 45px;
  padding: 0 20px;
  position: absolute;
  top: 80px;
  width: 100%;
}

.main-title h2 {
  font-size: 35px;
  font-weight: 500;
  letter-spacing: 1px;
  margin-top: 50px;
}

.main-title .info {
  position: absolute;
  bottom: 0;
  margin-bottom: 80px;
  font-size: 30px;
  letter-spacing: 1px;
  padding: 0 85px;
  line-height: 42px;
  text-align: center;
  width: 100%;
}

.main-title .icon-container {
  margin-top: 50px;
}

.main-title .icon {
  width: 120px;
}

.box {
  background: #F0F0F0;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
}

.decision {
  font-weight: bold;
}

.decision-sentence {
  font-weight: normal;
}

.result-grid {
  display: flex;
}

.result-box {
  width: 50px;
  height: 50px;
  background: red;
  margin: 0 2px 2px 0;
  transition: opacity 0.2s;
  cursor: pointer;
}

.result-box:hover {
  opacity: 0.5;
}

.result-box.green {
  background: green;
}

.stats-container {
  position: absolute;
  z-index: 50;
  right: 160px;
  bottom: 0;
}

</style>
