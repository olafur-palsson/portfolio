<template>
  <div :class="classList">
    <p>{{ tag }}</p>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data () {
    return {
        classList: "tag"
    }
  },
  props: {
    tag: String
  },
  created () {
      this.classList += " " + this.$props.tag
  }

};
</script>
<style lang="scss" scoped>

$white: #F6F0ED;

.java {
    background-color: #d3311f;
    color: $white;
}

.python {
    background-color: #3671A2;
    color: #FFD747;
}

.HTML {
    background-color: #E44D26;
    color: $white;
}

.sass {
    background-color: #CD6799;
}

.CSS {
    background-color: #3595CF;
}

.javascript {
    background-color: #F7DF1E;
}

</style>

