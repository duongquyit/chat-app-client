<template>
  <div
    class="messages-option"
    :class="{
      showMessageOption: index == indexMessageReaction && isShowMessageOption
    }"
  >
    <div id="message-emotion" v-if="!messageSend" @click="handleClickIcon">
      <span class="icon-option"><i class="fa-regular fa-face-smile" style="z-index: -1;"></i></span>
    </div>
    <div id="message-option">
      <span><i class="fa-solid fa-ellipsis-vertical"></i></span>
    </div>
    <div id="message-emotion" v-if="messageSend" @click="handleClickIcon">
      <span class="icon-option"><i class="fa-regular fa-face-smile" style="z-index: -1;"></i></span>
    </div>
    <slot name="listIcon"></slot>
  </div>
</template>

<script>
export default {
  name: "MessageOption",
  props: {
    messageSend: {
      type: Boolean,
    },
    isShowMessageOption: {
      type: Boolean,
    },
    index: {
      type: Number,
    },
    indexMessageReaction: {
      type: Number,
    },
  },
  setup(props, { emit }) {
    const handleClickIcon = () => {
      emit("clickIconOption");
    };

    return {
      handleClickIcon,
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