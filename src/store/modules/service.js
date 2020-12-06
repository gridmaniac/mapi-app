import axios from 'axios'

export default {
  actions: {
    async getServiceById ({ commit }, id) {
      const { data } = await axios.get(`/api/service/${id}`)
      commit('setService', data)
    },
    async getFavorites ({ commit }) {
      const { data } = await axios.get('/api/favorites')
      commit('setFavorites', data)
    },
    async addToFavorites ({ dispatch, state }, id) {
      await axios.post('/api/favorites', {
        id
      })
      dispatch('getServiceById', state.service._id)
    },
    async removeFromFavorites ({ dispatch, state }, id) {
      await axios.delete('/api/favorites', {
        id
      })
      dispatch('getServiceById', state.service._id)
    },
    async rateService ({ state, dispatch }, rating) {
      await axios.post('/api/rate', {
        id: state.service._id, value: rating
      })
      dispatch('getServiceById', state.service._id)
    }
  },
  mutations: {
    setService (state, data) {
      state.service = data.service
      state.favorite = data.favorite
      state.rating = data.rating
      state.isMe = data.isMe
      state.ratingsCount = data.ratingsCount
    },
    setFavorites (state, data) {
      state.favorites = data
    }
  },
  state: {
    service: null,
    favorite: null,
    rating: null,
    ratingsCount: 0,
    isMe: null,
    favorites: []
  },
  getters: {
    service: state => state.service ? state.service : {},
    poster: state => state.service ? 'http://192.168.64.142:3010/images/' + state.service.image : '',
    title: state => state.service ? state.service.title : '',
    description: state => state.service ? state.service.description : '',
    webSite: state => state.service ? state.service.webSite : '',
    phone: state => state.service ? '+ 233 ' + state.service.phone.toString().substr(3) : '',
    coordinates: state => state.service && state.service.location ? state.service.location.coordinates : [0, 0],
    rating: state => state.service ? state.service.rating : 0,
    favorite: state => state.favorite,
    isMe: state => state.isMe,
    exRating: state => state.rating,
    ratingsCount: state => state.ratingsCount,
    favorites: state => state.favorites
  }
}
