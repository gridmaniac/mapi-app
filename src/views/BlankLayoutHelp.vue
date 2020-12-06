<template>
  <v-app>
    <v-main>
      <!-- <v-fab-transition>
        <v-btn
          v-show="fab"
          color="white"
          class="green--text"
          fixed
          right
          top
          fab
          @click.stop="showHelp"
        >
          <v-icon>mdi-account-question</v-icon>
        </v-btn>
      </v-fab-transition> -->
      <v-dialog v-model="help" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="secondary" dense class="elevation-0">
            <v-btn icon dark @click="help = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Help</v-toolbar-title>
          </v-toolbar>
          <v-list three-line subheader>
            <v-subheader>Need Help?</v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Call us on:</v-list-item-title>
                <v-list-item-subtitle><v-btn dark color="green" href="tel:0503-404050"><v-icon left>mdi-phone</v-icon> 0503-404050</v-btn></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Send us a message:</v-list-item-title>
                <v-list-item-subtitle><v-btn dark color="green" href="mailto:support@fixpert.net"><v-icon left>mdi-email</v-icon> support@fixpert.net</v-btn></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list three-line subheader>
            <v-subheader>You can leave a message using the contact form below.</v-subheader>
            <v-list-item>
               <v-text-field
                v-model="email"
                large
                label="Email"
                placeholder=" "
                outlined
                hide-details
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-textarea
                v-model="text"
                outlined
                label="Your question"
                placeholder=" "
              ></v-textarea>
            </v-list-item>
          </v-list>
          <v-list-item>
            <v-btn
              color="green"
              dark
              fab absolute
              top
              right
              @click="sendForm"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </v-list-item>
        </v-card>
        <v-overlay :value="snackbar">
          <v-snackbar
            v-model="snackbar"
            timeout="5000"
            color="green"
            shaped
            centered
          >
            Thank you for writing to us, a FiXpert will get in touch as soon as possible. For urgent inquiries click the telephone number listed above to talk to one of our staff members.
          </v-snackbar>
        </v-overlay>
      </v-dialog>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
// @ is an alias to /src
// import logo from '@/assets/logo.png'

export default {
  name: 'BlankLayout',
  data () {
    return {
      help: false,
      fab: false,
      snackbar: false,
      email: '',
      text: ''
    }
  },
  methods: {
    showHelp () {
      this.help = true
    },
    sendForm () {
      this.snackbar = true
      this.email = ''
      this.text = ''
    }
  },
  created () {
    setTimeout(() => {
      this.fab = true
    }, 500)
  }
}
</script>

<style scoped>
.v-overlay--active {
  pointer-events: unset;
}
</style>
