<template>
  <div class="button" v-on:click="onClick()">
    <h1>{{ text }}</h1>
  </div>
</template>

<script>
export default {
  name: "Button",
  props: {
    text: String,
    onClick: Function
  }
};
</script>
