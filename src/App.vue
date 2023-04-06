<template>
  <Navbar />
  <Body />

</template>

<script>
import Navbar from "./components/NavbarComponent.vue";
import Body from "./components/BodyComponent.vue";

export default {
  name: "App",
  components: {
    Navbar,
    Body,
  },

};
</script>
<style>
#app {
  display: block;
}
</style>
