<template>
  <div
    class="messages-option"
    :class="{
      showMessageOption: messageId == currentMessageId,
    }"
    ref="optionElement"
  >
    <div
      id="message-emotion"
      v-if="!messageSend"
      @click="handleClickIcon(messageId, optionElement)"
    >
      <span class="icon-option"
        ><i class="fa-regular fa-face-smile" style="z-index: -1"></i
      ></span>
    </div>
    <div id="message-option" @click="handleClickShowRemoveMessage(messageId)">
      <span><i class="fa-solid fa-ellipsis-vertical"></i></span>
      <slot name="removeMessage"></slot>
    </div>
    <div
      id="message-emotion"
      v-if="messageSend"
      @click="handleClickIcon(messageId, optionElement)"
    >
      <span class="icon-option"
        ><i class="fa-regular fa-face-smile" style="z-index: -1"></i
      ></span>
    </div>
    <slot name="listIcon"></slot>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
  name: "MessageOption",
  props: {
    messageSend: {
      type: Boolean,
    },
    messageId: {
      type: String,
    },
    currentMessageId: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const optionElement = ref(null);

    const handleClickIcon = (messageId, optionElement) => {
      emit("clickIconOption", messageId, optionElement);
    };

    const handleClickShowRemoveMessage = (messageId) => {
      emit("clickShowRemoveMessage", messageId);
    };

    return {
      optionElement,
      handleClickIcon,
      handleClickShowRemoveMessage,
    };
  },
};
</script>

<style>
.showMessageOption {
  display: flex !important;
}

.message-emotion {
  z-index: 20;
}
</style>
