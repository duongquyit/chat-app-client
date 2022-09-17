<template>
  <div class="chat-message-form">
    <form @submit.prevent="$emit('submitSendMessage', textInput)">
      <slot
        name="listEmotion"
        :isShowEmotions="isShowEmotions"
        :textInput="textInput"
      >
      </slot>
      <span
        class="chat-form-emotion"
        v-html="emotionIcon"
        @mouseleave="handleMouseLeaveEmotionIcon"
        @click="handleClickEmotion"
      ></span>
      <div
        class="input-text-message"
        :class="{ borderDarkMode: isDarkMode, darkMode: isDarkMode }"
        ref="textInput"
        contenteditable="true"
        placeholder="Aa"
        aria-multiline="true"
        spellcheck="false"
        @keydown="handleKeyDownTextInput"
      ></div>
      <button type="submit" :class="{ darkMode: isDarkMode }">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { isDarkMode } from "@composables/GlobalVariables";
import { emotionsCode } from "@composables/CharCodeEmoji";

export default {
  name: "SendChatMessageForm",
  props: ["chatScrollBar"],
  setup(props, { emit }) {
    const textInput = ref(null);
    const isShowEmotions = ref(false);
    const emotionIcon = ref(
      emotionsCode[Math.floor(Math.random() * emotionsCode.length)]
    );

    const handleMouseLeaveEmotionIcon = () => {
      emotionIcon.value =
        emotionsCode[Math.floor(Math.random() * emotionsCode.length)];
    };

    const handleClickEmotion = () => {
      isShowEmotions.value = !isShowEmotions.value;
    };

    const handleKeyDownTextInput = (evt) => {
      emit("changeTextMessage", evt, props.chatScrollBar);
    };

    // event click outside emotion table and close this
    watch(isShowEmotions, () => {
      const clickOutsideEmotionContainer = (event) => {
        const emotionElement = document.querySelector(".list-enimotion");
        const emotion = document.querySelector(".chat-form-emotion");
        if (
          !emotionElement.contains(event.target) &&
          !emotion.contains(event.target)
        ) {
          isShowEmotions.value = false;
          document.removeEventListener("click", clickOutsideEmotionContainer);
        }
      };
      if (isShowEmotions.value) {
        document.addEventListener("click", clickOutsideEmotionContainer);
      }
    });

    return {
      isDarkMode,
      textInput,
      emotionIcon,
      isShowEmotions,
      handleMouseLeaveEmotionIcon,
      handleClickEmotion,
      handleKeyDownTextInput,
    };
  },
};
</script>

<style>
@import "@assets/style/send_chat_message_form.css";
</style>