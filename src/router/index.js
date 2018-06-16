import Vue from 'vue'
import Router from 'vue-router'
import Login from 'pages/login/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: {name: 'login'}
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
