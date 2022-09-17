<template>
  <SignupForm
    @signup="handleSignup"
    :isPending="isPending"
    :errorMessage="errorMessage"
  />
</template>

<script>
import SignupForm from "@components/User/SignupForm.vue";
import { signup, isPending, errorMessage } from "@composables/Signup";
export default {
  name: "SignupPage",
  components: {
    SignupForm,
  },
  setup() {

    const handleSignup = async (email, password, name) => {
      await signup(email, password, name);
    };

    return { handleSignup, isPending, errorMessage };
  },
};
</script>

<style>
</style>