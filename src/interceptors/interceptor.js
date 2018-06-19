import axios from 'axios'

axios.interceptors.request.use((config) => {
  let token = window.localStorage.getItem("token")
  if (token)
    config.headers.Authorization = token
  return config
}, (error) => {
  return Promise.reject(error)
})


axios.interceptors.response.use((res) => {
  switch (config.status) {
    case 401:
      localStorage.clear()
      location.path = '/login'
      res.headers.redirect = "/login"
      break;
  }
  return res
}, (error) => {
  return Promise.reject(error)
})
