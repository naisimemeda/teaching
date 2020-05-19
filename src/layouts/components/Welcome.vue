<template>
  <div class="main">
    <div class="welcome">
      <div class="welcome__title">
        <span class="bh" @click.stop="backHome">Welcome,</span>
        <span class="welcome__subtitle">{{ teacher.name || student.name }}</span>
        <button class="btn--primary blur line" @click="Line()">
          绑定 Line
        </button>
        <button class="btn--primary blur line" @click="Chat()" v-if="this.$route.name !== 'Message' && provider !== 'teacher' ">
          沟通老师
        </button>
      </div>
      <div class="logout flex--ac" @click.stop="logout">
        Exit
        <i class="icon">&#xe6a7;</i>
      </div>
    </div>

    <div class="crumb">
      <Breadcrumb>
        <BreadcrumbItem v-for="(item, index) in breadcrumbList" :key="index" :to="item.to">{{ item.title }}</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div class="info__box" v-if="showController">
      <Avatar class="avatar blur" shape="square" size="large" :src="teacher.line_avatar_url" />

      <div class="controller">
        <div class="controller__group link">
          <router-link :to="{ name: 'schools' }">学校列表</router-link>

          <router-link :to="{ name: 'students' }">关注我的学生</router-link>
        </div>

        <div class="controller__group primary" v-if="$route.name === 'schools'">
          <button class="btn--primary blur" @click="handleVisibleForm">
            <i class="icon">&#xe6b9;</i>
            申请学校
          </button>
        </div>
      </div>
    </div>

    <Modal
      title="Create School"
      :loading="formLoading"
      :visible.sync="visibleSchoolForm"
      @submit="handleCreateSchool"
    >
      <div class="form__line">
        学校封面
        <div class="avatar">
          <Avatar shape="square" icon="ios-add" style="display: block" :size="100" :src="schoolForm.cover" />
          <div class="operation" @click="avatarUploader.visible = true">上传封面</div>

          <uploader
            v-if="avatarUploader.visible"
            v-model="avatarUploader.visible"
            :field="avatarUploader.field"
            :width="avatarUploader.width"
            :height="avatarUploader.height"
            :url="avatarUploader.url"
            :headers="avatarUploader.headers"
            :img-format="avatarUploader.imgFormat"
            @crop-upload-success="({ data }) => (schoolForm.cover = data)"
          />
        </div>
      </div>

      <div class="form__line">
        学校名称
        <input type="text" placeholder="请输入学校名称" v-model="schoolForm.name" />
      </div>
    </Modal>

  </div>
</template>

<script>
import uploader from "vue-image-crop-upload";
import store from "@/store";
import { mapState, mapActions } from "vuex";
import { Modal } from "@/components";
import { store as schoolStore } from "@/api/school"
import _ from "lodash";
import router from "../../router";
import ls from "@/utils/localStorage"
const defaultSchoolForm = {
  cover: "",
  name: ""
};

export default {
  name: "WelcomeHeader",
  components: {
    Modal,
    uploader
  },
  data() {
    return {
      visibleSchoolForm: false,
      schoolForm: _.cloneDeep(defaultSchoolForm),
      avatarUploader: {
        visible: false,
        width: 300,
        height: 300,
        field: "file",
        url: process.env.VUE_APP_API_URL + "/api/upload/file",
        headers: {
          Authorization: store.state.token
        },
        imgFormat: "png"
      },
      formLoading: false,
      recentSchoolId: null
    };
  },
  watch: {
    '$route': {
      immediate: true,
      deep: true,
      handler(route) {
        if (route.name === 'school') {
          this.recentSchoolId = route.params.id || null
        }
      }
    }
  },
  computed: {
    ...mapState(["teacher", "student"]),
    showController() {
      return ['schools', 'students'].includes(this.$route.name)
    },
    provider() {
      return ls.getItem('provider')
    },
    breadcrumbList() {
      if (ls.getItem('provider') === 'teacher') {
        const crumb = [{ to: { name: 'home' }, title: '首页' }]
        const schoolCrumb = {
          to: { name: 'school', params: { id: this.recentSchoolId } },
          title: '学校详情'
        }

        const chatCrumb = {
          to: { name: 'chat' },
          title: '聊天室'
        }

        switch (this.$route.name) {
          case 'school' :
            crumb.push(schoolCrumb)
            break
          case 'chat' :
          case 'dialog' :
            this.recentSchoolId && crumb.push(schoolCrumb)
            crumb.push(chatCrumb)
            break
        }

        return crumb
      }

      const crumb = [{ to: { name: 'TeacherList' }, title: '首页' }, ]
      switch (this.$route.name) {
        case 'Message' :
          crumb.push({ to: { name: 'Message' }, title: '沟通老师' })
          break
      }
      return crumb
    }
  },
  methods: {
    ...mapActions({ logoutAction: "logout" }),
    logout() {
      this.logoutAction();
      this.$Message.success("登出成功");
      this.$router.push("/login");
    },
    handleVisibleForm() {
      switch (this.$route.name) {
        case "schools":
          this.visibleSchoolForm = true;
          break;
        case "students":
          // this.visibleStudentForm = true
          break;
      }
    },
    Chat() {
      this.$router.push({ name: 'Message' })
    },
    Line() {
      let bind_type = 'student'
      let auth_id = router.app.$options.store.state.student.id
      if ( !auth_id ) {
         bind_type = 'teacher'
         auth_id = router.app.$options.store.state.teacher.id
      }
      console.log(process.env.VUE_APP_API_URL + `/line?type=binding&bind_type=${ bind_type }&id=` + auth_id)
      window.location.href = process.env.VUE_APP_API_URL + `/line?type=binding&bind_type=${ bind_type }&id=` + auth_id
    },
    async handleCreateSchool() {
      try {
        await schoolStore(this.schoolForm);
        this.$bus.$emit('refresh:schools')
        this.$Message.success("已提交申请");
        this.visibleSchoolForm = false;
      } catch (e) {
        this.$Message.error(_.get(e, "response.data.message", "提交失败"));
      }
      this.schoolForm = _.cloneDeep(defaultSchoolForm);
      this.formLoading = false;
    },
    backHome() {
      this.$router.push('/')
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/style/color.less";

.main {
  padding: 0 12px;
  .crumb {
    padding: 2px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .welcome {
    padding: 90px 0 40px 0;
    display: -webkit-flex;
    align-items: center;
    justify-content: space-between;
    .welcome__title {
      font-size: 26px;
      font-weight: bold;
      color: @themeColor;
      .bh {
        user-select: none;
        cursor: pointer;
        transition: all 0.4s;
        display: inline-block;
        &:hover {
          transform: translate(-5px, 0);
        }
      }
      .welcome__subtitle {
        font-size: 18px;
        color: @textColor;
      }
      .line {
        margin-left: 20px;
        background: #19be6b;
        font-size: 14px;
      }
    }
    .logout {
      user-select: none;
      cursor: pointer;
    }
  }
  .info__box {
    padding: 22px 2px;
    box-sizing: border-box;
    display: -webkit-flex;
    align-items: center;
    .avatar {
      width: 100px;
      height: 100px;
      // border: 0px solid white;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-color: #efefef;
    }
    .controller {
      flex: 1;
      box-sizing: border-box;
      padding: 0 32px;
      display: -webkit-flex;
      align-items: center;
      justify-content: space-between;
      .controller__group {
        cursor: pointer;
        user-select: none;
        &.link {
          a {
            color: @textColor;
            text-decoration: none;
            padding: 0 12px;
          }
          a.router-link-exact-active {
            font-weight: bold;
            font-size: 20px;
          }
        }
        &.primary {
          button {
            width: 100px;
            height: 33px;
            border: none;
            background: @themeColor;
            color: white;
            outline: none;
            border-radius: 3px;
          }
        }
      }
    }
  }

  .avatar {
    position: relative;
    display: flex;
    .operation {
      position: absolute;
      width: 100px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      background: rgba(0, 0, 0, 0.32);
      opacity: 0;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
  }
}

</style>