<template>
  <div id="app">
    <Jumbotron :displayContactInfo="displayContactInfo"/>

    <Project v-for="project in projects" :key="project.text" :data="project"/>
    <Footer />

    <Contact v-if="shouldDisplayContact" :hideSelf="hideContactInfo" />
  </div>
</template>

<script>
// import HelloWorld from "@/components/HelloWorld.vue";
import Jumbotron from '@/components/Jumbotron'
import Project from '@/components/Project'
import Footer from '@/components/Footer'
import Contact from '@/components/Contact'

const jsonData = require('@/projects.json')

console.log(jsonData)

export default {
  name: 'app',
  data () {
    return {
      projectSampleData: {
        description: 'Nothing',
        text: 'A lot of othehe ehoatns euoahtnu ehotanbkqjnkbosnhueoahuc., uhao uhceoaueoaueoa hueoanth u,tnhutns acjraq dkqk oha ueoa aotehuetoahuteao ss etc.',
        heading: 'Testing Sample stuff with a long heading texto',
        imgUrl: 'https://i.imgur.com/pnVKnUz.png'
      },
      projects: jsonData,
      shouldDisplayContact: true,
    }
  },
  components: {
    Jumbotron,
    Project,
    Footer,
    Contact
  },

  methods: {
    displayContactInfo () {
      this.shouldDisplayContact = true
    },
    hideContactInfo () {
      this.shouldDisplayContact = false
    }
  }

};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@import "./reset.css";
@import "./main.scss";
</style>
