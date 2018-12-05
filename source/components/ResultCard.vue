<template>
  <div class="result-card" :class="{ 'yes' : decision }" @click="logEmployee()">
    <div class="info">
      <div class="profile-pic" :style="`background-image: url(${avatarUrl})`"></div>
      <div class="profile-title">{{title}}</div>
    </div>
    <div class="score">Score {{score}}</div>
    <div class="result-text">{{decisionSentence}}</div>
    <div class="footer">
      <div class="number">#{{ number || "00000" }}</div>
      <div class="number-label">Employee Number</div>
    </div>
  </div>
</template>

<script>
export default {
  props: [ 'employee', 'decision', 'decisionSentence', 'score', 'avatarUrl', 'title', 'number' ],
  methods: {
    logEmployee() { console.log(this.employee) }
  }
}
</script>

<style lang="scss" scoped>

@import '../sass/variables';

.result-card {
  background-color: white;
  background-image: url(../img/no.png);
  background-position: center 140px;
  background-size: 75%;
  background-repeat: no-repeat;
  color: black;
  $scale: 0.5;
  padding: 20px;
  width: (576px * $scale);
  height: (815px * $scale);
  position: relative;
  margin: 8px;
  transition: 0.3s all ease-in-out;
}

.result-card.yes {
  background-color: $yellow;
  background-image: url(../img/yes.png);
}

.result-card .result-text {
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
}

.score {
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}

.info {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.info .profile-pic {
  $size: 100px;
  width: $size;
  height: $size;
  background-color: #EEE;
  border-radius: 100px;
  margin-right: 10px;
  background-position: center;
  background-size: cover;
  transition: 2s background-image;
  transform: scaleX(-1);
}

.info .profile-title {
  width: 140px;
  font-size: 12px;
  font-weight: 500;
}

.footer {
  position: absolute;
  bottom: 0;
  text-align: center;
  width: 100%;
  left: 0;
  right: 0;
  height: 60px;
}

.footer .number {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 5px;
}

.footer .number-label {
  font-size: 10px;
}


</style>
