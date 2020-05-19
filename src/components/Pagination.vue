<template>
  <div class="pagination">
    <div class="page__number__line">
      <span
        v-for="num in paginationArr"
        @click="$emit('update:page', num)"
        :class="{ checked: num===page }"
        :key="num"
      >{{ num }}</span>
    </div>
    <span style="cursor: pointer" @click.stop="handleChange('prev')">
      <i class="icon">&#xe697;</i>
      Prev
    </span>
    <span style="padding: 0 10px">Total: {{ total }}</span>
    <span style="cursor: pointer" @click.stop="handleChange()">
      Next
      <i class="icon">&#xe6a7;</i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    }
  },
  name: "Pagination",
  data() {
    return {
      maxShowCount: 7,
      pageCount: 0,
      pp: 1 // 当前在第几张分页 [1,2,3]为1 [4,5,6]为2
    };
  },
  watch: {
    total: {
      immediate: true,
      handler(val) {
        this.pageCount = Math.ceil(val / 8);
      }
    }
  },
  methods: {
    /**
     * 切换页码
     */
    handleChange(type) {
      // 达到上限或在第一页的时候直接return
      if (
        (!type && this.page === this.pageCount) ||
        (type === "prev" && this.page === 1)
      ) {
        return;
      }
      // sync同步更新父组件绑定变量值
      this.$emit(
        "update:page",
        type === "prev" ? this.page - 1 : this.page + 1
      );
      setTimeout(() => {
        let pp = Math.ceil(this.page / this.maxShowCount);
        if (pp !== this.pp) {
          this.pp = pp;
        }
      }, 100);
    }
  },
  computed: {
    // 当前分页页码数组
    paginationArr() {
      let arr = [];
      for (
        let i = (this.pp - 1) * this.maxShowCount;
        i < this.maxShowCount * this.pp;
        i++
      ) {
        if (i === this.pageCount) {
          break;
        }
        arr.push(i + 1);
      }
      return arr;
    }
  }
};
</script>

<style lang="less" scoped>
.pagination {
  user-select: none;
  .page__number__line {
    height: 40px;
    display: -webkit-flex;
    align-items: center;
    span {
      width: 40px;
      display: inline-block;
      transition: all 0.4s;
      &.checked {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}
</style>