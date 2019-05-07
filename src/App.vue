<template>
  <div id="app">
    <Jumbotron />
    <img alt="Vue logo" src="./assets/logo.png" />
    <!--HelloWorld msg="Welcome to Your Vue.js App" /-->
  </div>
</template>

<script>
// import HelloWorld from "@/components/HelloWorld.vue";
import Jumbotron from "@/components/Jumbotron.vue";

export default {
  name: "app",
  components: {
    // HelloWorld,
    Jumbotron
  }
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@import "./reset.css";
</style>
