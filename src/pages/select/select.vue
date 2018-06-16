<template>
  <div class="wrapper">
    <div class="choice left" @click="handleOnClickChoice(0)">
      党代表
    </div>
    <div class="choice right" @click="handleOnClickChoice(1)">
      团代表
    </div>
  </div>
</template>

<script>
  export default {
    name: "select",
    methods: {
      handleOnClickChoice(choice) {
        switch (choice) {
          case 0:
            this.$router.push("/vote/party")
            break;
          case 1:
            this.$router.push("/vote/group")
            break;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .choice {
    height: 200px;
    width: 200px;
    background: beige;
    margin: 1rem;
    &:hover {
      cursor: pointer;
    }
  }

  .wrapper {
    display: flex;
  }
</style>
