<template>
  <div class="image" v-bind:style="{ backgroundImage: `url(${url})` }">
    <p>{{ url }}</p>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    url: String
  }
};
</script>
