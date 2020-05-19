<template>
  <div class="tab">
    <div @click.stop="handleChange(i.name)" v-for="(i , index) in tabs" :key="index" :class="{checked: i.name===activeName}">
      {{ i.title }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    activeName: [String, Number]
  },
  name: "Tab",
  data() {
    return {};
  },
  methods: {
    handleChange(name) {
      this.$emit('update:activeName', name)
    }
  }
};
</script>

<style lang="less" scoped>
  @import '@/assets/style/color.less';

  .tab {
    display: -webkit-flex;
    align-items: center;
    user-select: none;
    div {
      // padding: 0 0;
      margin-right: 14px;
      cursor: pointer;
      &.checked {
        font-size: 20px;
        font-weight: bold;
        color: @themeColor;
      }
    }
  }
</style>