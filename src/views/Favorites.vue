<template>
  <v-container class="mx-auto pa-sm-3 pa-0" style="max-width:1280px">
    <v-toolbar
      flat
    >
      <!-- <v-app-bar-nav-icon>
        <v-icon color="pink">mdi-star</v-icon>
      </v-app-bar-nav-icon> -->
      <v-toolbar-title>Favorites</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-subheader>Sort by:</v-subheader>
      <v-chip-group
        mandatory
        active-class="primary--text"
      >
        <v-chip v-for="tag in tags" :key="tag">
          {{ tag }}
        </v-chip>
      </v-chip-group> -->
    </v-toolbar>
    <v-list three-line>
      <v-list-item
        v-for="item in favorites"
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
              hover
              size="18"
            ></v-rating>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <!-- <v-list-item-action-text>{{item.distance.toFixed(0) * 0.001}} km from you</v-list-item-action-text> -->
          <!-- <v-btn icon color="indigo">
            <v-icon>mdi-star</v-icon>
          </v-btn> -->
          <!-- <v-btn icon color="grey lighten-1">
            <v-icon>mdi-star-outline</v-icon>
          </v-btn> -->
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['favorites'])
  },
  data () {
    return {
      types: ['An individual freelancer', 'Small business', 'Company'],
      rating: 4.3,
      items: ['Odumasi', 'Asawasi', 'Zongo', 'Aboabo', 'Dichemso', 'Dichemso', 'Dichemso', 'Dichemso'],
      tags: ['Rating', 'Distance']
    }
  },
  mounted () {
    this.$store.dispatch('getFavorites')
  },
  methods: {
  }
}
</script>
