import axios from 'axios'

const getDefaultState = () => {
  return {
    type: '',
    isService: false,
    isNew: true,
    name: null,
    phone: null,
    codeId: null,
    countryCode: null,
    title: null,
    category: null,
    specificCategory: null,
    token: localStorage.getItem('token') || '',
    profile: null,
    isPhoneExists: true,
    selectedArea: null
  }
}

export default {
  actions: {
    async checkPhoneExists ({ commit, state }) {
      const { data } = await axios.post('/api/check', {
        phone: state.phone
      })

      const { err, exists } = data
      if (err) throw err
      commit('setIsPhoneExists', exists)
    },
    async checkPhone ({ commit, state }) {
      const { data } = await axios.post('/api/check', {
        phone: state.phone
      })

      const { err, exists } = data
      if (err) throw err
      commit('setIsNew', !exists)
    },
    async sendCode ({ commit, state }) {
      const { data } = await axios.post('/api/send-code', {
        phone: state.phone
      })

      if (data.err) throw data.err
      commit('setCodeId', data.id)
    },
    async verifyCode ({ state, commit }, code) {
      const { data } = await axios.post('/api/verify', {
        phone: state.phone,
        code,
        id: state.codeId
      })

      const { err, token } = data
      if (err) throw new Error(err)

      if (state.isNew) return
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = token
      commit('setToken', token)
    },
    async createAccount ({ commit, state }, payload) {
      const { data } = await axios.post('/api/register', {
        type: state.type,
        isService: state.isService,
        name: state.name,
        location: {
          type: 'Point',
          coordinates: [0, 0]
        },
        phone: state.phone,
        ...payload
      })

      const { token, err } = data
      if (err) throw new Error(err)

      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = token
      commit('setToken', token)
    },
    async updateProfile ({ commit, dispatch }, payload) {
      const { data } = await axios.post('/api/update', {
        ...payload
      })

      const { err } = data
      if (err) throw new Error(err)

      commit('updateProfile', null)
      dispatch('getProfile')
    },
    async convertToService ({ commit, dispatch }, payload) {
      const { data } = await axios.post('/api/convert', {
        ...payload
      })

      const { err } = data
      if (err) throw new Error(err)

      commit('updateProfile', null)
      dispatch('getProfile')
    },
    async logout ({ commit }) {
      commit('resetState')
    },
    async getProfile ({ commit, state }) {
      // if (state.profile) return

      const { data } = await axios.get('/api/profile')
      const { profile, err } = data
      if (err) throw new Error(err)
      commit('updateProfile', profile)
    },
    async deleteAccount ({ commit }) {
      const { data } = await axios.post('/api/delete')
      if (data.err) throw new Error(data.err)
      commit('resetState')
    }
  },
  mutations: {
    resetState (state) {
      localStorage.removeItem('token')
      Object.assign(state, getDefaultState())
    },
    setType (state, type) {
      state.isService = true
      state.isNew = true
      state.type = type
    },
    setName (state, name) {
      state.name = name
    },
    setPhone (state, phone) {
      state.phone = phone
    },
    clearPhone (state) {
      state.phone = ''
    },
    clearName (state) {
      state.name = ''
    },
    setCountryCode (state, code) {
      state.countryCode = code
    },
    setCodeId (state, id) {
      state.codeId = id
    },
    updateProfile (state, profile) {
      state.profile = profile
    },
    clearProfile (state) {
      state.profile = null
    },
    setToken (state, token) {
      state.token = token
    },
    clearToken (state) {
      state.token = null
    },
    setIsNew (state, isNew) {
      state.isNew = isNew
    },
    setIsPhoneExists (state, isPhoneExists) {
      state.isPhoneExists = isPhoneExists
    },
    updateSelectedArea (state, selectedArea) {
      state.selectedArea = selectedArea
    }
  },
  state: getDefaultState(),
  getters: {
    isLoggedIn: state => !!state.token,
    isNew: state => state.isNew,
    isService: state => state.isService || state.profile?.isService,
    isPhoneExists: state => state.isPhoneExists,
    hasPreviousData: state => !!(state.name || state.phone),
    name: state => state.profile ? state.profile.name : '',
    area: state => state.selectedArea || (state.profile ? state.profile.area : null),
    image: state => state.profile ? 'http://192.168.64.142:3010/images/' + state.profile.image : '',
    id: state => state.profile.id,
    profile: state => state.profile
  }
}
