<template>
  <v-form
    ref="form"
    v-model="valid"
  >
    <v-container class="mx-auto" style="max-width:768px">
      <v-row>
        <v-col cols="12">
          <v-toolbar flat>
            <v-toolbar-title>Just a few more things ...</v-toolbar-title>
          </v-toolbar>
        </v-col>
        <v-col cols="12" v-if="category">
          <v-chip
            close
            outlined
            label
            color="primary"
            close-icon="mdi-pen"
            @click="clearCategory"
          >
            Category: {{ category }}
          </v-chip>
        </v-col>
        <v-col cols="12" v-if="!category">
          <v-autocomplete
            ref="term"
            v-model="term"
            :rules="termRules"
            label="What kind of service are you providing?"
            :items="terms"
            :search-input.sync="searchTerm"
            :item-text="text"
            hide-details
            class="pa-0 ma-0"
            clearable
            outlined
            v-on:change="selectTerm"
            return-object
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" v-if="category">
          <v-autocomplete
            ref="categoryTerm"
            v-model="categoryTerm"
            :rules="categoryTermRules"
            label="Please select relevant service title"
            :items="categoryTerms"
            :search-input.sync="searchCategoryTerm"
            item-text="title"
            hide-details
            class="pa-0 ma-0"
            clearable
            outlined
            v-on:change="selectCategoryTerm"
            return-object
          ></v-autocomplete>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="description"
            :rules="descriptionRules"
            counter="360"
            outlined
            label="Tell us a bit more about your service"
            hint="Your service information can be updated at any time."
            hide-details="auto"
          ></v-textarea>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="idNumber"
            :rules="idNumberRules"
            append-icon="mdi-beaker-check-outline"
            hint="* Providing a valid ID/TIN number will earn you a star rating."
            persistent-hint
            outlined
            clearable
          >
            <template v-slot:label>
              <div>
                Valid ID or TIN Number <small>(Optional)</small>
            </div>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="webSite"
            :rules="webSiteRules"
            prefix="https://"
            append-icon="mdi-web"
            hide-details
            outlined
            clearable
            @keydown.enter="startSearch"
          >
            <template v-slot:label>
              <div>
                Website <small>(Optional)</small>
            </div>
            </template>
          </v-text-field>
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
          color="green"
          :disabled="!isNextActive"
          :loading="!isNextActive"
          @click="validate"
        >
          Continue
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
      category: null,
      term: null,
      termRules: [
        v => !!v || ''
      ],
      searchTerm: null,
      categoryTerm: null,
      categoryTermRules: [
        v => !!v || ''
      ],
      searchCategoryTerm: null,
      description: '',
      descriptionRules: [
        v => !!v || 'Description cannot be blank.',
        v => !v || v?.length < 360 || 'Description is too long.'
      ],
      idNumber: '',
      idNumberRules: [
        v => !v || v?.length < 32 || 'ID/TIN Number is too long.'
      ],
      webSite: '',
      webSiteRules: [
        v => !v || v?.length < 32 || 'Website is too long.'
      ],
      image: null,
      imageRules: [
        file => !file || file?.size < 5e6 || 'Image size should be less than 5 MB.'
      ],
      isNextActive: true
    }
  },
  computed: {
    ...mapGetters(['terms', 'categoryTerms'])
  },
  mounted () {
    this.$store.dispatch('searchTerms', '')
  },
  watch: {
    searchTerm (val) {
      if (val && val.indexOf('/') > 0) return
      this.$store.dispatch('searchTerms', val)
    },
    async searchCategoryTerm (val) {
      this.$store.dispatch('searchCategoryTerms', {
        category: this.category,
        search: val
      })
    }
  },
  methods: {
    clearCategory () {
      this.category = null
      this.term = null
      this.categoryTerm = null
      this.searchCategoryTerm = null
      this.searchTerm = null

      this.$nextTick(() => {
        this.$refs.term.focus()
        this.$refs.term.isMenuActive = true
      })
    },
    async selectTerm () {
      this.category = this.term.category

      if (this.term.title) {
        await this.$store.dispatch('searchCategoryTerms', {
          category: this.category,
          search: this.term.title
        })

        this.categoryTerm = this.term
        return
      }

      this.$nextTick(() => {
        this.$refs.categoryTerm.focus()
        this.$refs.categoryTerm.isMenuActive = true
      })
      this.$store.dispatch('searchCategoryTerms', {
        category: this.category,
        search: ''
      })
    },
    selectCategoryTerm () {
      this.$refs.categoryTerm.blur()
    },
    text: x => (x.category ? x.category : 'Others') + (x.title ? ' / ' + x.title : ''),
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
            await this.$store.dispatch('createAccount', {
              category: this.category,
              specificCategory: this.categoryTerm.specificCategory,
              title: this.categoryTerm.title,
              description: this.description,
              idNumber: this.idNumber,
              webSite: this.webSite,
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
