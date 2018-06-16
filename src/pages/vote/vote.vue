<template>
  <div>
    <div>
      <router-link :to="{name:'select'}">重新选择</router-link>
      <router-link :to="{name:'logout'}">注销</router-link>
    </div>
    <div class="switch-box" v-if="admin">
      <label for="switch">按票数排序</label>
      <i-switch v-model="switch1" @on-change="handleOnSwitch" id="switch"></i-switch>
    </div>
    <table>
      <tbody>
      <tr>
        <th>序号</th>
        <td v-for="(_,index) in items">{{index}}</td>
      </tr>
      <tr>
        <th>姓名</th>
        <td v-for="item in items">{{item.name}}</td>
      </tr>
      <tr v-if="!admin">
        <th>投票</th>
        <td v-for="(item,index) in items">
          <input type="checkbox" v-model="votes[index]">
        </td>
      </tr>
      <tr v-else>
        <th>票数</th>
        <td v-for="(item,index) in items">
          {{item.num}}
        </td>
      </tr>
      </tbody>
    </table>
    <div class="submit-box" v-if="!admin">
      <button @click="handleOnClickSubmit">提交</button>
      <button @click="handleOnClickReset">重置</button>
    </div>

    <Modal
      title="确定投票"
      v-model="modal"
      :mask-closable="false"
      @on-ok="handleOnClickConfirm">
      <p>共{{items.length}}人，您已选{{voteNum}}人，确定吗？</p>
    </Modal>

  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "vote",
    data() {
      return {
        items: [
          {
            "name": "1",
            "num": 2
          },
          {
            "name": "10",
            "num": 1
          },
          {
            "name": "王五",
            "num": 1
          },
          {
            "name": "12",
            "num": 1
          }
        ],
        votes: [],
        admin: false,
        type: '',
        switch1: false,
        modal: false
      }
    },
    created() {
      this.loadData()
    },
    watch: {
      '$route'() {
        this.loadData()
      }
    },
    methods: {
      getIdentity() {
        this.admin = localStorage.getItem('identity') === '2'
      },
      loadData() {
        let order = this.status ? '1' : '0'
        this.getIdentity()
        this.type = this.$route.params.type
        let url = `${apiPath}/vote/${this.type === 'party' ? 'party' : 'group'}Vote`
        axios({
          url: url,
          method: "post",
          data: {
            "order": order
          }
        }).then((res) => {
          if (res.data.code === "SUCCESS") {
            this.items = res.data.data
          } else {
            this.$Message.warning(`出错，提示：${res.data.message}`)
          }
          this.votes = new Array(this.items.length)
          this.handleOnClickReset()
        }).catch((err) => {
          this.$Message.warning(`出错，提示：${err}`)
          this.votes = new Array(this.items.length)
          this.handleOnClickReset()
        })
      },
      handleOnSwitch() {
        this.loadData()
      },
      handleOnClickSubmit() {
        this.modal = true
      },
      handleOnClickReset() {
        for (let i = 0; i < this.votes.length; i++) {
          this.votes[i] = true
        }
      },
      handleOnClickConfirm() {
        //请求投票接口
        let url = `${apiPath}/vote/${this.type === 'party' ? 'party' : 'group'}PullVote`
        let votesObjArray = []
        /*
        {
          "data":[{
                    "voted":"true",
                    "name":"金东寒"
                 }, {
                    "voted":"false",
                    "name":"殷子良"
                 }]
        }
        */
        for (let i = 0; i < this.items.length; i++) {
          let obj = {
            "voted": this.votes[i],
            "name": this.items[i].name
          }
          votesObjArray.push(obj)
        }
        axios({
          url: url,
          method: "post",
          data: {
            "data": votesObjArray
          }
        }).then((res) => {
          if (res.data.code === "SUCCESS") {
            this.loadData()
          } else {
            this.$Message.warning(`出错，提示：${res.data.message}`)
          }
          this.votes = new Array(this.items.length)
          this.handleOnClickReset()
        }).catch((err) => {
          this.$Message.warning(`出错，提示：${err}`)
          this.votes = new Array(this.items.length)
          this.handleOnClickReset()
        })
      }
    },
    computed: {
      voteNum() {
        let num = 0;
        for (let i = 0; i < this.votes.length; i++) {
          if (this.votes[i])
            num++;
        }
        return num;
      }
    }
  }
</script>

<style scoped>

</style>
