<template>
  <transition name="slide-fade">
    <div
      v-if="visible"
      class="modal__container"
      @click="handleClose"
    >
      <div class="modal__box" @click.stop>
        <div class="title">{{ title }}</div>
        <div class="slot__container">
          <slot></slot>
        </div>
        <div class="modal__controller">
          <Button :loading="loading" class="btn--primary blur" type="primary" @click.stop="$emit('submit')">提交</Button>
          <span @click="handleClose">取消</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "Title"
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  name: "Modal",
  data() {
    return {};
  },
  methods: {
    /**
     * 关闭Modal
     */
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
};
</script>

<style lang="less" scoped>
.modal__container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 50;
  padding-top: 120px;
  overflow: auto;
  .modal__box {
    width: 450px;
    max-height: 700px;
    background: white;
    box-sizing: border-box;
    padding: 24px 28px;
    padding-bottom: 48px;
    user-select: none;
    border-radius: 3px;
    margin: 0 auto;
    .title {
      font-size: 23px;
    }
    .slot__container {
      flex: 1;
      padding: 18px 0 20px 0;
    }
    .modal__controller {
      font-size: 14px;
      button {
        width: 75px;
        z-index: 51;
        font-size: 14px;
        cursor: pointer;
      }
      > span {
        cursor: pointer;
        padding: 0 14px;
        text-align: center;
      }
    }
  }
}
</style>