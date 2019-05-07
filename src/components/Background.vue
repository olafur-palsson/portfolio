<template>
  <div class="image" v-bind:style="styleObject">
  </div>
</template>

<script>
export default {
  name: "Background",
  data () {
    return {
      public: process.env.BASE_URL
    }
  },
  props: {
    url: String
  },
  beforeMount () {
    const url = this.public + this.$props.url
    this.styleObject = { backgroundImage: `url(${url})` }
  }
};
</script>
