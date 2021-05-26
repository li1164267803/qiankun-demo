<template>
  <div id="app">
    <div id="nav">vue子页面的内容</div>
    <p>子应用的样式不会影响 别的微应用 </p>
    <p>基于 shadow DOM 的样式隔离</p>
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      name:'名字'
    }
  },
}
</script>

<style  scoped>
div,a {
  color: red;
  font-size: 32px;
}
</style>