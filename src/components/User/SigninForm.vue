<template>
  <div class="app">
    <div class="signin-form-container">
      <div class="signin-form">
        <h3>{{ $t("signin.title") }}</h3>
        <form @submit.prevent="handleSigninWithEmailAndPassword">
          <input type="email" v-model="loginData.email" placeholder="Email" />
          <input
            type="password"
            v-model="loginData.password"
            :placeholder="$t('signin.title')"
          />
          <span class="signin-error-message" v-show="errorMessage">
            {{ errorMessage }}
          </span>
          <button type="submit">{{ $t("signin.title") }}</button>
        </form>
      </div>
      <div class="or-change-method-signin">
        <span>Or</span>
      </div>
      <span
        @click="handleSigninWithGoogle"
        class="signin-with-society-network gg-login"
        ><span class="icon-custom"><i class="fa-brands fa-google"></i></span
        >&ensp;{{ $t("signin.societyNetWork", { name: "Google" }) }}</span
      >
      <span
        @click="handleSigninWithFacebook"
        class="signin-with-society-network fb-login"
      >
        <span class="icon-custom"><i class="fa-brands fa-facebook"></i></span
        >&ensp;{{ $t("signin.societyNetWork", { name: "Facebook" }) }}</span
      >
      <p class="redirect-page">
        {{ $t("signin.changeForm") }}
        <router-link :to="{ name: 'signup' }">
          {{ $t("signin.signup") }}
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { reactive } from "@vue/reactivity";
export default {
  name: "SigninForm",
  props: {
    errorMessage: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const loginData = reactive({
      email: "",
      password: "",
    });

    const handleSigninWithEmailAndPassword = () => {
      emit("signin", loginData);
    };

    const handleSigninWithGoogle = () => {
      emit("signinWithGoogle");
    };

    const handleSigninWithFacebook = () => {
      emit("signinWithFacebook");
    };

    return {
      loginData,
      handleSigninWithEmailAndPassword,
      handleSigninWithGoogle,
      handleSigninWithFacebook,
    };
  },
};
</script>

<style>
@import "@assets/style/signin.css";
</style>
