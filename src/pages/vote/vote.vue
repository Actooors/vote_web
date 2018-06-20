<template>
  <div class="page-wrapper">
    <div class="wrapper">
      <Button type="error" style="position: fixed; right:5%; top:5%; font-size: .8rem;" @click="$router.push('/logout')">注销</Button>
      <!--<div>-->
      <!--<router-link :to="{name:'selectBranch'}">重新选择</router-link>-->
      <!--<router-link :to="{name:'logout'}">注销</router-link>-->
      <!--</div>-->
      <div class="vote-box">
        <h1 class="vote-title">{{this.title}}</h1>
        <div class="switch-box" v-if="admin">
          <label for="switch">按票数排序</label>
          <i-switch v-model="switch1" @on-change="handleOnSwitch" id="switch"></i-switch>
        </div>
        <table cellspacing="0" cellpadding="0">
          <tbody>
          <tr>
            <th>{{switch1?'排序':'编号'}}</th>
            <td v-for="(_,index) in items">{{index+1}}</td>
          </tr>
          <tr class="middle-tr">
            <th>候选人</th>
            <td v-for="item in items" class="middle-td">
              <p>{{item.name[0]}}</p>
              <p>{{item.name[2]?item.name[1]:'　'}}</p>
              <p>{{item.name[2]?item.name[2]:item.name[1]}}</p>
            </td>
          </tr>
          <tr v-if="!admin">
            <th>投票</th>
            <td v-for="(item,index) in items">
              <Checkbox v-model="votes[index]" style="margin: 0;"></Checkbox>
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
          <button @click="handleOnClickSubmit" class="submit">提 交</button>
          <button @click="handleOnClickReset" class="submit">重置</button>
        </div>
      </div>
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
            "name": "张可惜",
            "num": 2
          },
          {
            "name": "李四",
            "num": 1
          },
          {
            "name": "王五",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          },
          {
            "name": "佚名",
            "num": 1
          }
        ],
        votes: [],
        admin: false,
        type: '',
        switch1: false,
        modal: false,
        title: ''
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
        let order = this.switch1 ? '1' : '0'
        this.getIdentity()
        this.type = this.$route.params.type
        if (this.type === 'party') {
          this.title = '中国共产党上海大学第三届党委委员会委员'
        } else {
          this.title = '中国共产党上海大学第三届纪委委员会委员'
        }
        if (this.admin) {
          this.title += '计票结果'
        } else {
          this.title += '候选人'
        }
        let URL = `${apiPath}/vote/${this.type === 'party' ? 'party' : 'group'}Vote`
        axios({
          url: URL,
          method: "POST",
          data: {
            "order": order
          }
        }).then((res) => {
          if (res.data.code === "SUCCESS") {
            this.items = res.data.data
            this.$Message.success("本次计票成功！")
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
          this.$set(this.votes, i, true)
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

<style lang="scss" scoped>
  @import '../../common/scss/vote';
</style>
<style>
  .ivu-modal {
    top: 300px;
  }

  .ivu-modal-content > * {
    border: none;
  }

  .ivu-modal-body, .ivu-modal-header-inner {
    text-align: center;
    font-size: 1rem;
  }
</style>
