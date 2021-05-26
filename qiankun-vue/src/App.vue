<template>
  <div id="app">
    <div id="nav">vue子页面的内容</div>
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