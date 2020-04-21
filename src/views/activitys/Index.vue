<!--
 * @Description: 测试
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-23 15:52:03
 -->
<template>
  <div class="activitys">
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>
<style lang="scss">
.activitys {
  .el-dialog__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 135px;
  }
}
</style>
