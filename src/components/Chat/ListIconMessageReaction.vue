<template>
  <div
    class="list-icon-message-reaction-container"
    :class="{ receiveMessageListIconReaction: !isSendMessage }"
  >
    <div
      class="icon-item"
      :class="{ iconReacted: iconReacted == icon }"
      v-for="icon in listIconMessageReaction"
      :key="icon"
      @click="handleClickOnIcon(icon, message)"
    >
      <span v-html="icon"></span>
    </div>
    <span class="new-icon" @click="handleClickAddIcon"
      ><i class="fa-solid fa-plus"></i
    ></span>
  </div>
</template>
<script>
import { listIconMessageReaction } from "@composables/CharCodeEmoji";
import {getIconReacted} from '@/composables/IconReacted';
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
export default {
  name: "ListIconMessageReaction",
  props: {
    isSendMessage: {
      type: Boolean,
    },
    message: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const iconReacted = ref("");

    const handleClickOnIcon = (icon, message) => {
      emit("reactionMessage", icon, message);
    };

    const handleClickAddIcon = () => {
      emit("showAllIcon");
    };

    onMounted(() => {
      iconReacted.value = getIconReacted(props.message.reaction)
    });

    return {
      listIconMessageReaction,
      iconReacted,
      handleClickOnIcon,
      handleClickAddIcon,
    };
  },
};
</script>

<style>
.iconReacted {
  background: #0000000f !important;
}

.list-icon-message-reaction-container {
  background: white;
  box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;
  padding: 0.3em;
  border-radius: 100px;
  display: flex;
  align-items: center;
  position: absolute;
  left: -132px;
  top: -55px;
  z-index: 2;
}

.icon-item {
  background: none;
  padding: 0.2em;
  font-size: 1.4em;
  border-radius: 50%;
  cursor: pointer;
}

.icon-item:hover {
  background: #8080802f;
}

.new-icon {
  background: #8080801f;
  font-size: 0.7em;
  width: 27px;
  height: 27px;
  text-align: center;
  display: flex;
  color: #00000057;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin: 0.2em;
}

.new-icon:hover {
  background-color: #8080802f;
}

.receiveMessageListIconReaction {
  left: -75%;
}
</style>
