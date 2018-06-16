<template>
  <div>
    <div class="login-box">
      <div class="row">
        <label for="username">工号</label>
        <input type="text" id="username" v-model="loginForm.username">
      </div>
      <div class="row">
        <label for="password">密码</label>
        <input type="text" id="password" v-model="loginForm.password">
      </div>
      <input type="submit" value="登录" @click="handleOnClickLogin">
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'login',
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      handleOnClickLogin() {
        axios({
          url: `${apiPath}/login`,
          method: 'post',
          data: {
            uid: this.loginForm.username,
            password: this.loginForm.password
          }
        }).then((res) => {
          if (res.data.code === "SUCCESS") {
            localStorage.setItem('token', res.data.data.token)
            localStorage.setItem('identity', res.data.data.identity)
            //是否有重定向参数
            if (this.$route.query.hasOwnProperty('redirect'))
              this.$router.push({path: this.$route.query.redirect})
            else
              this.$router.push({name: "select"})
          } else {
            this.$Message.warning("请检查工号或密码是否正确")
          }
        }).catch((err) => {
          this.$Message.warning(`发生错误：${err}`)
        })
      }
    }
  }
</script>
