<template>
  <div class="app">
    <Loading v-if="isPending" />
    <div class="signup-form-container">
      <div class="siggup-form">
        <h3>{{ $t("signup.title") }}</h3>
        <form @submit.prevent="handleSignup">
          <input
            type="text"
            :placeholder="$t('signup.name')"
            v-model="signup.name"
          />
          <input type="email" placeholder="Email" v-model="signup.email" />
          <input
            type="password"
            :placeholder="$t('signup.password')"
            v-model="signup.password"
          />
          <span class="signup-form-error-message" v-show="errorMessage">
            {{ errorMessage }}
          </span>
          <button type="submit">{{ $t("signup.title") }}</button>
        </form>
        <p class="redirect-page">
          {{ $t("signup.changeForm") }}
          <router-link :to="{ name: 'signin' }">
            {{ $t("signup.signin") }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import Loading from "@components/Template/Loading.vue";
export default {
  name: "SignupForm",
  props: {
    isPending: {
      type: Boolean,
    },
    errorMessage: {
      type: String,
    },
  },
  components: {
    Loading,
  },
  setup(props, { emit }) {
    const signupData = reactive({
      name: "",
      email: "",
      password: "",
    });

    const handleSignup = () => {
      emit("signup", signupData);
    };

    return { signupData, handleSignup };
  },
};
</script>

<style>
@import "@assets/style/signup.css";
</style>
