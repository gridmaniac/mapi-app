<template>
  <v-container class="mx-auto fill-height" style="max-width:768px">
    <v-row>
      <v-col cols="12">
        <v-toolbar flat>
          <v-toolbar-title>I am a(n) ...</v-toolbar-title>
        </v-toolbar>
        <v-card
          dark
          color="green"
          @click="selectType('IF')"
        >
          <v-img
            :src="require('@/assets/img/freelance-jobs.jpg')"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            class="white--text align-end"
            height="100"
          >
            <v-card-title class="headline">Individual freelancer</v-card-title>
          </v-img>
          <v-card-subtitle>A person who is self-employed and not necessarily committed to a particular employer long-term.</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card
          color="green"
          dark
          @click="selectType('SB')"
        >
          <v-img
            :src="require('@/assets/img/small-business-ideas.jpg')"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            class="white--text align-end"
            height="100"
          >
            <v-card-title class="headline">Small business</v-card-title>
          </v-img>
          <v-card-subtitle>A privately owned corporation, partnership, or sole proprietorship that have fewer employees and/or less annual revenue than a regular-sized business or corporation.</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card
          color="green"
          dark
          @click="selectType('CO')"
        >
          <v-img
            :src="require('@/assets/img/register-company-online.png')"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            class="white--text align-end"
            height="100"
          >
            <v-card-title class="headline">Company</v-card-title>
          </v-img>
          <v-card-subtitle>A legal entity representing an association of people, whether natural, legal or a mixture of both, with a specific objective. Company members share a common purpose and unite to achieve specific, declared goals.</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    selectType (type) {
      this.$store.commit('setType', type)
      this.$router.push('start')
    }
  }
}
</script>
