<template>
  <div id="screen-browser">

    <div class="releaseNumber">195</div>

    <div class="company-data">
      <h1 class="screen-title">The Company</h1>

      <!-- COMPANY PRESET -->
      <div class="company-presets">
        <div class="company">
          <div class="title">
            {{selectedCompany.title}}
          </div>
          <div class="subtitle">{{selectedCompany.subtitle}}</div>
        </div>
      </div>

      <ul class="stats">
        <li class="stat">
          <div class="title">Employees</div>
          <div class="value">{{companyInfo.employeeCount}}</div>
        </li>
        <li class="stat">
          <div class="title">Deserve a day off</div>
          <div class="value">23%</div>
        </li>
        <li class="stat">
          <div class="title">Don't deserve a day off</div>
          <div class="value">77%</div>
        </li>
        <li class="stat">
          <div class="title">Stock Price</div>
          <div class="value">€886.66</div>
        </li>
        <li class="stat">
          <div class="title">Current Value</div>
          <div class="value">€1,203,019</div>
        </li>
        <li class="stat">
          <div class="title">Projected Value Oct '17</div>
          <div class="value">€1,563,925</div>
        </li>
      </ul>
    </div>

    <div class="company-cards">
      <transition-group name="flip-list" tag="div" class="container">
        <ResultCard
          v-for="(employee, index) in employees"
          :employee="employee"
          :decision="employee.decision"
          :score="employee.score"
          :decisionSentence="employee.decisionSentence"
          :avatarUrl="employee.avatarUrl"
          :title="employee.title"
          :number="employee.number"
          :key="employee['.key']"
        >
        </ResultCard>
      </transition-group>
    </div>

  </div>
</template>

<script>

import ResultCard from './ResultCard'

export default {
  components: { ResultCard },
  props: [ 'employees', 'companyInfo', 'selectedCompany' ],
  mounted() {
    this.$bus.$emit('stopTracking')
  }
}

</script>

<style lang="scss" scoped>

@import '../sass/variables';

.flip-list-move {
  transition: transform 1s;
}

#screen-browser {
  // cursor: none;
  display: flex;
  height: 100vh;
}

.company-cards {
  overflow-y: scroll;
}

.company-data {
  width: 525px;
  display: block;
}

.company-cards .container {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 1220px;
  flex-grow: 2;
}

::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
}

.company-data .screen-title {
  margin-top: 90px;
  margin-bottom: 40px;
}

ul.stats {
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: center;
}

li.stat {
  margin-bottom: 30px;
}

li.stat .title {
  opacity: 0.5;
  font-size: 18px;
  color: black;
  letter-spacing: 0.7px;
  margin-bottom: 10px;
}

li.stat .value {
  font-size: 36px;
  font-weight: 500;
}

#screen-browser .swiper-container {
  height: 100%;
}

#screen-browser .swiper-slide {
  display: flex;
  align-items: center;
}

.releaseNumber {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: rgba(0,0,0,0.15);
}

.company-presets {
  display: flex;
  justify-content: space-around;
  padding: 0 0 40px 0;
}

.company-presets .company {
  width: 450px;
  text-align: center;
  cursor: pointer;
  padding: 10px 20px;
  transition: 0.3s all ease-in-out;
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