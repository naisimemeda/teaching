<template>
  <div>
    <Tab style="margin-bottom: 24px" :activeName.sync="activeName" @update:activeName="handleUpdate" :tabs="tabs" />
    <div class="teacher__list">
      <Spin fix v-if="loading" />
      <TeacherCard :star.sync="teacher.star" v-for="(teacher, index) in Teachers" :teacher="teacher" :key="index" />
    </div>
    <div>
      <Page :total="total" :page-size="params.pageSize" size="small" @on-change="params.page = $event" />
    </div>
  </div>
</template>

<script>
import { TeacherCard, Tab } from "@/components";
import { teacher as index, starTeacher as starIndex } from '@/api/student';
import _ from "lodash";

export default {
  name: "TeacherList",
  components: { TeacherCard, Tab },
  watch: {
    'params.page': {
      deep:true,
      handler() {
        this.getTeachers()
      }
    }
  },
  data() {
    return {
      Teachers: [],
      loading: false,
      activeName: "all",
      total: 0,
      params: {
        pageSize:10,
        page: 1
      },
      tabs: [
        { title: "所有老师", name: "all" },
        { title: "我关注的老师", name: "star" }
      ]
    };
  },
  created() {
    this.getTeachers()
  },
  methods: {
    handleUpdate(name) {
      console.log(name);
      this.getTeachers()
    },
    async getTeachers() {
      this.loading = true
      this.activeName === 'all' ? await index(this.params): 1
      try {
        if (this.activeName === 'all') {
          const teachers = await index(this.params)
          this.Teachers = teachers.data.data
          this.total = teachers.data.total
        } else {
          const starTeachers = await starIndex(this.params)
          this.Teachers = starTeachers.data.data
          this.total = starTeachers.data.total
        }
      } catch (e) {
        this.$Message.error(_.get(e, "response.data.message", "请求失败"));
      }
      this.loading = false
    }
  }
};
</script>

<style lang="less" scoped>
.teacher__list {
  display: -webkit-flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 550px;
  position: relative;
  .teacher__card {
    margin-bottom: 24px;
    max-height: 86px;

  }
}
</style>