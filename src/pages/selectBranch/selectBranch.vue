<template>
  <div class="wrapper">
    <Button type="error" style="position: fixed; right:5%; top:5%; font-size: .8rem;" @click="$router.push('/logout')">注销</Button>
    <div class="choice-box">
      <!--TODO:这里改变选择页面-->
      <div class="choice" @click="handleOnClickChoice(0)">
        工会委员计票
      </div>
      <div class="choice" @click="handleOnClickChoice(1)">
        经审委员计票
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "selectBranch",
    methods: {
      handleOnClickChoice(choice) {
        switch (choice) {
          case 0:
            this.$router.push("/vote/party")
            break;
          case 1:
            this.$router.push("/vote/discipline")
            break;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../common/scss/selectBranch';
</style>
