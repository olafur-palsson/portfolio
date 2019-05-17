<template>
  <div class="image" v-bind:style="styleObject">
  </div>
</template>

<script>
export default {
  name: "Background",

  data ()  {
    return {
      publicFolderPath: process.env.BASE_URL
    }
  },

  props: {
    url: String
  },

  created () {
    const url = this.$props.url
    const prefix = this.getUrlPrefix(url)
    this.styleObject = { backgroundImage: `url(${prefix + url})` }
  },

  methods: {
    isHttp: url => url.match(/^http/),
    getUrlPrefix (url) {
      return this.isHttp(url) ? "" : this.publicFolderPath
    }
  }
};
</script>
