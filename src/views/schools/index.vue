<template>
  <div>
    <div class="schools">
      <Spin fix v-if="loading"></Spin>

      <div class="school__list">
        <SchoolCard class="school__card" v-for="(school , index) in schools" :key="index" :school="school"/>
      </div>

      <div v-if="schools.length === 0 && !loading">
        暂无数据
      </div>
    </div>

    <div>
      <Page :total="total" :page-size="params.pageSize" size="small" @on-change="params.page = $event" />
    </div>
  </div>
</template>

<script>
import { SchoolCard } from "@/components";
import { index } from '@/api/school'

export default {
  name: "teacher",
  components: { SchoolCard },
  watch: {
    'params.page': {
      deep:true,
      handler() {
        this.getSchools()
      }
    }
  },
  data() {
    return {
      visible: false,
      total: 0,
      params: {
        page: 1,
        pageSize: 6
      },
      schools: [],
      loading: false,
    };
  },
  created() {
    this.getSchools();
  },
  mounted() {
    this.$bus.$on('refresh:schools', this.getSchools)
  },
  methods: {
    handlePrimary() {
      this.visible = true
    },
    getSchools() {
      this.loading = true
      index(this.params).then(res => {
        this.schools = res.data.data;
        this.total = res.data.total;
        this.loading = false
      }).catch(() => this.loading = false)
    }
  }
};
</script>

<style lang="less" scoped>
  .Breadcrumb {
    padding: 0 0 8px 0;
  }

  .schools {
    position: relative;
    height: 388px;
    justify-content: center;
    align-items: center;
    .school__list {
      display: -webkit-flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      .school__card {
        margin-bottom: 24px;
        margin-right: 18px;
      }
    }
  }

</style>