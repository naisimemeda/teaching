<template>
  <div class="student__card">
    <img class="avatar" :src="student.avatar_url || '' ">
    <div class="info">{{ student.name }}</div>
  </div>
</template>

<script>
export default {
  props: {
    student: {
      type: Object,
      required: true
    }
  },
  name: "StudentCard",
  data() {
    return {};
  },
  methods: {
  }
};
</script>

<style lang="less" scoped>
@import "../assets/style/color.less";

.student__card {
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
</style>