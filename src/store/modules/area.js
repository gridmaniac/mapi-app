import axios from 'axios'

export default {
  actions: {
    async searchAreas ({ commit }, search) {
      const { data } = await axios.get('/api/areas', {
        params: { search }
      })
      commit('updateAreas', data)
    },
    async setAreaByLocation ({ commit }, location) {
      const { data } = await axios.put('/api/areas/loc', {
        location
      })

      commit('updateSelectedArea', data)

      const { err } = data
      if (err) throw err
    },
    async getAreaByLocation ({ commit }, location) {
      const { data } = await axios.post('/api/areas/loc', {
        location
      })

      commit('updateSelectedArea', data)

      const { err } = data
      if (err) throw err
    },
    async setArea ({ commit }, area) {
      const { data } = await axios.put('/api/areas', {
        area
      })

      commit('updateSelectedArea', area)

      const { err } = data
      if (err) throw err
    }
  },
  mutations: {
    updateAreas (state, areas) {
      state.areas = areas
    }
  },
  state: {
    areas: []
  },
  getters: {
    areas: state => state.areas
  }
}
