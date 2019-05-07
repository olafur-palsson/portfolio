<template>
  <div class="card">
    <Image v-bind:url="imgurl" />
    <p class="card__description">{{ description }}</p>
  </div>
</template>

<script>
import Image from "./Image";

export default {
  name: "Card",
  components: {
    Image
  },
  props: {
    description: String,
    imgUrl: String
  }
};
</script>
