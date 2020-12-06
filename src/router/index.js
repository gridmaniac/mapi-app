import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import MainLayout from '../views/MainLayout.vue'
import CoverLayout from '../views/CoverLayout.vue'
import BlankLayout from '../views/BlankLayout.vue'
import BlankLayoutHelp from '../views/BlankLayoutHelp.vue'
import Search from '../views/Search.vue'
import Service from '../views/Service.vue'
import Favorites from '../views/Favorites.vue'
import Home from '../views/Home.vue'
import SelectType from '../views/SelectType.vue'
import Start from '../views/Start.vue'
import Verify from '../views/Verify.vue'
import Complete from '../views/Complete.vue'
import SpecifyArea from '../views/SpecifyArea.vue'
import LegalPrivacy from '../views/LegalPrivacy.vue'
import Edit from '../views/Edit.vue'
import EditSimple from '../views/EditSimple.vue'
import SwitchToService from '../views/SwitchToService.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/search',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [{
      path: '/',
      name: 'Search',
      component: Search
    }, {
      path: '/favorites',
      name: 'Favorites',
      component: Favorites
    }, {
      path: '/legal',
      name: 'Legal & Privacy',
      component: LegalPrivacy
    }, {
      path: '/edit',
      name: 'Edit profile',
      component: Edit,
      meta: {
        requiresAuth: true,
        requiresProfile: true
      }
    }, {
      path: '/edit-s',
      name: 'Edit user profile',
      component: EditSimple,
      meta: {
        requiresAuth: true,
        requiresProfile: true
      }
    }, {
      path: '/switch',
      name: 'Switch to service account',
      component: SwitchToService,
      meta: {
        requiresAuth: true,
        requiresProfile: true,
        requiresNoService: true
      }
    }]
  },
  {
    path: '/service/:id',
    component: CoverLayout,
    children: [{
      path: '/',
      name: 'Service',
      component: Service
    }]
  },
  {
    path: '/',
    component: BlankLayoutHelp,
    meta: {
      requiresNoAuth: true
    },
    children: [{
      path: '/',
      name: 'Home',
      component: Home
    }, {
      path: '/start',
      name: 'Start',
      component: Start
    }, {
      path: '/complete',
      name: 'Complete',
      component: Complete,
      meta: {
        requiresUserData: true,
        requiresNoAuth: true
      }
    }]
  },
  {
    path: '/',
    component: BlankLayout,
    children: [{
      path: '/type',
      name: 'Type',
      component: SelectType
    }, {
      path: '/verify',
      name: 'Verify',
      component: Verify,
      meta: {
        requiresUserData: true,
        requiresNoAuth: true
      }
    }, {
      path: '/area',
      name: 'Specify area',
      component: SpecifyArea,
      meta: {
        requiresAuth: true
      }
    }]
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let redirect = null
  if (to.matched.some(x => x.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) redirect = '/'
  }

  if (to.matched.some(x => x.meta.requiresNoAuth)) {
    if (store.getters.isLoggedIn) redirect = '/search'
  }

  if (to.matched.some(x => x.meta.requiresUserData)) {
    if (!store.getters.hasPreviousData) redirect = '/'
  }

  if (to.matched.some(x => x.meta.requiresProfile)) {
    if (!store.getters.profile) redirect = '/search'
  }

  if (to.matched.some(x => x.meta.requiresNoService)) {
    if (store.getters.isService) redirect = '/search'
  }

  if (redirect) return next(redirect)
  next()
})

export default router
