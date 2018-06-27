<template>
  <div class="page-wrapper">
    <div class="wrapper" ref="wrapper">
      <Button type="error" style="position: fixed; right:5%; top:5%; font-size: .8rem;"
              @click="$router.push('/logout')">注销
      </Button>
      <!--<div>-->
      <!--<router-link :to="{name:'selectBranch'}">重新选择</router-link>-->
      <!--<router-link :to="{name:'logout'}">注销</router-link>-->
      <!--</div>-->
      <div class="vote-box" ref="votebox">
        <h1 class="vote-title">{{title}}</h1>
        <div class="vote-vice-title">
          <div class="count">
            <div>
              <p>已计{{count}}票</p>
              <p>每张选票至多选{{maxVoteNum}}人，您已选{{voteNum}}人</p>
              <p v-if="admin || votes.length-voteNum>0">本张选票未选姓名及序号：<span v-for="(_,index) in votes"
                                                                          v-if="!votes[index]"
                                                                          :key="_.value" class="count-index-span">{{items[index].name}}({{index+1}})</span>
              </p>
              <p v-else>&nbsp;</p>
            </div>
          </div>
          <div class="switch-box" v-if="admin">
            <label for="switch2">显示百分比</label>
            <i-switch v-model="switchPercentage" @on-change="handleOnSwitch" id="switch2"></i-switch>
            <span>&nbsp;&nbsp;&nbsp;</span>
            <label for="switch1">按票数排序</label>
            <i-switch v-model="switchSort" @on-change="handleOnSwitch" id="switch1"></i-switch>
          </div>
        </div>

        <div class="table-box" ref="tablebox">
          <table cellspacing="0" cellpadding="0" class="vote-table">
            <tr class="headers">
              <th class="blue-right first-row">{{switchSort?'排序':'编号'}}</th>
              <th class="blue-right">候选人</th>
              <th v-if="!admin">{{'投票'}}</th>
              <th v-else>{{switchPercentage?'得票率':'得票数'}}</th>
              <!--<check-icon>投票</check-icon>-->
            </tr>
            <tr v-for="(item,index) in items">
              <td :class="{'blue':true,'blue-right':true,'first-row':true,'deep-background':index%2===0}">{{index+1}}
              </td>
              <td :class="{'blue':true,'name':true,'blue-right':true,'deep-background':index%2===0}">{{item.name}}</td>
              <td :class="{'blue':true,'deep-background':index%2===0}" v-if="!admin">
                <check-icon :value.sync="votes[index]" class="checkicon"></check-icon>
              </td>
              <td :class="{'blue':true,'deep-background':index%2===0}" v-else>
                {{item.num}}
              </td>
            </tr>
          </table>
        </div>

        <div class="submit-box" v-if="!admin">
          <button @click="handleOnClickSubmit" class="submit">提 交</button>
          <button @click="handleOnClickReset" class="submit">重置</button>
        </div>
        <div class="submit-box" v-else>
          <button @click="handleOnClickRefresh" class="submit">刷新</button>
        </div>
      </div>
    </div>

    <Modal
      title="确定投票"
      v-model="modal"
      :mask-closable="false"
      @on-ok="handleOnClickConfirm">
      <p>共{{items.length}}人，您已选{{voteNum}}人。</p>
      <p v-if="votes.length-voteNum>0">本张选票未选序号：<span v-for="(_,index) in votes" v-if="!votes[index]"
                                                      :key="_.value" class="count-index-span">{{items[index].name}}({{index+1}})</span>
      </p>
      <p style="margin-top:.5rem">确定吗？</p>
    </Modal>

    <Spin size="large" fix v-if="spin"></Spin>
  </div>
</template>

<script>
  import axios from 'axios'
  import {CheckIcon} from 'vux'
  // import Scroll from 'components/scroll/scroll'

  export default {
    name: "vote",
    components: {
      CheckIcon,
      // Scroll
    },
    data() {
      return {
        items: [],
        votes: [],
        admin: false,
        type: '',
        switchSort: false,
        switchPercentage: false,
        modal: false,
        title: '',
        count: 0,
        spin: false,
        interval: null,
        percentageStyle: false,
        maxVoteNum: 0
      }
    },
    beforeRouteLeave(from, to, next) {
      console.log("clearInterval", this.interval)
      clearInterval(this.interval)
      next()
    },
    mounted() {
      this.loadData()
      let that = this
      // //管理员界面10秒一刷新
      // if (this.admin) {
      //   this.interval = setInterval(() => {
      //     // that.loadData() //使用这个会莫名其妙一下请求好几次，我猜是axios异步的问题，懒得改了
      //     location.reload()
      //     console.log('interval刷新')
      //   }, 10000)
      // }
      this.justHeight()
      let timer = null
      window.onresize = function () {
        clearTimeout(timer)
        timer = setTimeout(() => {
          that.justHeight()
        }, 50)
      }
    },
    watch: {
      '$route'() {
        this.loadData()
        console.log('路由改变刷新')
      }
    },
    methods: {
      getIdentity() {
        this.admin = localStorage.getItem('identity') === '2'
      },
      initCount() {
        if (!this.admin) {
          //管理员
          axios({
            url: `${apiPath}/user/${this.type === 'party' ? 'party' : 'group'}VoteNum`,
            method: 'post'
          }).then((res) => {
            if (res.data.code === 'SUCCESS') {
              this.count = res.data.data.countNum
            } else {
              this.count = 0
              console.error("请求计票结果出错")
            }
          }).catch((err) => {
            this.count = 0
            console.error("请求计票结果出错")
          })
        } else {
          //计票员（写两遍我也很无奈啊
          axios({
            url: `${apiPath}/vote/${this.type === 'party' ? 'party' : 'group'}AllvoteNum`,
            method: 'get'
          }).then((res) => {
            if (res.data.code === 'SUCCESS') {
              this.count = res.data.data
            } else {
              this.count = 0
              console.error("请求计票结果出错")
            }
          }).catch((err) => {
            this.count = 0
            console.error("请求计票结果出错")
          })
        }

        // let cnt = parseInt(localStorage.getItem(`${this.type === 'party' ? 'party' : 'group'}_count`))
        // this.count = cnt ? cnt : 0
      },
      loadData() {
        let that = this

        // 用percentageStyle延时class的添加（在response后才改变class），以防止style突变的丑陋
        function gotData() {
          that.percentageStyle = that.switchPercentage
        }

        this.switchPercentage = localStorage.getItem('switch_percentage') === '1'
        this.switchSort = localStorage.getItem('switch_sort') === '1'
        let order = this.switchSort ? '1' : '0'
        this.type = this.$route.params.type
        this.getIdentity()

        this.initCount()
        if (this.type === 'party') {
          this.title = '中国共产党上海大学第三届党委委员会委员'
          this.maxVoteNum = localStorage.getItem('partyMaxVoteNum')
        } else {
          this.title = '中国共产党上海大学第三届纪委委员会委员'
          this.maxVoteNum = localStorage.getItem('groupMaxVoteNum')
        }
        if (this.admin) {
          this.title += '计票结果'
        } else {
          this.title += '候选人'
        }
        let URL = ''
        if (this.switchPercentage) {
          URL = `${apiPath}/vote/${this.type === 'party' ? 'party' : 'group'}Percentage`
        } else {
          URL = `${apiPath}/vote/${this.type === 'party' ? 'party' : 'group'}Vote`
        }
        this.spin = true
        axios({
          url: URL,
          method: "POST",
          data: {
            "order": order
          }
        }).then((res) => {
          this.spin = false
          if (res.data.code === "SUCCESS") {
            this.items = res.data.data
          } else {
            this.$Notice.warning({title: `出错，提示：${res.data.message}`})
          }
          this.votes = new Array(this.items.length)
          this.handleOnClickReset()
          gotData()
        }).catch((err) => {
          this.spin = false
          this.$Notice.warning({title: `出错，提示：${err}`})
          this.votes = new Array(this.items.length)
          this.handleOnClickReset()
          gotData()
        })
      },
      handleOnSwitch() {
        localStorage.setItem('switch_percentage', this.switchPercentage ? '1' : '0')
        localStorage.setItem('switch_sort', this.switchSort ? '1' : '0')
        this.loadData()
      },
      handleOnClickSubmit() {
        if (this.voteNum > this.maxVoteNum) {
          this.$Notice.warning({title: "每张选票至多选" + this.maxVoteNum + "人！"})
          return
        }
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
            "name": encodeURI(this.items[i].name)
          }
          votesObjArray.push(obj)
        }
        this.spin = true
        axios({
          url: url,
          method: "post",
          data: {
            "data": votesObjArray
          }
        }).then((res) => {
          this.spin = false
          if (res.data.code === "SUCCESS") {
            // localStorage.setItem(`${this.type === 'party' ? 'party' : 'group'}_count`, (this.count + 1).toString())
            this.count++;
            this.loadData()
            this.$Notice.success({title: "本次计票成功！"})
          } else {
            this.$Notice.warning({title: `出错，提示：${res.data.message}`})
          }
          this.votes = new Array(this.items.length)
          this.handleOnClickReset()
        }).catch((err) => {
          this.spin = false
          this.$Notice.warning({title: `出错，提示：${err}`})
          this.votes = new Array(this.items.length)
          this.handleOnClickReset()
        })
      },
      handleOnClickRefresh() {
        this.loadData()
      },
      justHeight() {
        // console.log(this.$refs.votebox)
        let headbarHeight = 130 / 1024 * innerHeight
        // let voteboxHeight = window.innerHeight - headbarHeight
        this.$refs.votebox.style.top = `${headbarHeight}px`
        // this.$refs.votebox.style.height = `${voteboxHeight}px`
        // let tableboxHeight = voteboxHeight - 300
        // this.$refs.tablebox.style.height = `${tableboxHeight}px`
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
  /*html {*/
  /*overflow: hidden;*/
  /*}*/

  .ivu-modal {
    top: 300px !important;
  }

  .ivu-modal-content > * {
    border: none !important;
  }

  .ivu-modal-body, .ivu-modal-header-inner {
    text-align: center !important;
    font-size: 1rem !important;
  }

  .ivu-checkbox-inner {
    transition: all 0.05s linear !important;
  }

  .ivu-spin-fix {
    background: rgba(255, 255, 255, 0.5) !important;;
  }

  .checkicon .weui-icon {
    font-size: 30px !important;
  }
</style>
