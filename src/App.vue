<template>
  <div id="app">
    <h1 :style="{lineHeight:`${103*heightScale}px`,left:`${150*widthScale}px`}" id="title" v-cloak>{{title}}</h1>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        title: ''
      }
    },
    computed: {
      heightScale() {
        return document.body.clientHeight / 800
      },
      widthScale() {
        return document.body.clientWidth / 1280
      }
    },
    created() {
      this.title = localStorage.getItem('title')
      if (!this.title) {
        this.$axios({
          url: apiPath + '/user/voteName'
        }).then((res) => {
          this.title = res.data.data.voteName
          localStorage.setItem('title', this.title)
        })
      }
    }
  }
</script>

<style>
  body {
    background-image: url(/static/images/background_header.jpg);
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  html, body, #app {
    height: 100%;
  }

  #title {
    position: absolute;
    top: 0;
    color: white;
    font-family: 'HYShangWeiShouShuW';
    font-weight: normal;
    font-size: 30px;
  }

  @media screen and (max-width: 500px) {
    #title {
      font-size: 20px;
    }
  }

  @media screen and (min-width: 1000px) {
    #title {
      font-size: 45px;
    }
  }
</style>
