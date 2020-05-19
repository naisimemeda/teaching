<template>
  <div class="login__container">
    <div class="login__box">
      <div class="login__title">
        {{ Identity }}
        <span class="subtitle">/{{ mode }}</span>
      </div>
      <template v-if="Identity === 'Teacher'">
        <div class="form__line">
          邮箱
          <input placeholder="请输入教师邮箱" v-model="form.email"/>
        </div>
        <div class="form__line">
          密码
          <input placeholder="请输入密码" type="password" v-model="form.password" />
        </div>
      </template>
      <template v-if="Identity === 'Student'">
        <div class="form__line">
          账号
          <input placeholder="请输入学生账号" v-model="studentForm.email"/>
        </div>
        <div class="form__line">
          密码
          <input placeholder="请输入密码" type="password" v-model="studentForm.password" />
        </div>
      </template>
      <RadioGroup v-model="Identity" v-if="mode !== 'register'">
        <Radio label="Teacher" />
        <Radio label="Student" />
      </RadioGroup>
      <template v-if="mode==='register'">
        <div class="form__line">
          用户名
          <input placeholder="请输入用户名" v-model="form.name" />
        </div>
<!--        <div class="form__line">-->
<!--          验证码-->
<!--          <input placeholder="请输入验证码" type="password" />-->
<!--        </div>-->
      </template>
      <div class="submit__box">
        <div class="other">
          <div class="link" @click="handleChangeMode">{{ config.link }}</div>
          <div class="other__login flex--ac">
            第三方登录:
            <img src="@/assets/image/line.png" style="cursor:pointer" @click="lineLogin"/>
          </div>
        </div>

        <Button class="blur" type="primary" @click.stop="handleLogin" :loading="loading">{{ config.btn }}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import store from '../../store'
import _ from 'lodash'

export default {
  data() {
    return {
      mode: "login", // login or register,
      form: {
        name: '',
        email: '',
        password: '',
        provider: 'teacher'
      },
      loading: false,
      Identity: 'Teacher',
      studentForm: {
        email: '',
        password: '',
        provider: 'student'
      },
    };
  },
  computed: {
    isLogin() {
      return this.mode === 'login'
    },
    config() {
      const obj = {
        login: {
          link: '现在去注册',
          btn: '登录'
        },
        register: {
          link: '已有账号?',
          btn: '注册'
        }
      };
      return obj[this.mode];
    }
  },
  beforeRouteEnter(from, to ,next) {
    if (store.state.token !== "") {
      return next({ name: "home" })
    }
    next()
  },
  methods: {
    ...mapActions(['login', 'register']),
    /**
     * 登录
     */
    async handleLogin() {
      this.loading = true
      try {
        if (this.Identity === 'Teacher') {
          this.isLogin
                  ? await this.login(this.form)
                  : await this.register(this.form)
          this.$router.push({ name: 'schools' })
        } else {
          await this.login(this.studentForm)
          this.$router.push({ name: 'TeacherList' })
        }

        this.$Message.success({ content: this.isLogin ? '登录成功' : '注册成功' })
      } catch (e) {
        this.$Message.error({ content: _.get(e, 'response.data.message', '操作失败') })
      }
      this.loading = false
    },
    /**
     * 切换登录或注册
     */
    handleChangeMode() {
      this.Identity = "Teacher";
      if (this.mode === "login") {
        this.mode = "register";
        return;
      }
      this.mode = "login";
    },
    lineLogin() {
      window.location.href = process.env.VUE_APP_API_URL + '/line?type=login'
    },
  }
};
</script>

<style lang="less" scoped>
.login__container {
  width: 100%;
  padding-top: 15vh;
  .login__box {
    width: 400px;
    min-height: 320px;
    border-radius: 4px;
    margin: 0 auto;
    box-shadow: 0 5px 21px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    padding: 24px 28px 64px 28px;
    position: relative;
    &::after {
      content: "";
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #1990ff;
      position: absolute;
      z-index: 999;
      right: 28px;
      top: 24px;
    }
    .login__title {
      font-size: 22px;
      color: rgba(0, 0, 0, 0.75);
      margin-bottom: 32px;
      padding-top: 10px;
      font-weight: bold;
      .subtitle {
        font-size: 16px;
        font-weight: normal;
        display: inline-block;
      }
    }
    .submit__box {
      width: 110px;
      height: 120px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      margin-top: 30px;
      text-align: left;
      .other {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.55);
        align-items: center;
        margin-bottom: 12px;
        padding: 10px 0;
        .link {
          font-weight: bold;
          cursor: pointer;
          color: #1990ff;
        }
        > div {
          margin-bottom: 2px;
          user-select: none;
        }
        .other__login {
          img {
            width: 20px;
            margin-left: 8px;
          }
        }
      }
      button {
        width: 100px;
        height: 38px;
        border-radius: 3px;
        margin: 0 auto;
        background: #1990ff;
        color: white;
        border: none;
        outline: none;
        font-size: 14px;
      }
    }
  }
}
</style>