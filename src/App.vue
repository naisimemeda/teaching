<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
@import "./assets/style/color.less";

* {
  padding: 0;
  margin: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.7, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

@font-face {
  font-family: "iconfont"; /* project id 1820104 */
  src: url("//at.alicdn.com/t/font_1820104_2m86x4sdn6r.eot");
  src: url("//at.alicdn.com/t/font_1820104_2m86x4sdn6r.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_1820104_2m86x4sdn6r.woff2") format("woff2"),
    url("//at.alicdn.com/t/font_1820104_2m86x4sdn6r.woff") format("woff"),
    url("//at.alicdn.com/t/font_1820104_2m86x4sdn6r.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_1820104_2m86x4sdn6r.svg#iconfont") format("svg");
}

.icon {
  font-family: iconfont;
  font-style: normal;
  font-weight: bold;
}

.container {
  max-width: 100%;
  width: 1100px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0 24px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

.flex {
  display: -webkit-flex;
}

.flex--ac {
  display: -webkit-flex;
  align-items: center;
}
.flex--jc {
  display: -webkit-flex;
  justify-content: center;
}
.flex--d {
  flex-direction: column;
}

.form__line {
  color: rgba(0, 0, 0, 0.45);
  text-align: left;
  input {
    margin-top: 5px;
    margin-bottom: 12px;
    display: block;
    width: 100%;
    outline: none;
    height: 40px;
    border-radius: 4px;
    border: none;
    box-shadow: 0 2px 12px inset rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    padding: 0 14px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.75);
  }
}

.btn--primary {
  padding: 0 12px;
  height: 33px;
  border: none;
  background: #1990ff;
  color: white;
  outline: none;
  border-radius: 3px;
  cursor: pointer;
}

.blur {
  position: relative;
  &::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 2px;
    left: 2px;
    background: inherit;
    filter: blur(7px);
    opacity: 0.7;
    z-index: -1;
  }
}
</style>
