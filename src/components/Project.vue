<template>
  <div class="project">
    <Card v-bind:description="description" v-bind:imgUrl="imgUrl" />
    <div class="project__text">
        <p class="project__text__heading">{{ heading }}</p>
        <p class="project__text__text">{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    data: Object,
    categoryNumber: Number
  },
  create () {
    const { text, heading, imgUrl, imgDescription } = this.$props.data
    this.text = text
    this.heading = heading
    this.imgUrl = imgUrl
    this.imgDescription = imgDescription
  }
};
</script>
