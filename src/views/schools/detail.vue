<template>
  <div class="main">
    <div class="col teachers">
      <div class="head">
        <span class="title">老师列表({{ teacher.fetchParams.total || 0 }})</span>
        <button class="btn--primary blur" style="height: 20px;" v-if="hasPermission" @click="teacher.visible = true">邀请老师</button>
      </div>

      <div class="wrap">
        <Spin fix v-if="teacher.listLoading" />
        <div class="items">
          <div class="item" v-for="item in teacher.data" :key="item.id">
            <Avatar icon="ios-person" size="large" :src="item.avatar_url" />

            <div class="info">
              {{ item.name }}
            </div>
          </div>

          <div class="load">
            <span v-if="teacherListInLastPage && !teacher.listLoading">end</span>
            <Button v-else type="dashed" style="width: 100%" @click="handleLoadMoreTeachers">加载更多</Button>
          </div>
        </div>
      </div>
    </div>

    <Modal title="Invite Teacher" :loading="teacher.formLoading" :visible.sync="teacher.visible" @submit="handleInviteTeacher">
      <div class="form__line">
        学校
        <Select v-model="teacher.form.school_id" style="width:200px;display: block">
          <Option v-for="{ id, name } in schoolOptions" :value="id" :key="id">{{ name }}</Option>
        </Select>
      </div>
      <div class="form__line">
        email
        <input type="text" placeholder="教师邮箱" v-model="teacher.form.email" />
      </div>
    </Modal>

    <div class="col line"></div>

    <div class="col students">
      <div class="head">
        <span class="title">学生列表({{ student.fetchParams.total || 0 }})</span>
        <button class="btn--primary blur" style="height: 20px;" v-if="hasPermission" @click="student.visible = true">创建学生</button>
      </div>

      <div class="wrap">
        <Spin fix v-if="student.listLoading" />

        <div class="items">
          <div class="item" v-for="item in student.data" :key="item.id" :student="item" >
            <Avatar icon="ios-person" size="large" :src="item.avatar_url" />

            <div class="info">
              {{ item.name }}
            </div>

            <div class="controller" v-if="hasPermission">
              <span @click.stop="handleStudentChat(item)">沟通</span>
            </div>
          </div>

          <div class="load">
            <span v-if="studentListInLastPage && !student.listLoading">end</span>
            <Button v-else type="dashed" style="width: 100%" @click="handleLoadMoreStudents">加载更多</Button>
          </div>
        </div>
      </div>
    </div>

    <Modal title="Create Student" :loading="student.formLoading" :visible.sync="student.visible" @submit="handleCreateStudent">
      <div class="form__line">
        学生名称
        <input type="text" placeholder="请输入学生名称" v-model="student.form.name" />
      </div>
      <div class="form__line">
        账号
        <input type="text" placeholder="请输入账号" v-model="student.form.account" />
      </div>
      <div class="form__line">
        登录密码
        <input type="text" placeholder="请输入登录密码" v-model="student.form.password" />
      </div>
      <div class="form__line">
        所属学校
        <Select v-model="student.form.school_id" style="width:200px;display: block">
          <Option v-for="{ id, name } in schoolOptions" :value="id" :key="id">{{ name }}</Option>
        </Select>
      </div>
    </Modal>
  </div>
</template>

<script>
import { indexBySchool as fetchTeachersAPI } from "../../api/teacher"
import { indexBySchool as fetchStudentsAPI } from '../../api/student'
import Modal from '@/components/Modal'
import _ from 'lodash'
import { store as studentStore } from "../../api/student";
import { options, invite as inviteTeacher } from "@/api/school";
import { mapState, mapMutations } from 'vuex'

export default {
  name: "detail",
  components: { Modal },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      hasPermission: false,
      schoolOptions: [],

      teacher: {
        visible: false,
        formLoading: false,
        listLoading: false,
        data: [],
        fetchParams: {
          total: 0,
          page: 1,
          pageSize: 10
        },
        form: {
          school_id: null,
          email: '',
        }
      },

      student: {
        visible: false,
        formLoading: false,
        listLoading: false,
        data: [],
        fetchParams: {
          total: 0,
          page: 1,
          pageSize: 10
        },
        form: {
          name: '',
          account: '',
          password: '',
          school_id: null
        }
      }
    }
  },
  watch: {
    schoolOptions: {
      immediate: true,
      deep: true,
      handler(options) {
        _.findIndex(options, { id: this.id }) !== -1 && (this.student.form.school_id = Number(this.id))
      }
    },
    'teacher.visible'(visible) {
      visible && this.fetchSchoolOptions()
    },
    'teacher.fetchParams.page' () {
      this.fetchTeachers()
    },
    'student.visible'(visible) {
      visible && this.fetchSchoolOptions()
    },
    'student.fetchParams.page' () {
      this.fetchStudents()
    }
  },
  computed: {
    ...mapState({ currentTeacher: 'teacher' }),
    teacherListInLastPage() {
      const params = this.teacher.fetchParams
      return params.page * params.pageSize >= params.total
    },
    studentListInLastPage() {
      const params = this.student.fetchParams
      return params.page * params.pageSize >= params.total
    }
  },
  created() {
    this.fetchTeachers()
    this.fetchStudents()
  },
  methods: {
    ...mapMutations(['SET_RECENT_CHAT_USERS']),
    async handleCreateStudent() {
      this.student.formLoading = true
      try {
        await studentStore(this.student.form)
        this.$Message.success('添加成功')
        this.student.visible = false
        this.student.fetchParams.page === 1
                ? this.fetchStudents()
                : this.student.fetchParams.page = 1
        this.student.form = {
          name: '',
          account: '',
          password: '',
          school_id: null
        }
      } catch (e) {
        this.$Message.error(_.get(e, 'response.data.message', '添加失败'))
      }

      this.student.formLoading = false
    },
    async fetchTeachers() {
      this.teacher.listLoading = true

      try {
        const res = await fetchTeachersAPI(this.id, this.teacher.fetchParams)
        this.teacher.data = this.teacher.fetchParams.page === 1
                ? res.data.teachers.data
                : this.teacher.data.concat(res.data.teachers.data )
        this.teacher.fetchParams.total = res.data.teachers.total
        this.hasPermission = res.data.auth
        return Promise.resolve()
      } catch (e) {
        console.error(e)
        this.$Message.error('请求失败')
        return Promise.reject()
      } finally {
        this.teacher.listLoading = false
      }
    },
    async fetchStudents() {
      this.student.listLoading = true

      try {
        const res = await fetchStudentsAPI(this.id, this.student.fetchParams)
        this.student.data = this.student.fetchParams.page === 1
                ? res.data.student.data
                : this.student.data.concat(res.data.student.data)
        this.student.fetchParams.total = res.data.student.total
        this.hasPermission = res.data.auth
        return Promise.resolve()
      } catch (e) {
        this.$Message.error('请求失败')
        return Promise.reject()
      } finally {
        this.student.listLoading = false
      }
    },
    async fetchSchoolOptions() {
      const { data } = await options()
      this.schoolOptions = data
    },
    async handleInviteTeacher() {
      this.teacher.formLoading = true
      try {
        await inviteTeacher(this.teacher.form)
        this.$Message.success('邀请成功~')
        this.teacher.visble = false
        this.teacher.form = {
          school_id: null,
          email: ''
        }
      } catch (e) {
        this.$Message.error('请求失败')
      }
      this.teacher.formLoading = false
    },
    handleStudentChat({ id }) {
      this.$router.push({ name: 'chat', query: { id }})
    },
    handleLoadMoreTeachers() {
      !this.teacherListInLastPage && this.teacher.fetchParams.page ++
    },
    handleLoadMoreStudents() {
      !this.studentListInLastPage && this.student.fetchParams.page ++
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../../assets/style/color.less';

  .main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .col {
      width: 49%;
      .head {
        padding: 5px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .wrap {
        position: relative;
        height: 550px;
        .items {
          height: 100%;
          overflow: auto;
          padding: 5px;
          /*border: 1px solid #ccc;*/
          &::-webkit-scrollbar {
            width: 3px;     /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: #c6dbf4;
          }
          &::-webkit-scrollbar-track {
            border-radius: 10px;
          }
          .item {
            margin: 10px 0;
            width: 100%;
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
            }
          }
          .load {
            display: flex;
            justify-content: center;
            align-items: center;
            &::v-deep .ivu-btn {
              color: #9ed1fc;
              border-color: #9ed1fc;
              &:hover {
                color: @themeColor;
                border-color: @themeColor;
              }
            }
            margin: 8px 0;
          }
        }
      }
    }
    .line {
      width: 1px;
      height: 80%;
      border: 1px solid #ccc;
    }
  }
</style>