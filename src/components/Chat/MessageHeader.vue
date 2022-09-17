<template>
  <div
    class="chat-message-header"
    :class="{ borderDarkModeBottom: isDarkMode }"
  >
    <img
      v-show="chatMessageHeaderAvatar"
      :src="chatMessageHeaderAvatar"
      alt=""
    />
    <span>{{ chatMessageHeaderName }}</span>
  </div>
</template>

<script>
import { isDarkMode } from "@composables/GlobalVariables";
export default {
  name: "MessageHeader",
  props: ["chatMessageHeaderAvatar", "chatMessageHeaderName"],
  setup() {
    return { isDarkMode };
  },
};
</script>
<style scoped>
@import '@assets/style/message_header.css';
</style>