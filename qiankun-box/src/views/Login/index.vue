<template>
  <div class="login-content">
    <h2>登 录</h2>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="login-ruleForm"
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >登录</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        name: "",
        password: ""
      },
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "change" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "长度最少为6个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({
            message: "登录成功",
            type: "success"
          });
          this.$actions.setGlobalState({ token: "abcd" });
          setTimeout(() => {
            this.$router.push("/home");
          }, 1000);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.login-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .login-ruleForm {
    width: 50%;
  }
}
</style>
