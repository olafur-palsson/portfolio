<template>
  <div :class="className" >
    <div class="project__content">
      <Card :description="description" :imgUrl="image" :github="github" />
      <div class="project__text">
        <p>{{ new Date(parseInt(date)).toDateString() }}</p>
        <p class="project__text__heading">{{ heading }}</p>
        <p class="project__text__text">{{ text }}</p>
        <div class="tagList">
          <Tag v-for="tag in tagsAsArray" :key="tag" :tag="tag" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Card from "./Card"
import Tag from "./Tag"

export default {
  name: "Project",
  components: {
    Card,
    Tag
  },
  props: {
    data: Object,
    categoryNumber: Number
  },
  created () {
    Object.assign(this, this.$props.data)
    this.className = 'project'
    if (this.$props.number % 2)
      this.className += ' reverse'
    this.tagsAsArray = this.tags.split(" ")
    console.log(this.tagsAsArray)
  }
};
</script>
