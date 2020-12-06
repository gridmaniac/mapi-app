<template>
  <v-form
    ref="form"
    v-model="valid"
  >
    <v-toolbar flat>
      <v-toolbar-title>Edit profile</v-toolbar-title>
    </v-toolbar>
    <v-container class="mx-auto pt-0" style="max-width:768px">
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Name"
            v-model="name"
            :rules="nameRules"
            hide-details
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-file-input
            v-model="image"
            :rules="imageRules"
            accept="image/*"
            append-icon="mdi-camera"
            prepend-icon=""
            outlined
            clearable
          >
            <template v-slot:label>
              <div>
                Upload image <small>(Optional)</small>
              </div>
            </template>
          </v-file-input>
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
          Save
        </v-btn>
      </v-footer>
    </v-container>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      valid: true,
      name: '',
      nameRules: [
        v => !!v || '',
        v => (v && v.length > 1) || 'Name must be greater than 1 character'
      ],
      image: null,
      imageRules: [
        file => !file || file?.size < 5e6 || 'Image size should be less than 5 MB.'
      ],
      isNextActive: true
    }
  },
  computed: {
    ...mapGetters(['profile'])
  },
  mounted () {
    this.$store.dispatch('searchTerms', '')
    this.name = this.profile.name
  },
  methods: {
    validate () {
      this.$refs.form.validate()
      this.next()
    },
    async next () {
      if (this.valid) {
        this.isNextActive = false
        try {
          const toBase64 = async function (file) {
            return new Promise(resolve => {
              const reader = new FileReader()
              reader.onload = e => {
                resolve(e.target.result)
              }
              reader.readAsDataURL(file)
            })
          }

          const image = this.image ? await toBase64(this.image) : null

          try {
            await this.$store.dispatch('updateProfile', {
              name: this.name,
              image
            })
            this.$router.push('search')
          } catch (e) {
            console.log(e)
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}
</script>
