<template>
  <div class="school__card">
    <div class="school__card__cover">
       <img :src="school.cover" style="width: 195px;height: 100%;">
    </div>
    <div class="school__card__content">
      <div class="school__title">
        {{ school.name }}
      </div>
      <div class="school__content__line">
        教师人数: <span style="color: #19be6b"> {{ school.teacher_count }} </span>
      </div>
      <div class="school__content__line">
        学生人数: <span style="color: #19be6b"> {{ school.student_count }} </span>
      </div>
      <div class="school__content__line">
        <span v-if="!school.status" style="color: #ed4014"> 未审核 </span>
      </div>
      <div class="school__controller" v-if="school.status">
        <button class="blur" @click="handleView">浏览</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SchoolCard",
    props: {
      school: {
        type: Object,
      }
    },
    data() {
      return {};
    },
    methods: {
      handleView() {
        this.$router.push({ name: 'school', params: { id: this.school.id }})
      }
    }
  };
</script>

<style lang="less" scoped>
  @import '../assets/style/color.less';

  .school__card {
    width: 330px;
    height: 170px;
    background: white;
    box-shadow: 0 5px 21px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    padding-left: 160px;
    display: -webkit-flex;
    align-items: center;
    .school__card__cover {
      width: 195px;
      height: 100%;
      // background-image: url("https://hbimg.huabanimg.com/5974f40e0646d31fcfbc2d5eaecf94408976a5151020f-o5O8Ug_fw658/format/webp");
      background-repeat: no-repeat;
      background-position: top;
      background-size: cover;
      transform: rotate(30deg);
      position: absolute;
      //border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 10px 5px 21px rgba(0, 0, 0, 0.15) inset;
      border-radius: 2px;
      left: -50px;
      top: 20px;
      text-align: right;
    }
    .school__card__content {
      flex: 1;
      box-sizing: border-box;
      padding-right: 32px;
      text-align: right;
      color: rgba(0, 0, 0, 0.55);
      font-size: 15px;
      .school__title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 2px;
        color: @textColor;
      }
      .school__controller {
        padding-top: 10px;
        // border-top: 1px solid rgba(0, 0, 0, 0.1);
        button {
          width: 50px;
          height: 24px;
          background: @themeColor;
          border: none;
          outline: none;
          color: white;
          position: relative;
          border-radius: 2px;
        }
      }
    }
  }
</style>