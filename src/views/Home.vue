<template>
  <v-container class="mx-auto fill-height" style="max-width:512px;margin-top:-40px">
    <v-row>
      <v-col cols="12">
        <v-row align="center" :justify="justify">
          <v-img
            alt="FiXpert Logo"
            contain
            :src="require('@/assets/medium-v2.png')"
            width="350"
            height="350"
            max-width="350"
            class="mx-2"
            style="margin-bottom:50px"
            transition="scale-transition" origin="center center"
          />
        </v-row>
        <v-row :class="justify == 'center' ? 'text-center' : 'text-right'">
          <v-list
            three-line
          >
            <!-- <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="font-italic font-weight-bold green--text text-subtitle-1 px-1 pb-10" style="font-size:18px; transform: translate(139px, -12px) rotate(-20deg);">Your Nearby Expert</v-list-item-title>
              </v-list-item-content>
            </v-list-item> -->
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Looking for people nearby?</v-list-item-title>
                <v-list-item-subtitle>
                  <v-btn @click="next(false)" depressed outlined x-large color="light-blue lighten-2" class="mt-3">Let's get started!</v-btn>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="my-3"></v-divider>
            <!-- <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Providing your own service?</v-list-item-title>
                <v-list-item-subtitle>
                  <v-btn @click="next(true)" depressed color="green" dark class="mt-3">Continue as a service provider</v-btn>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item> -->
          </v-list>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">NOTICE</v-card-title>
        <v-card-text>
          <ul>
            <li>This application may share your location data.</li>
            <li>This application may share your contact data.</li>
            <li>This application may display Ads.</li>
            <li>This Application may use cookies for functional & analytical purposes</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog = false">Exit</v-btn>
          <v-btn color="light-blue lighten-2" outlined @click="agree">I Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <InstallPopup/>
  </v-container>
</template>

<script>
import InstallPopup from '@/components/InstallPopup'

export default {
  components: {
    InstallPopup
  },
  data () {
    return {
      dialog: false,
      isService: false
    }
  },
  computed: {
    justify () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 'end'
        case 'sm': return 'center'
        case 'md': return 'center'
        case 'lg': return 'center'
        case 'xl': return 'center'
      }

      return 'end'
    }
  },
  methods: {
    agree () {
      this.dialog = false
      this.$store.commit('resetState')
      if (this.isService) {
        this.$router.push('/type')
        return
      }
      this.$router.push('/start')
    },
    next (isService) {
      this.isService = isService
      this.dialog = true
    }
  }
}
</script>
