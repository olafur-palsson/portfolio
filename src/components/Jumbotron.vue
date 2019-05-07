<template>
  <div class="jumbotron">
    <div class="jumbotron__content">
      <Card description="Ólafur Pálsson" imgUrl="img.png" />
      <div class="jumbotron__buttons">
        <Button text="Click me bro" />
        <Button text="Click me too" />
        <Button text="Click me also" />
      </div>
    </div>
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

Button {
  margin: 7px;
}
</style>
