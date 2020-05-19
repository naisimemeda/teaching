<template>
  <div class="teacher__card">
    <div class="avatar"> <img :src="teacher.avatar_url" class="avatar" >  </div>
    <div class="info">
      {{ teacher.name }}
      <div>{{ teacher.email }}</div>
    </div>
    <!-- <div>2020-05-15 24:00:00</div> -->
    <div class="controller" v-if="viewer">
      <span :class="{ star }" @click.stop="handleStar">
        {{ star ? '取消关注' : '关注' }}
      </span>
    </div>
  </div>
</template>

<script>
  import { followers, cancelFollowers  } from '@/api/student';
  import _ from "lodash";
  export default {
    props: {
      viewer: {
        type: Boolean,
        default: true
      },
      star: {
        type: Boolean,
        require: true
      },
      teacher: {
        type: Object,
        require: true
      }
    },
    name: "StudentCard",
    data() {
      return {};
    },
    methods: {
      async handleStar() {
        try {
          this.star === true ? await cancelFollowers(this.teacher.id) : await followers(this.teacher.id)
          this.$emit('update:star', !this.star)
        } catch (e) {
          this.$Message.error(_.get(e, "response.data.message", "操作失败"));
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  @import '../assets/style/color.less';

  .teacher__card {
    width: calc(50% - 10px);
    min-height: 54px;
    box-sizing: border-box;
    padding: 14px 18px;
    border-radius: 4px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 10px 21px rgba(0, 0, 0, 0.1);
    display: -webkit-flex;
    align-items: center;
    user-select: none;
    .avatar {
      width: 55px;
      height: 55px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.1);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
    .info {
      flex: 1;
      box-sizing: border-box;
      padding: 0 14px;
      font-weight: bold;
      > div {
        font-weight: normal;
        font-size: 15px;
        color: rgba(0, 0, 0, 0.5);
      }
    }
    .controller {
      color: @themeColor;
      user-select: none;
      cursor: pointer;
      span {
        transition: all .4s;
      }
      span.star {
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
</style>
