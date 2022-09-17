<template>
  <div class="list-icon-wrapper">
    <div class="list-icon">
      <div
        class="icon-item"
        :class="{ iconReacted: icon == iconReacted }"
        v-for="icon in emotionsCode"
        :key="icon"
      >
        <span
          class="icon"
          v-html="icon"
          @click="handleClickIcon(icon, message)"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import { emotionsCode } from "@composables/CharCodeEmoji";
import {getIconReacted} from "@composables/IconReacted";
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
export default {
  name: "ListAllIconMessageReaction",
  props: {
    message: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const iconReacted = ref(null);
    const handleClickIcon = (icon, message) => {
      emit("reactionMessage", icon, message);
    };

    onMounted(() => {
      iconReacted.value = getIconReacted(props.message.reaction);
    });

    return { emotionsCode, iconReacted, handleClickIcon };
  },
};
</script>

<style>
.iconReacted {
  background: #0000000f !important;
}

.list-icon-wrapper {
  position: absolute;
  top: -210px;
  width: 200px;
  height: 200px;
  padding: 0.2em 0 0.2em 0.2em;
  box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;
  border-radius: 5px;
  background: white;
  z-index: 10;
}

.list-icon-wrapper::after {
  content: "";
  position: absolute;
  top: 100%;
  margin-left: -5px;
  border-width: 7px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}

.list-icon {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  overflow: auto;
  justify-content: space-around;
  padding: 0.3em 0.5em;
}

.icon-item {
}

.icon {
}

.chat-message-send .messages-option .list-icon-wrapper {
  right: -30px;
}

.chat-message-send .messages-option .list-icon-wrapper::after {
  left: 77%;
}

.chat-message-receive .messages-option .list-icon-wrapper {
  left: -70px;
}

.chat-message-receive .messages-option .list-icon-wrapper::after {
  left: 45%;
}
</style>