<template>
  <v-app>
    <!-- <v-app-bar
      app
      color="white"
      elevate-on-scroll
    >
      <div class="d-flex align-center">
        <v-img
          alt="FiXpert Logo"
          contain
          :src="require('@/assets/logo.png')"
          transition="scale-transition"
          width="90"
        />
      </div>

      <v-spacer></v-spacer>

      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </v-app-bar>-->
    <v-app-bar app class="mx-auto elevation-0" fixed style="max-width:1280px" color="white">
      <v-img
        alt="Mapi Logo"
        contain
        :src="require('@/assets/logo.png')"
        width="90"
        max-height="90"
        max-width="80"
        class="mx-2"
        transition="slide-x-transition"
        app
      />
      <v-spacer></v-spacer>
      <v-chip
        pill
        color="white"
        @click="showServicePage"
      >
        <span>Welcome, <strong>{{name}}</strong></span>
        <v-avatar right>
          <v-img :src="image"></v-img>
          <!-- <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img> -->
        </v-avatar>
      </v-chip>
      <v-spacer></v-spacer>
      <v-btn icon class="d-none d-sm-flex">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon class="d-none d-sm-flex">
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon @click.stop="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
        fixed
        right
        app
        @transitionend="fix"
      >
      <v-list-item>
        <v-spacer></v-spacer>
        <v-list-item-avatar>
          <v-img :src="image"></v-img>
        </v-list-item-avatar>

        <!-- <v-list-item-content>
          <v-list-item-title>Hans</v-list-item-title>
        </v-list-item-content> -->
        <v-spacer></v-spacer>
      </v-list-item>

      <v-divider></v-divider>

      <v-btn text block large to="/search">Search</v-btn>
      <!-- <v-btn text block large to="/favorites">Favorites</v-btn> -->
      <v-btn text block large to="/area">Edit location</v-btn>
      <!-- <v-btn text block large to="/edit" v-if="isService">Edit profile</v-btn> -->
      <v-btn text block large to="/edit-s" v-if="!isService">Edit profile</v-btn>
      <!-- <v-btn text block large to="/switch" v-if="!isService">Switch to service</v-btn> -->
      <v-btn text block large @click="deleteProfile">Delete profile</v-btn>
      <!-- <v-btn text block large to="/legal">Legal & privacy</v-btn> -->
      <!-- <v-btn text block large @click="showHelp">Help</v-btn> -->
      <!-- <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>John Leider</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>

        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list> -->
      <template v-slot:append>
        <div class="pa-5">
          <v-btn @click="logout" text block color="error">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <v-fab-transition>
        <v-btn
          v-scroll="onScroll"
          v-show="fab"
          fab
          dark
          fixed
          bottom
          right
          color="dark"
          @click="toTop"
        >
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
      </v-fab-transition>
      <!-- <v-container class="pa-0" style="max-width:1000px;"> -->
        <!-- <v-divider></v-divider> -->
      <transition name="fade">
        <router-view></router-view>
      </transition>
      <InstallPopup/>
      <v-bottom-sheet v-model="sheet">
        <v-sheet class="text-center" height="250px">
          <v-btn
            class="mt-6"
            outlined
            color="green"
            @click="sheet = !sheet"
          >Cancel</v-btn>
          <div class="py-3">Are you sure you want to delete your profile? <br>All your stored information will be deleted and you will no longer appear in searches.</div>
          <v-btn
            class="mt-6"
            text
            color="red"
            @click="deleteAnyway"
          >Delete anyway</v-btn>
        </v-sheet>
      </v-bottom-sheet>
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
              fab absolute
              top
              right
              dark
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
    </v-main>
  </v-app>
</template>

<script>
import InstallPopup from '@/components/InstallPopup'
import { mapGetters } from 'vuex'

export default {
  name: 'MainLayout',
  components: {
    InstallPopup
  },
  data () {
    return {
      drawer: null,
      sheet: false,
      help: false,
      snackbar: false,
      email: '',
      text: '',
      items: [
        { title: 'Home', icon: 'mdi-map-search' },
        { title: 'About', icon: 'mdi-map-search' }
      ],
      fab: false
    }
  },
  computed: {
    ...mapGetters(['id', 'image', 'name', 'isService', 'area'])
  },
  async mounted () {
    await this.$store.dispatch('getProfile')

    if (!this.area) {
      this.$router.push('area')
    }
  },
  methods: {
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop () {
      this.$vuetify.goTo(0)
    },
    showHelp () {
      this.drawer = false
      this.help = true
    },
    showServicePage () {
      if (this.isService) {
        this.$router.push(`/service/${this.id}`)
      }
    },
    sendForm () {
      this.snackbar = true
      this.email = ''
      this.text = ''
    },
    deleteProfile () {
      this.drawer = false
      this.sheet = true
    },
    async deleteAnyway () {
      try {
        await this.$store.dispatch('deleteAccount')
        this.$router.push('/')
      } catch (e) {
        console.log(e)
      }
    },
    fix () {
      const elements = document.getElementsByClassName('v-overlay__scrim')
      for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', () => {
          this.drawer = null
        }, false)
      }
    },
    logout () {
      this.$store.dispatch('logout')
      this.$router.push('/')
    }
  }
}
</script>
