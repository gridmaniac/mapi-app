<template>
  <div class="google-map" :id="name"></div>
</template>

<script>
const google = window.google

export default {
  name: 'google-map',
  props: ['name'],
  data: function () {
    return {
      map: ''
    }
  },
  mounted: function () {
    this.map = new google.maps.Map(document.getElementById(this.name), {
      center: { lat: 6.69, lng: -1.62 },
      zoom: 14
    })
  },
  methods: {
  }
}
</script>

<style scoped>
  .google-map {
      width: 100%;
      height: 480px;
  }
</style>
