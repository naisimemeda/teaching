<template>
  <div class="container">
    <div class="provider__title">Choose Provider</div>
    <div class="provider__box">
      <div>
        <span>Student</span>
        <div class="into" @click="handleChooseProvider('student', student.id)" v-for="(student, index) in students" :key="index">
          <student-card :student="student" />
        </div>
      </div>
      <div>
        <span>Teacher</span>
        <div class="into" @click="handleChooseProvider('teacher', teacher.id)" v-if="teacher.id">
          <teacher-card :viewer="false" :teacher="teacher"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { StudentCard, TeacherCard } from "@/components";
import _ from "lodash";
import {accounts, lineAuth} from "../../api/auth";
import store from "@/store";

export default {
  name: "Provider",
  components: { StudentCard, TeacherCard },
  data() {
    return {
      students: [],
      teacher: {
        id: null
      },
      oauth_key: ''
    };
  },
  watch: {
    key: {
      immediate: true,
      handler() {
        this.getLineLogin()
      }
    }
  },
  computed: {
    key() {
      return this.$route.query.key
    },
  },
  methods: {
    async handleChooseProvider(provider, id) {
      try {
        const { access_token, token_type } = await lineAuth({id: id, provider: provider, oauth_key: this.oauth_key})
        store.commit('SET_TOKEN_AND_PROVIDER', {
          token: `${token_type} ${access_token}`,
          provider
        })
        this.$router.push({ name: 'home' })
      } catch (e) {
        this.$router.push({ name: 'login' })
        this.$Message.error(_.get(e, 'response.data.message', '登陆失败'))
      }

    },
    async getLineLogin() {
        try {
          const { data }  = await accounts({key: this.key})
          this.students = data.account.student
          this.teacher = data.account.teacher
          if(this.students.length === 0 && this.teacher.id === null) {
            this.$Message.error('该 line 还未未绑定账号 请先绑定')
          }

            this.oauth_key = data.oauth_key
        } catch (e) {
          this.$router.push({name: 'login'})
          this.$Message.error(_.get(e, 'response.data.message', 'line 登陆失败'))
        }
    },
  }
};
</script>

<style lang="less" scoped>
@import '@/assets/style/color.less';

.container {
  padding-top: 70px;
  user-select: none;
  .provider__title {
    font-size: 28px;
    font-weight: bold;
  }
  .provider__box {
    padding: 32px 0 12px 0;
    display: -webkit-flex;
    > div {
      width: 50%;
      box-sizing: border-box;
      padding-right: 24px;
      > span {
        font-size: 16px;
      }
      .into {
        transition: all 0.3s;
        will-change: transform;
        cursor: pointer;
        position: relative;
        &:hover {
          &::after {
            transform: translate(0, 0);
            opacity: 1;
          }
        }
        &::after {
          content: "Choose";
          position: absolute;
          width: 100%;
          height: 100%;
          display: -webkit-flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: @themeColor;
          border-radius: 3px;
          top: 0;
          right: 0;
          opacity: 0;
          transition: all .55s;
          transform: translate(10px, 0);
          font-weight: bold;
          font-size: 16px;
        }
      }
      .student__card,
      .teacher__card {
        margin-top: 24px;
      }
      .teacher__card {
        width: 100%;
      }
    }
  }
}
</style>