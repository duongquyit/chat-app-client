<template>
  <Loading v-if="isPending" />
  <SigninForm
    :errorMessage="errorMessage"
    @signin="handleSignin"
    @signinWithGoogle="handleSigninWithGoogle"
    @signinWithFacebook="handleSigninWithFacebook"
  />
</template>

<script>
import {
  signinWithGoogle,
  signinWithFacebook,
  signin,
  isPending,
  errorMessage,
} from "@composables/Signin";

import SigninForm from "@components/User/SigninForm.vue";
import Loading from "@components/Template/Loading.vue";

export default {
  name: "SigninPage",
  components: {
    SigninForm,
    Loading,
  },
  setup() {
    const handleSignin = async (email, password) => {
      try {
        await signin(email, password);
      } catch (error) {
        console.log(error);
      }
    };

    const handleSigninWithGoogle = async () => {
      try {
        await signinWithGoogle();
      } catch (error) {
        console.log(error);
      }
    };

    const handleSigninWithFacebook = async () => {
      try {
        await signinWithFacebook();
      } catch (error) {
        console.log(error);
      }
    };


    return {
      handleSignin,
      handleSigninWithGoogle,
      handleSigninWithFacebook,
      isPending,
      errorMessage,
    };
  },
};
</script>

<style>
</style>