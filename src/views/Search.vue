<template>
  <div>
    <v-container class="mx-auto pa-sm-3 pa-0" style="max-width:1280px">
      <v-row>
        <v-col cols="12" sm="4" class="py-0">
          <v-autocomplete
            label="Choose Your Location"
            :items="areas"
            v-model="area"
            :search-input.sync="searchArea"
            :item-text="areaText"
            value="1"
            hide-details
            class="pa-0 elevation-1 input-background"
            background-color="light-blue lighten-2"
            dark
            filled
            append-icon="mdi-map-marker"
            style="border-radius:0;background-image:url('https://unsplash.it/2000/1125?image=479')"
            v-on:change="changeArea"
            ref="area"
            return-object
          >
            <template v-slot:prepend-item="">
              <v-list-item @click="findLocation">Find my location</v-list-item>
              <v-divider></v-divider>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="mx-auto" style="max-width:1280px">
      <v-row>
        <v-col cols="4" sm="12" class="py-0">
          <v-subheader style="white-space:nowrap;font-size:12px">I am looking for ...</v-subheader>
        </v-col>
        <v-col cols="8" sm="4" class="pt-0 pb-3">
          <v-select
            label="Any type"
            v-model="type"
            :items="types"
            single-line
            hide-details
            class="pa-0 ma-0"
            clearable
            solo
            filled
            background-color="grey lighten-4"
            flat
            dense
            v-on:change="startSearch"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4" class="pt-0">
          <v-autocomplete
            ref="input2"
            label="Search All Categories"
            v-model="term"
            :items="terms"
            :search-input.sync="searchTerm"
            :item-text="categoryText"
            hide-details
            class="pa-0 ma-0"
            single-line
            clearable
            outlined
            dense
            v-on:change="startSearch"
            return-object
          ></v-autocomplete>
        </v-col>
        <!-- <v-col cols="6" sm="4" class="pt-0">
          <v-autocomplete
            label="Subcategory"
            :items="items"
            hide-details
            class="pa-0 ma-0"
            single-line
            outlined
            dense
          ></v-autocomplete>
        </v-col> -->
        <v-col cols="12" sm="4" class="pt-0">
          <v-text-field
            ref="input"
            class="pa-0"
            v-model="search"
            placeholder="Additional Info (Optional)"
            hide-details
            outlined
            dense
            clearable
            @keydown.enter="startSearch"
          >
            <template v-slot:append-outer>
              <v-btn @click="startSearch" fab small color="white" class="green--text elevation-4" style="margin-top:-8px; margin-bottom:-5px">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <!-- <v-col cols="5" sm="4" class="pt-0">
          append-icon="mdi-magnify"
          <v-btn @click="startSearch" block depressed height="40px"><v-icon left>mdi-map-search-outline</v-icon> Search</v-btn>
        </v-col> -->
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <v-container class="mx-auto pa-sm-3 pa-0 hidden-xs-only" style="max-width:1280px">
      <v-row>
        <v-col cols="6">
          <v-toolbar
            flat
          >
            <!-- <v-toolbar-title>FAVORITES</v-toolbar-title> -->
            <v-spacer></v-spacer>
            <v-subheader>Sort by:</v-subheader>
            <v-chip-group
              mandatory
              active-class="primary--text"
              v-model="tag"
              @change="startSearch"
            >
              <v-chip v-for="tag in tags" :key="tag">
                {{ tag }}
              </v-chip>
            </v-chip-group>
          </v-toolbar>
          <v-list three-line style="max-height:416px;overflow-y: auto;">
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              to="/service"
            >
              <v-list-item-avatar>
                <!-- <v-img transition="false" src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img> -->
                <v-img transition="false" src="https://www.dumpsters.com/images/blog/carpentry_1530018525/carpentry-1200x600.jpg"></v-img>
                </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>Gyawu Baffour Amoateng</v-list-item-title>
                <v-list-item-subtitle><strong>Carpentry shop</strong></v-list-item-subtitle>
                <v-list-item-subtitle>
                  <v-rating
                    v-model="rating"
                    background-color="white"
                    color="yellow accent-4"
                    dense
                    half-increments
                    hover
                    size="18"
                  ></v-rating>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>1.4 km from you</v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="6">
          <!-- <google-map :name="test"></google-map> -->
          <!-- <l-map></l-map> -->
        </v-col>
      </v-row>
    </v-container>
    <v-container class="mx-auto pa-sm-3 pa-0 hidden-sm-and-up" style="max-width:1280px">
      <v-tabs
        background-color="white"
        color="primary"
        left
        grow
        v-model="tab"
      >
        <v-tab key="1">Display map</v-tab>
        <v-tab key="2">Display list</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" touchless>
        <v-tab-item key="afwfaw">
          <!-- <google-map :name="name"></google-map> -->
          <l-map
            style="height: 480px; width: 100%; z-index: 0;"
            :zoom="zoom"
            :center="area.location.coordinates"
            @update:zoom="zoomUpdated"
            @update:center="centerUpdated"
            @update:bounds="boundsUpdated"
          >
            <l-tile-layer :url="url"></l-tile-layer>
            <l-marker @click="test(x._id)" v-for="x in results" :key="x._id" :lat-lng="x.location.coordinates"></l-marker>
          </l-map>
        </v-tab-item>
        <v-tab-item key="awfawf">
          <v-toolbar
            flat
          >
            <!-- <v-toolbar-title>FAVORITES</v-toolbar-title> -->
            <v-spacer></v-spacer>
            <v-subheader>Sort by:</v-subheader>
            <v-chip-group
              mandatory
              active-class="primary--text"
              v-model="tag"
              @change="startSearch"
            >
              <v-chip v-for="tag in tags" :key="tag">
                {{ tag }}
              </v-chip>
            </v-chip-group>
          </v-toolbar>
          <v-row justify="center" v-if="!list">
            <!-- <v-progress-circular
              :size="70"
              :width="7"
              color="primary"
              indeterminate
            ></v-progress-circular> -->
            <v-skeleton-loader
              v-for="(item, i) in items"
              :key="i"
              class="px-3 py-2"
              type="list-item-avatar-two-line"
              width="100%"
            ></v-skeleton-loader>
          </v-row>
          <v-list three-line v-if="list">
            <v-list-item
              v-for="item in results"
              :key="item._id"
              :to="'/service/' + item._id"
            >
              <v-list-item-avatar>
                <v-img transition="false" :src="'http://192.168.64.142:3010/images/' + item.image"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{item.name}}</v-list-item-title>
                <v-list-item-subtitle><strong>{{item.title}}</strong></v-list-item-subtitle>
                <v-list-item-subtitle>
                  <v-rating
                    :value="item.rating ? item.rating : 0"
                    color="yellow accent-4"
                    dense
                    half-increments
                    readonly
                    size="18"
                  ></v-rating>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>{{(item.distance.toFixed(0) * 0.001).toFixed(3)}} km from you</v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
    <v-overlay :value="!profile || isLoading" color="#036358">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
// import L from 'leaflet'
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
      tab: 1,
      type: null,
      types: ['An individual freelancer', 'Small business', 'Company'],
      searchArea: null,
      searchTerm: null,
      term: null,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 14,
      center: [6.69, -1.62],
      bounds: null,
      markers: [],
      rating: 4.3,
      items: ['Odumasi', 'Asawasi', 'Zongo', 'Aboabo', 'Dichemso', 'Dichemso', 'Dichemso', 'Dichemso'],
      search: null,
      map: null,
      name: 'map',
      drawer: false,
      dialog: false,
      tag: null,
      tags: ['Rating', 'Distance'],
      list: true,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['area', 'areas', 'terms', 'profile', 'results'])
  },
  mounted () {
    this.$store.dispatch('searchAreas', '')
    this.$store.dispatch('searchTerms', '')
    // for (let i = 0; i < 25; i++) {
    //   const tm = [
    //     this.center[0] + Math.random() * 0.01 * (Math.random() > 0.5 ? 1 : -1),
    //     this.center[1] + Math.random() * 0.01 * (Math.random() > 0.5 ? 1 : -1)
    //   ]
    //   this.markers.push(tm)
    // }
  },
  watch: {
    searchArea (val) {
      if (val && val.indexOf('/') > 0) return
      this.$store.dispatch('searchAreas', val)
    },
    searchTerm (val) {
      if (val && val.indexOf('/') > 0) return
      this.$store.dispatch('searchTerms', val)
    },
    area (val) {
      if (!this.results) {
        this.startSearch()
      }
    }
  },
  methods: {
    test (id) {
      this.$router.push('/service/' + id)
    },
    zoomUpdated (zoom) {
      this.zoom = zoom
    },
    centerUpdated (center) {
      this.center = center
    },
    boundsUpdated (bounds) {
      this.bounds = bounds
    },
    areaText: x => (x.city || x.state || '') +
      (x.city || x.state ? ' / ' + x.name : x.name),
    findLocation () {
      this.$refs.area.blur()
      this.isLoading = true
      navigator.geolocation.getCurrentPosition(async pos => {
        const location = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        }

        try {
          await this.$store.dispatch('getAreaByLocation', location)
        } catch (e) {
          const location = { lat: '6.6919', lon: '-1.6128' }
          await this.$store.dispatch('getAreaByLocation', location)
        }

        this.isLoading = false
      })
    },
    categoryText: x => (x.category ? x.category : 'Others') + (x.title ? ' / ' + x.title : ''),
    changeArea (val) {
      this.$refs.area.blur()
      this.$store.commit('updateSelectedArea', val)
      this.startSearch()
    },
    async startSearch () {
      if (!this.area) return

      this.$refs.input.blur()
      this.$refs.input2.blur()
      this.list = false

      const typesMap = {
        'An individual freelancer': 'IF',
        'Small business': 'SB',
        Company: 'CO'
      }

      const query = {
        area: this.area,
        term: this.term,
        type: typesMap[this.type],
        search: this.search,
        sort: this.tag === 0 ? 'rating' : 'distance'
      }

      await this.$store.dispatch('search', query)

      this.list = true
    },
    open () {
      // this.drawer = !this.drawer
      // this.$router.go(-1)
    },
    getLocation () {
      navigator.geolocation.getCurrentPosition(pos => {
        // this.gettingLocation = false
        // this.location = pos
        alert(JSON.stringify(pos.coords.latitude) + ', ' + JSON.stringify(pos.coords.longitude))
      }, err => {
        // this.gettingLocation = false
        // this.errorStr = err.message
        alert(err.message)
      })
    }
  }
}
</script>

<style>
  .input-background .v-input__control {
    background-image: url(https://unsplash.it/2000/1125?image=479);
    background-size: cover;
    background-position: center;
  }
  .input-background {
    color: red;
  }
</style>
