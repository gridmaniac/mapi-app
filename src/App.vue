<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),

  mounted () {
    window.onpopstate = event => {
      if (this.$store.getters.isLoggedIn) {
        return
      }

      this.$router.push('/')
    }
  }
}
</script>

<style>
  html {
    overflow-x: hidden;
    /* overflow-y: hidden; */
  }

  body, .v-main, .v-app {
    overflow-x: hidden;
    /* overflow-y: hidden; */
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
    transform: translateY(2em);
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .3s ease;
  }
</style>
