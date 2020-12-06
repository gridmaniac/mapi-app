<template>
  <v-container class="mx-auto fill-height" style="max-width:512px">
    <v-btn
      color="secondary"
      dark
      fixed
      left
      top
      fab
      outlined
      @click.stop="back"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-row>
      <v-col cols="12">
        <div v-if="isNew" class="text-h3 mb-1">Welcome</div>
        <div v-if="!isNew" class="text-h4 mb-1">Welcome back</div>
        <div v-if="isNew" class="text-caption mb-12">Please specify your name and phone number to create a new account.
          <a @click.stop="switchAlreadyHave">
              Already have an account?
          </a>
        </div>
        <div v-if="!isNew" class="text-caption mb-12">Please specify phone number to access your account or
          <a @click.stop="switchNewAccount">
              create new account.
          </a>
        </div>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-text-field
            large
            label="Your name"
            placeholder=" "
            outlined
            v-if="isNew"
            v-model="name"
            :rules="isNew ? nameRules : []"
            @keydown.enter.prevent="nameReady"
          ></v-text-field>
          <v-text-field
            ref="phone"
            label="Phone number"
            placeholder=" "
            :prefix="'+ ' + prefix"
            outlined
            pattern="\d*"
            v-model="phone"
            :rules="phoneRules"
            @keydown.enter.prevent="phoneReady"
          ></v-text-field>
          <v-checkbox
            v-if="isNew"
            v-model="checkbox"
            :rules="isNew ? [v => !!v || 'You must agree to continue!'] : []"
            required
          >
            <template v-slot:label>
              <div>
                By clicking continue you agree to our Privacy Policy & Terms and Conditions
              </div>
            </template>
          </v-checkbox>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      valid: true,
      prefix: '',
      checkbox: false,
      name: '',
      nameRules: [
        v => !!v || '',
        v => (v && v.length > 1) || 'Name must be greater than 1 character'
      ],
      phone: '',
      phoneRules: [
        v => !!v || '',
        // v => /^\d{10}$/.test(v) || 'Phone number must be valid',
        // v => (v && v.length > 11) || '',
        v => this.isNew || this.isPhoneExists || 'This phone number is not associated with any account.'
      ],
      rememberPhone: '',
      isNextActive: true
    }
  },
  computed: {
    ...mapGetters(['hasPreviousData', 'isNew', 'isPhoneExists'])
  },
  mounted () {
    if (!this.hasPreviousData) return
    this.name = this.$store.state.user.name
    this.phone = this.$store.state.user.phone
  },
  watch: {
    phone: async function (val) {
      // if (val[0] !== '0') {
      //   val = '0' + val
      // }
      this.phone = val

      // if (this.rememberPhone === this.phone) return
      // if (this.phone.length === 12 && !this.isNew) {
      if (!this.isNew) {
        this.rememberPhone = this.phone
        this.$store.commit('setPhone', this.phone)
        this.$store.commit('setCountryCode', this.prefix)

        await this.$store.dispatch('checkPhoneExists')
        if (!this.isPhoneExists) {
          this.$refs.form.validate()
        }
      } else {
        this.$store.commit('setIsPhoneExists', true)
      }
    }
  },
  methods: {
    validate () {
      this.$refs.form.validate()
      if (!this.valid) return

      this.$store.commit('setName', this.name)
      this.$store.commit('setPhone', this.phone)
      this.$store.commit('setCountryCode', this.prefix)

      this.next()
    },
    nameReady () {
      this.$refs.phone.focus()
    },
    phoneReady () {
      this.$refs.phone.blur()
      this.validate()
    },
    switchAlreadyHave () {
      this.$store.commit('setIsNew', false)
    },
    switchNewAccount () {
      this.$store.commit('setIsNew', true)
    },
    back () {
      this.$store.commit('resetState')
      this.$router.push('/')
    },
    next () {
      if (this.valid) {
        this.isNextActive = false
        this.$router.push('verify')
      }
    }
  }
}
</script>
