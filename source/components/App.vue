<template>
  <div id="app">

    <!-- Buttons for testing -->
    <div v-if="devMode" class="devMode">☢️&nbsp; Development mode (build 192)</div>
    <ul v-if="devMode" class="adminMenu one">
      <li @click="setState('idle')">Idle</li>
      <li @click="setState('searching')">Searching</li>
      <li @click="setState('calculating')">Calculating</li>
      <li @click="setState('decided')">Decided</li>
      <li @click="setState('end')">End (pre-idle)</li>
      <li @click="setState('apierror')">API Error</li>
      <li @click="stopTracking()">Stop tracking</li>
      <li @click="startTracking()">Start tracking</li>
    </ul>
  
    <router-view
      :class="{ hideCursor : !devMode}"
      :state="state"
      :employees="scoredEmployees"
      :settings="algorithmSettings"
      :employee="lastEmployee"
      :companyInfo="companyInfo"
      :selectedCompany="selectedCompany"
      :showEmployee="showEmployee"
      @sliderValueChanged="updateSlider"
      @selectedCompanyChanged="updateSelectedCompany"
      @setSliderTo="setSliderTo"
      @newDecisionMade="pushEmployee"
      @contacting-api="contactingAPI"
      @api-error="apiError"
    >
    </router-view>
  </div>
</template>

<script>

import firebase from 'firebase'
import { Decider } from '../js/Decider'

const STATE = {
  IDLE: 'idle', // ready to go
  SEARCHING: 'searching', // after photo snapped, doing a search
  CALCULATING: 'calculating', // after the employee profile is back, thinking...
  DECIDED: 'decided', // after the decision has been made
  END: 'end', // a thank you, move along message
  APIERROR: 'apierror' // no face found
}

// Initialize Firebase
var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
}

var db = firebase.initializeApp(config).database()
var storage = firebase.storage()

var employeesRef = db.ref('employees')
var settingsRef = db.ref('settings')
var companyDataRef = db.ref('companyData')
var storageRef = storage.ref()

export default {

  created() {
    window.addEventListener('keyup', this.handleKeypress)
    const minutesToRefresh = 20 
    window.setTimeout(() => {
      window.location.reload()
    }, 1000 * 60 * minutesToRefresh)
  },

  beforeDestroy() {
    window.removeEventListener('keyup', this.handleKeypress)
    this.activeEmployee = null
  },

  data() {
    return {
      state: STATE.IDLE,
      holdState: null,
      activeEmployee: null,
      showEmployee: false,
      devMode: false,
      selectedCompany: {}
    }
  },

  firebase: {
    employees: employeesRef.limitToLast(50),
    algorithmSettings: settingsRef.limitToLast(50),
    companyData: companyDataRef.limitToLast(1),
  },

  computed: {
    sortedEmployees() {
      var sorted = this.employees.slice(0) // make a copy first
      sorted.sort((a, b) => {
        return b.timestamp - a.timestamp // sort by timestamp
      })
      // also remove all items that have avatarUrl undefined
      sorted = sorted.filter((item) => {
        return item.avatarUrl
      })
      return sorted
    },
    scoredEmployees() {
      const decider = new Decider(this.algorithmSettings)
      return decider.score(this.sortedEmployees)
    },
    lastEmployee() {
      if (this.activeEmployee) {
        return this.scoredEmployees[0]
      }
    },
    companyInfo() {
      return this.companyData[0]
    }
  },

  methods: {
    handleKeypress(e) {
      switch (e.keyCode) {
        case 49: // 1 -- algorithm
          this.$router.push('algorithm')
          break;
        case 50: // 2 -- camera
          this.$router.push('/')
          break;
        case 51: // 3 -- results
          this.$router.push('browser')
          break;
        default:
          break;
      }
    },

    pushEmployee(e) {
      employeesRef.push(e.body).then((snap) => {
        this.incrementEmployeeCount()
        storageRef.child(`${snap.key}.jpg`).putString(e.imageUrl, 'data_url').then((snapshot) => {
          employeesRef.child(snap.key).child('avatarUrl').set(snapshot.downloadURL)
          this.activeEmployee = true
          this.state = STATE.CALCULATING
          // wait 10 seconds before showing the decision
          setTimeout(() => {
            this.state = STATE.DECIDED
            // wait 20 seconds before switching to a hidden pre-idle step
            setTimeout(() => {
              this.state = STATE.END
              // wait 3 seconds before reverting to idle to let animations finish
              setTimeout(() => {
                this.state = STATE.IDLE
              }, 2 * 1000) // pre-idle time
            }, 10 * 1000) // decision time
          }, 10 * 1000) // calculating time
        });
      })
    },

    incrementEmployeeCount () {
      var currentCount = this.companyInfo.employeeCount
      if (currentCount > 90) {
        companyDataRef.push({ employeeCount: currentCount+1 })
      }
    },

    updateSlider (item, amount) {
      var newVal = parseInt(item.value) + parseInt(amount)
      if (newVal > 100) newVal = 100
      if (newVal < 0) newVal = 0
      if (newVal % 5 != 0) newVal = newVal + (5 - newVal % 5) // snap to the closest 5
      if (newVal != item.value) {
        settingsRef.child(item['.key']).child('value').set(newVal)
      }
    },

    // this sets it to an absolute value rather than adjusting it by
    // an amount in the one above
    // you probably don't need two here, could be refactored
    setSliderTo (item, amount) {
      var newVal = parseInt(amount)
      if (newVal > 100) newVal = 100
      if (newVal < 0) newVal = 0
      if (newVal % 5 != 0) newVal = newVal + (5 - newVal % 5) // snap to the closest 5
      if (newVal != item.value) {
        settingsRef.child(item['.key']).child('value').set(newVal)
      }
    },

    updateSelectedCompany(company) {
      this.selectedCompany = company
    },

    apiError() {
      this.state = STATE.APIERROR
      setTimeout(() => {
        this.state = STATE.IDLE
      }, 5000)
    },

    contactingAPI() {
      this.state = STATE.SEARCHING
    },

    setState(state) {
      if (state === 'decided') {
        this.showEmployee = true
        this.activeEmployee = true
        console.log(this.lastEmployee)
      }
      this.state = state
    },

    stopTracking() {
      this.$bus.$emit('stopTracking')
    },

    startTracking() {
      this.$bus.$emit('startTracking')
    }

  },

  // this watcher emits a start or stop tracking message each time
  // the state is changed, which is picked up by Camera.vue
  watch: {
    state(newState) {
      if (newState != 'idle') this.$bus.$emit('stopTracking')
      else this.$bus.$emit('startTracking')
    }
  }
}
</script>