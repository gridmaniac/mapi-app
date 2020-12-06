<template>
  <div>
    <v-container class="mx-auto pa-sm-3 pa-0" style="max-width:1280px">
      <v-card
          class="mx-auto elevation-0"
        >
        <v-img style="position: relative"
          height="150"
          :src="poster"
          transition="slide-y-transition"
        >
        </v-img>

        <v-card-title>{{service.name}}</v-card-title>

        <v-card-text>
          <v-row
            align="center"
            class="mx-0"
          >
            <v-rating
              :value="rating"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>
            <!-- <div class="grey--text mx-4">4.5 (413)</div> -->
            <div v-if="rating != 0" class="grey--text mx-4">{{rating}} ({{ratingsCount}})</div>
            <div v-if="rating == 0" class="grey--text mx-4">No ratings</div>
            <v-btn
              color="yellow darken-2"
              outlined
              @click="overlay = !overlay"
              v-if="!this.isMe && !this.exRating"
            >
              Rate
            </v-btn>
          </v-row>

          <div class="my-4 subtitle-2">
            {{service.area ? service.area.name : ''}} • {{title}}
          </div>

          <div>{{description}}</div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="cyan darken-1"
            text
            v-if="!!webSite"
            :href="'https://' + webSite"
            target="_blank"
          >
            Website
          </v-btn>
          <v-btn
            color="teal accent-4"
            text
            v-if="!isMe && !favorite"
            @click="addToFavorites"
          >
            Add to favorites
          </v-btn>
          <v-btn
            color="red lighten-2"
            text
            v-if="!isMe && favorite"
            @click="removeFromFavorites"
          >
            Remove from favorites
          </v-btn>
        </v-card-actions>

        <v-divider class="mx-4"></v-divider>

        <v-card-title>Display phone number</v-card-title>

        <v-card-text>
          <v-btn
            color="deep-purple lighten-2"
            outlined
            large
            block
            v-if="!isPhoneVisible"
            @click="accept"
          >
            Accept & display phone number
          </v-btn>
          <v-btn
            color="green"
            dark
            large
            block
            v-if="isPhoneVisible"
            :href='`tel:${phone}`'
          >
            <v-icon left>
              mdi-phone
            </v-icon>
            {{phone}}
          </v-btn>
          <div
            class="my-4 subtitle-3"
          >
            By clicking this button, I hereby agree to the Terms and Conditions.
          </div>
          <!-- <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip>5:30PM</v-chip>

            <v-chip>7:30PM</v-chip>

            <v-chip>8:00PM</v-chip>

            <v-chip>9:00PM</v-chip>
          </v-chip-group> -->
        </v-card-text>
        <l-map
          style="height: 480px; width: 100%; z-index: 0;"
          :zoom="zoom"
          :center="coordinates"
          @update:zoom="zoomUpdated"
          @update:center="centerUpdated"
          @update:bounds="boundsUpdated"
        >
          <l-tile-layer :url="url"></l-tile-layer>
          <l-marker :lat-lng="coordinates"></l-marker>
        </l-map>
      </v-card>
      <v-overlay :value="overlay">
        <!-- <v-btn
          icon
          @click="overlay = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn> -->
        <v-card
          class="elevation-16 mx-auto"
          width="300"
        >
          <v-card-title class="headline">
            Rate Service
          </v-card-title>
          <v-card-text>
            If you enjoy working with Gyawu Baffour Amoateng, please take a few seconds to rate your experience. It really helps!

            <div class="text-center mt-12">
              <v-rating
                v-model="starRating"
                color="yellow darken-3"
                background-color="grey darken-1"
                empty-icon="$ratingFull"
                half-increments
                hover
              ></v-rating>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-space-between">
            <v-btn text @click="overlay = false">No Thanks</v-btn>
            <v-btn
              color="primary"
              text
              @click="rateService"
            >
              Rate Now
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
      <v-overlay :value="snackbar">
        <v-snackbar
          v-model="snackbar"
          timeout="2000"
          shaped
          elevation="24"
          centered
        >
          Thank you for your feedback!
        </v-snackbar>
      </v-overlay>
    </v-container>
    <v-overlay :value="!service" color="#036358">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'

import { mapGetters } from 'vuex'

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 16,
      bounds: null,
      overlay: false,
      snackbar: false,
      isPhoneVisible: false,
      starRating: 5
    }
  },
  methods: {
    async rateService () {
      this.overlay = false

      try {
        await this.$store.dispatch('rateService', this.starRating)
      } catch (e) {
        console.log(e)
      }

      this.snackbar = true
    },
    accept () {
      this.isPhoneVisible = true
    },
    async addToFavorites () {
      try {
        await this.$store.dispatch('addToFavorites', this.service._id)
      } catch (e) {
        console.log(e)
      }
    },
    async removeFromFavorites () {
      try {
        await this.$store.dispatch('removeFromFavorites', this.service._id)
      } catch (e) {
        console.log(e)
      }
    },
    zoomUpdated (zoom) {
      this.zoom = zoom
    },
    centerUpdated (center) {
      this.center = center
    },
    boundsUpdated (bounds) {
      this.bounds = bounds
    }
  },
  computed: {
    ...mapGetters(['service', 'poster', 'title', 'description', 'webSite', 'phone', 'coordinates', 'rating', 'favorite', 'isMe', 'exRating', 'ratingsCount']),
    canRate () {
      if (this.isMe) {
        return false
      }

      if (this.rating) return false

      return true
    }
    // canAddToFavorites () {
    //   if (this.isMe) {
    //     return false
    //   }

    //   return true
    // }
  },
  async mounted () {
    const { id } = this.$route.params
    await this.$store.dispatch('getServiceById', id)

    // if (!this.service.isService) {
    //   this.$router.push('/search')
    // }
  }
}
</script>
