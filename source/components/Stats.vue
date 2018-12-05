<template>

  <div class="stats-container">

    <div class="header">
      <img class="avatar" :src="employee.avatarUrl" />
      <div class="job-title-container">
        <div class="job-title">{{ employee.title }}</div>
      </div>
    </div>

    <div class="stats-grid">
      <div v-for="stat in employee.displayStats" class="stat">
        <div class="value">{{capitalize(stat.value)}}</div>
        <div class="label">{{stat.title}}</div>
      </div>
    </div>

  </div>

</template>

<script>

export default {
  props: [ 'employee' ],
  data() {
    return { }
  },
  methods: {
    capitalize(value) {
      var str = value.toString()
      return str.charAt(0).toUpperCase() + str.toString().slice(1);
    }
  },
  computed: {
  }

}

</script>

<style lang="scss" scoped>

@import '../sass/variables';

.stats-container {
  padding: 75px 80px;
}

.header {
  margin-bottom: 30px;
}

.header .avatar {
  $size: 220px;
  width: $size;
  height: $size;
  background-color: $yellow;
  border-radius: $size*2;
  margin-right: 20px;
  transform: scaleX(-1);
  float: left;
  overflow: hidden;
}

.header .job-title-container {
  display: flex;
  align-items: center;
  height: 220px;
}

.header .job-title {
  font-size: 25px;
  font-weight: 500;
}

.stats-container {
  background-color: $yellow;
  width: 700px;
  height: 800px;
}

.left-row,
.right-row {
  position: absolute;
  top: 100px;
}

.left-row {
  left: 40px;
}

.right-row {
  right: 40px;
}

.stats-grid {
  display: flex;
  flex-wrap: wrap;
}

.stat {
  width: 50%;
  margin-bottom: 20px;
}

.stat .value {
  font-size: 35px;
  margin-bottom: 5px;
}

</style>
