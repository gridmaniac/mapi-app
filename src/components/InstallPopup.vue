<template>
  <v-footer fixed class="pa-0">
    <v-banner v-model="addApp" two-line class="text-subtitle-2">
      <v-avatar
        slot="icon"
        color="grey"
        size="40"
      >
        <v-icon
          color="white"
        >
          mdi-plus-box-outline
        </v-icon>
      </v-avatar>

      Install this app on your iPhone: <br>Tap <v-icon color="blue">mdi-export-variant</v-icon> and then <strong>Add to homescreen</strong>

      <template v-slot:actions>
        <v-btn text color="light-blue lighten-2" @click="hideApp">No, thanks</v-btn>
      </template>
    </v-banner>
  </v-footer>
</template>

<script>
export default {
  name: 'InstallPopup',
  data () {
    return {
      addApp: false
    }
  },
  created () {
    setTimeout(() => {
      const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase()
        return /iphone|ipad|ipod/.test(userAgent)
      }
      // Detects if device is in standalone mode
      const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone)

      // Checks if should display install popup notification:
      if (isIos() && !isInStandaloneMode()) {
        this.addApp = true
      }
    }, 500)
  },
  methods: {
    hideApp () {
      this.addApp = false
    }
  }
}
</script>
