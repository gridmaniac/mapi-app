import axios from 'axios'

export default {
  actions: {
    async searchTerms ({ commit }, search) {
      const { data } = await axios.get('/api/terms', {
        params: { search }
      })
      commit('updateTerms', data)
    },
    async searchCategoryTerms ({ commit }, { category, search }) {
      const { data } = await axios.get(`/api/terms/${category}`, {
        params: { search }
      })
      commit('updateCategoryTerms', data)
    }
  },
  mutations: {
    updateTerms (state, terms) {
      state.terms = terms
    },
    updateCategoryTerms (state, categoryTerms) {
      state.categoryTerms = categoryTerms
    }
  },
  state: {
    terms: [],
    categoryTerms: []
  },
  getters: {
    terms: state => state.terms,
    categoryTerms: state => state.categoryTerms
  }
}
