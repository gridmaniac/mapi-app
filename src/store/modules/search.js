import axios from 'axios'

export default {
  actions: {
    async search ({ commit }, query) {
      const { data } = await axios.post('/api/search', query)
      commit('setResults', data)
    }
  },
  mutations: {
    setResults (state, data) {
      state.results = data
    }
  },
  state: {
    results: []
  },
  getters: {
    results: state => state.results
  }
}
