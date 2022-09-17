<template>
  <div class="locale-change">
    <div
      class="locale-item"
      v-for="lang in language"
      :key="lang"
      @click="handleClickChangeLanguage(lang)"
    >
      <span>{{ lang[1][0] }}</span>
      <img :src="lang[1][1]" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: "LocaleChange",
  props: {
    language: {
      type: Map,
    },
  },
  setup(props, { emit }) {
    const handleClickChangeLanguage = (lang) => {
      emit('changeLanguage', lang);
    };

    return { handleClickChangeLanguage };
  },
};
</script>

<style>
</style>