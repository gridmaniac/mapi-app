<template>
  <v-container class="mx-auto fill-height" style="max-width:512px">
    <v-row align="center" justify="center">
      <v-snackbar
        :timeout="3000"
        v-model="snackbar"
        color="error"
        absolute
        top
      >
        {{ this.verifyMessage }}
      </v-snackbar>
      <v-col cols="12">
        <div class="text-overline mb-3 text-center">Enter the code from SMS</div>
        <!-- <CodeInput :loading="false" class="input" v-on:change="onChange" v-on:complete="onComplete" /> -->
        <v-row justify="center">
          <v-col cols="5">
            <v-text-field
              ref="code"
              label="Code"
              class="centered-input"
              placeholder=" "
              solo
              rounded
              autofocus
              filled
              type="number"
              pattern="\d*"
              v-model="code"
              background-color="white"
              v-on:input="codeReady"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row justify="center" align="center" class="flex-column">
          <div class="text-caption mb-3 text-center">Didn't receive the code?</div>
          <v-btn
            small
            outlined
            :disabled="disabled"
            color="green"
            @click="sendCodeAgain"
          >
            Send code again {{againText}}
          </v-btn>
          <v-btn
            small
            text
            color="primary"
            class="mt-2"
            @click="changePhone"
          >
            Change phone number
          </v-btn>
        </v-row>
        <!-- <v-footer
          fixed
          class="pa-0"
        >
          <v-btn
            block
            tile
            dark
            large
            color="green"
            @click="validate"
          >
            Continue
          </v-btn>
        </v-footer> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      code: '',
      seconds: 0,
      interval: null,
      snackbar: false,
      verifyMessage: ''
    }
  },
  computed: {
    disabled () {
      return this.seconds > 0
    },
    againText () {
      return this.seconds > 0 ? ` in ${this.seconds} seconds` : ''
    },
    ...mapGetters(['isService', 'isNew'])
  },
  methods: {
    validate () {
      this.$refs.form.validate()
      this.next()
    },
    async sendCodeAgain () {
      if (this.seconds > 0) return
      this.resetTimer()

      try {
        await this.$store.dispatch('sendCode')
      } catch (e) {
        console.log(e)
      }
    },
    changePhone () {
      this.$store.commit('clearPhone')
      this.$router.push('start')
    },
    codeReady () {
      if (this.code.length < 6) {
        return
      }
      this.$refs.code.blur()
      this.next()
    },
    back () {
      this.$router.push('/')
    },
    async next () {
      try {
        await this.$store.dispatch('verifyCode', this.code)
        if (!this.isNew) {
          return this.$router.push('search')
        }

        if (this.isService) {
          return this.$router.push('complete')
        }

        await this.$store.dispatch('createAccount', {})
        this.$router.push('search')
      } catch (e) {
        this.code = ''
        this.verifyMessage = e.message
        this.snackbar = true
      }
    },
    resetTimer () {
      this.seconds = 90
    }
  },
  async mounted () {
    if (this.$vuetify.breakpoint.name === 'xs') {
      this.$vuetify.goTo(150)
    }
    this.resetTimer()

    this.interval = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--
      }
    }, 1000)

    try {
      if (this.isNew) {
        await this.$store.dispatch('checkPhone')
      }

      await this.$store.dispatch('sendCode')
    } catch (e) {
      console.log(e)
    }
  },
  destroyed () {
    clearInterval(this.interval)
  }
}
</script>

<style scoped>
  .centered-input >>> input {
    text-align: center;
    font-size: 24px;
  }
  .centered-input {
    transform: scale(1.3);
  }
</style>
