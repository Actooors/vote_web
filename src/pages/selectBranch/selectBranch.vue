<template>
  <div class="wrapper">
    <Button type="error" style="position: fixed; right:5%; top:5%; font-size: .8rem;" @click="$router.push('/logout')">
      注销
    </Button>
    <div class="choice-box">
      <div
        class="choice"
        v-for="(name, index) of selectionName"
        @click="handleOnClickChoice(index)"
        :key="name"
      >
        {{name}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'selectBranch',
    data() {
      return {
        selectionName: []
      }
    },
    methods: {
      handleOnClickChoice(choice) {
        switch (choice) {
          case 0:
            this.$router.push('/vote/party')
            break
          case 1:
            this.$router.push('/vote/discipline')
            break
        }
      }
    },
    mounted() {
      this.$axios({
        url: apiPath + '/user/menu'
      }).then((res) => {
        this.selectionName = [res.data.data.name1, res.data.data.name2]
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../common/scss/selectBranch';
</style>
