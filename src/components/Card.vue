<template>
  <div class="card">
    <Background :url="imgUrl" />
    <div class="card__description">
      <a :href="link"><div class="card__text">{{ description }}</div></a>
      <a :href="github"><div class="card__text github"> GitHub </div></a>
      
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
    imgUrl: String,
    github: String,
    link: String
  }
};
</script>

<style lang="scss">

a {
  height: 100%;
  width: 100%;
}

</style>