<template>
  <div class="list-enimotion">
    <div class="emotion-nav"></div>
    <div class="emotion-item" v-if="isShowEmotions">
      <span
        class="emotion"
        v-for="emotion in emotionsCode"
        :key="emotion"
        v-html="emotion"
        @click="handleClickEmotion(emotion, textInput)"
      ></span>
    </div>
  </div>
</template>

<script>
import { emotionsCode } from "@composables/CharCodeEmoji";
export default {
  name: "EmotionTemplate",
  props: ["isShowEmotions", "textInput"],
  setup(props, { emit }) {
    const handleClickEmotion = (emotion, textInput) => {
      emit("addEmotion", emotion, textInput);
    };
    return { emotionsCode, handleClickEmotion };
  },
};
</script>

<style>
@import "@assets/style/emotion.css";
</style>