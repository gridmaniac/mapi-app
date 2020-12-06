<template>
  <v-container class="mx-auto fill-height" style="max-width:768px">
    <v-form
      ref="form"
      v-model="valid"
    >
      <v-row>
        <v-col cols="12">
          <v-toolbar flat>
            <v-spacer/>
            <v-toolbar-title>I am located at ...</v-toolbar-title>
            <v-spacer/>
          </v-toolbar>
        </v-col>
        <v-col cols="12">
          <v-btn
            block
            x-large
            tile
            color="light-blue lighten-2"
            :disabled="isLoading"
            :dark="!isLoading"
            :loading="isLoading"
            @click="findLocation"
          >Find my location</v-btn>
        </v-col>
        <v-col cols="12">
          <v-toolbar flat>
            <v-spacer/>
            <v-toolbar-title>OR</v-toolbar-title>
            <v-spacer/>
          </v-toolbar>
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            ref="area"
            v-model="area"
            :rules="areaRules"
            label="Select area"
            :items="areas"
            :search-input.sync="searchArea"
            :item-text="text"
            hide-details
            class="pa-0 ma-0"
            clearable
            outlined
            return-object
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-footer
        fixed
        class="pa-0"
      >
        <v-btn
          block
          tile
          :dark="isNextActive"
          large
          color="light-blue lighten-2"
          :disabled="!isNextActive"
          :loading="!isNextActive"
          @click="validate"
        >
          Continue
        </v-btn>
      </v-footer>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      valid: true,
      area: null,
      areaRules: [
        v => !!v || ''
      ],
      searchArea: null,
      isNextActive: true,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['areas'])
  },
  mounted () {
    if (this.$vuetify.breakpoint.name === 'xs') {
      this.$vuetify.goTo(150)
    }

    this.$store.dispatch('searchAreas', '')
  },
  watch: {
    searchArea (val) {
      if (val && val.indexOf('/') > 0) return
      this.$store.dispatch('searchAreas', val)
    }
  },
  methods: {
    text: x => (x.city || x.state || '') +
      (x.city || x.state ? ' / ' + x.name : x.name),

    validate () {
      this.$refs.form.validate()
      this.next()
    },
    findLocation () {
      this.isLoading = true
      this.isNextActive = false
      navigator.geolocation.getCurrentPosition(async pos => {
        const location = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        }

        try {
          await this.$store.dispatch('setAreaByLocation', location)
          this.$router.push('/')
        } catch (e) {
          const location = { lat: '6.6919', lon: '-1.6128' }
          await this.$store.dispatch('setAreaByLocation', location)

          this.$router.push('/')
        }

        this.isLoading = false
      })
    },
    async next () {
      if (this.valid) {
        this.isNextActive = false
        this.isLoading = true
        await this.$store.dispatch('setArea', this.area)
        this.$router.push('/')
      }
    }
  }
}
</script>
