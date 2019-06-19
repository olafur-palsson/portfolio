<template>
  <div class="card">
    <Background :url="imgUrl" />
    <div class="card__description">

      <a :href="link" v-if="link"><div class="card__text moves">{{ description }}</div></a>
      <div class="card__text" v-else>{{ description }}</div>

      <a :href="github"><div class="card__text github moves"> GitHub </div></a>
      
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