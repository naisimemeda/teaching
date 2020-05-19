<template>
  <div class="container">
    <welcome @primary="handlePrimary"></welcome>
    <div class="viewer">
      <transition name="slide-fade" mode="out-in">
        <router-view ref="viewer"></router-view>
      </transition>
    </div>
    <vFooter></vFooter>
  </div>
</template>

<script>
import { welcome, vFooter } from "./components";

export default {
  name: "BasicLayout",
  components: { welcome, vFooter },
  data() {
    return {};
  },
  methods: {
    handlePrimary(method) {
      this.$refs.viewer[method]()
    }
  }
};
</script>

<style lang="less" scoped>
.viewer {
  padding: 24px 0;
}
</style>