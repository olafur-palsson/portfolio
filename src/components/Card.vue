<template>
  <div class="card">
    <Background v-bind:url="imgUrl" />
    <div class="card__description">
      <p class="card__text">{{ description }}</p>
    </div>
  </div>
</template>

<script>
import Background from "./Background";

export default {
  name: "Card",
  components: {
    Background
  },
  props: {
    description: String,
    imgUrl: String
  }
};
</script>
