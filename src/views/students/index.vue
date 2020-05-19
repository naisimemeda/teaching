<template>
  <div>
<!--    StudentList-->
    <div class="students">
      <Spin fix v-if="loading"></Spin>

      <div class="student__list">
        <StudentCard class="student__card" v-for="student in students" :key="student.id" :student="student"></StudentCard>
      </div>

      <div v-if="students.length === 0 && !loading">
        暂无数据
      </div>
    </div>

    <Page :total="params.total" :page-size="params.pageSize" size="small" @on-change="params.page = $event" />
  </div>
</template>

<script>
import { StudentCard } from "@/components";
import { studentFans } from "@/api/student";

export default {
  name: "StudentList",
  components: { StudentCard },
  data() {
    return {
      visible: false,
      students: [],
      loading: false,
      params: {
        total: 0,
        pageSize:10,
        page: 1
      }
    };
  },
  watch: {
    'params.page'() {
      this.fetchStudents()
    }
  },
  created() {
    this.fetchStudents()
  },
  methods: {
    handlePrimary() {
      this.visible = true;
    },
    async fetchStudents() {
      this.loading = true

      const res = await studentFans(this.params)

      this.students = res.data.data

      this.loading = false
    }
  }
};
</script>

<style lang="less" scoped>
.students {
  position: relative;
  height: 475px;
  justify-content: center;
  align-items: center;
  .student__list {
    display: -webkit-flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .student__card {
      width: calc(50% - 10px);
      margin-bottom: 24px;
    }
  }
}
</style>