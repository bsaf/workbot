<template>
  <div class="debug-container">
    <ul>
      <li>
        <span class="key">facePresentCount</span>
        <span class="value">{{facePresentCount}}</span>
      </li>
      <li>
        <span class="key">show face tracking</span>
        <span class="value">
          <input type="checkbox" v-model="showFaceTracking">
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  created() {
    this.$bus.$on("facePresentCountChanged", event => {
      this.facePresentCount = event;
    });
  },
  data() {
    return {
      newTodoText: "",
      facePresentCount: null,
      showFaceTracking: false
    };
  },
  methods: {
    addTodo: function() {
      if (this.newTodoText) {
        this.newTodoText = "";
      }
    }
  },
  watch: {
    showFaceTracking() {
      this.$bus.$emit("toggleFaceTracker");
    }
  }
};
</script>

<style lang="scss" scoped>
.debug-container {
  font-family: "Courier";
  background: black;
  color: white;
  font-size: 12px;
  padding: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 20px;
}

.key {
  color: #f5d530;
  padding: 5px;
  display: inline-block;
  min-width: 150px;
}

.value {
  color: #128786;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}
</style>
