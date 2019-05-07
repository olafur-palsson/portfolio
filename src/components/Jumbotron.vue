<template>
  <div class="jumbotron">
    <Button text="Click me bro" />
    <Card description="Ólafur Pálsson" imgUrl="../assets/logo.png" />
  </div>
</template>

<script>
import Button from "./Button.vue";
import Card from "./Card";

export default {
  name: "Jumbotron",
  components: {
    Button,
    Card
  },
  props: {
    msg: String
  }
};
</script>

<style>
.jumbotron {
  background-image: url("../assets/bg.jpg");
}
</style>
