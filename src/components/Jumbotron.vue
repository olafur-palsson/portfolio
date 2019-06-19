<template>
  <div class="jumbotron">
    <div class="jumbotron__content">
      <Card description="Ólafur Pálsson" imgUrl="portrait.jpg" github="https://github.com/olafur-palsson"/>
      <div class="jumbotron__buttons">
        <Button text="Contact" :onClick="copyContactInfo" />
        <a href="https://drive.google.com/open?id=1AVM1VyME25Uova1_52VTS9LuPVyoD_Tq">
          <Button text="Resume" />
        </a>
        <Button text="Projects" :onClick="scroolToProjects" />
        <input id="secret" type="text" style="" value="olafur.palsson2@gmail.com">
      </div>
    </div>
  </div>
</template>

<script>
import Button from "./Button.vue";
import Card from "./Card";

export default {
  name: "Jumbotron",
  components: {
    Button,
    Card
  },
  props: {
    msg: String,
    displayContactInfo: Function
  },
  methods: {
    downloadResume: () => window.open("https://drive.google.com/open?id=1U_SYD9D5fimXbtPyWSujhKKoxuKHIa9t"),
    scroolToProjects () {
      console.log("yolo")
      const top = document.querySelector(".project").getBoundingClientRect().top + window.scrollY - 20
      window.scroll({ top, behavior: 'smooth' })
    },
    copyContactInfo () {
      const secret = document.getElementById('secret')
      secret.select()
      console.log(secret)
      document.execCommand('copy')
      alert("Email copied to clipboard! :)")
    }
  },
  created () {
    console.log(this.displayContactInfo)
  }
};
</script>

<style>
.jumbotron {
  background-image: url("../assets/bg.jpg");
}

Button {
  margin: 7px;
}

a {
  height: 100%;
  width: 100%;
  text-decoration: none;
}
</style>
