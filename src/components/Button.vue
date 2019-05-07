<template>
  <div class="button">
    <h1>{{ text }}</h1>
  </div>
</template>

<script>
export default {
  name: "Button",
  props: {
    text: String
  }
};
</script>
