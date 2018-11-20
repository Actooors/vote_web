import Vue from 'vue'
import Router from 'vue-router'
import Login from 'pages/login/login'
import SelectBranch from 'pages/selectBranch/selectBranch'
import Vote from 'pages/vote/vote'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: {name: 'login'}
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }, {
      path: '/logout',
      name: 'logout',
      beforeEnter(to, from, next) {
        localStorage.clear()
        next({name: 'login'})
      }
    }, {
      path: '/selectBranch',
      name: 'selectBranch',
      component: SelectBranch,
      meta: {
        requiresAuth: ['1', '2']
      }
    }, {
      path: '/vote/:type',
      name: 'vote',
      component: Vote,
      meta: {
        requiresAuth: ['1', '2']
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(to)

  let bypassAuthWhileDev = true        //绕过登录设为true，否则为false
  if (!(bypassAuthWhileDev && process.env.NODE_ENV === 'development')) {
    //验证是否需要登录
    let token = window.localStorage.getItem('token')
    let userIdentity = window.localStorage.getItem('identity')
    var requiresAuth = undefined
    let needAuth = to.matched.some(record => {
      if (record.meta.hasOwnProperty('requiresAuth') && record.meta.requiresAuth) {
        requiresAuth = record.meta.requiresAuth
        return true
      }
    })

    if (process.env.NODE_ENV === 'development') {
      console.log('token:', token, '\n', '\n',
        'requiresAuth:', requiresAuth)
    }
    //如果token不存在、页面需要验证
    if (!token && needAuth) {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
      return
    } else if (token && needAuth) {
      //有token，需要验证
      if (!requiresAuth.some(records => userIdentity === records)) {
        //当前身份无权访问该页面，回到选择页面
        next({name: 'selectBranch'})
        return
      }
    }
  }

  //匹配并修改单个页面标题，若没有设置页面标题则设为父组件标题，若标题树为空，则置为defaultTitle
  const defaultTitle = "中国共产党上海大学第三次代表大会计票系统"
  let len = to.matched.length
  for (var i = len - 1; i >= 0 && !to.matched[i].meta.title; i--) ;
  if (i >= 0) {
    document.title = to.matched[i].meta.title
  } else {
    document.title = defaultTitle
  }
  next()
})

export default router
