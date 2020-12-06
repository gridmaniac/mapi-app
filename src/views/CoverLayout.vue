<template>
  <v-app>
    <v-main>
      <v-btn
        color="secondary"
        dark
        fixed
        left
        top
        fab
        @click.stop="back"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
// @ is an alias to /src
// import logo from '@/assets/logo.png'

export default {
  name: 'CoverLayout',
  data () {
    return {
    }
  },
  mounted () {
    this.$vuetify.goTo(0, {
      duration: 0
    })
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
