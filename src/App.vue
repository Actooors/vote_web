<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  body {
    background-image: url(/static/images/background_header.png);
    background-size: 100% 100%;
  }

  html, body, #app {
    height: 100%;
  }
</style>
