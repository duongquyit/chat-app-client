<template>
  <div class="chat-message-list-message">
    <div class="chat-message-show-message" ref="chatScrollBar">
      <div class="message" v-for="(message, index) in messages" :key="index">
        <div
          class="chat-message-send"
          v-if="message.sender.uid == currentUser?.uid"
        >
          <MessageOption
            :messageSend="true"
            :isShowMessageOption="isShowMessageOption"
            :index="index"
            :indexMessageReaction="indexMessageReaction"
            @clickIconOption="handleShowListIcon(index)"
          >
            <template v-slot:listIcon>
              <ListIconMessageReaction
                v-if="!isShowAllIcon && indexMessageReaction == index"
                :isSendMessage="true"
                :message="{
                  chatType: message.chatType,
                  messageId: message.messageId,
                  reaction: message.reaction,
                  chatPrivateId: message.chatPrivateId,
                }"
                @reactionMessage="handleReactionMessage"
                @showAllIcon="handleShowAllIcon"
              />
              <ListAllIconMessageReaction
                v-if="isShowAllIcon && index == indexMessageReaction"
                :message="{
                  chatType: message.chatType,
                  messageId: message.messageId,
                  reaction: message.reaction,
                  chatPrivateId: message.chatPrivateId,
                }"
                @reactionMessage="handleReactionMessage"
              />
            </template>
          </MessageOption>

          <div class="text-message">
            <span class="text-message-send" v-html="message.message"> </span>
            <div class="message-tooltip tooltip-send" v-if="message?.createdAt">
              {{ $d(message?.createdAt?.toDate(), "long") }}
            </div>
            <div class="list-reaction" v-show="message?.reaction?.length">
              <span
                v-for="icon in message.reaction"
                :key="icon"
                v-html="icon.icon"
              ></span>
            </div>
          </div>
        </div>
        <div class="chat-message-receive" v-else>
          <img :src="message.sender.photoURL" alt="" />
          <div class="text-message">
            <span class="text-message-receive" v-html="message.message"> </span>
            <div
              class="message-tooltip tooltip-receive"
              v-if="message?.createdAt"
            >
              {{ $d(message?.createdAt?.toDate(), "long") }}
            </div>
            <div class="list-reaction" v-show="message?.reaction?.length">
              <span
                v-for="icon in message.reaction"
                :key="icon"
                v-html="icon.icon"
              ></span>
            </div>
          </div>
          <MessageOption
            :messageSend="false"
            :isShowMessageOption="isShowMessageOption"
            :index="index"
            :indexMessageReaction="indexMessageReaction"
            @clickIconOption="handleShowListIcon(index)"
          >
            <template v-slot:listIcon>
              <ListIconMessageReaction
                v-if="indexMessageReaction == index && !isShowAllIcon"
                :isSendMessage="false"
                :message="{
                  chatType: message.chatType,
                  messageId: message.messageId,
                  reaction: message.reaction,
                  chatPrivateId: message.chatPrivateId,
                }"
                @reactionMessage="handleReactionMessage"
                @showAllIcon="handleShowAllIcon"
              />
              <ListAllIconMessageReaction
                v-if="indexMessageReaction == index && isShowAllIcon"
                :message="{
                  chatType: message.chatType,
                  messageId: message.messageId,
                  reaction: message.reaction,
                  chatPrivateId: message.chatPrivateId,
                }"
                @reactionMessage="handleReactionMessage"
              />
            </template>
          </MessageOption>
        </div>
      </div>
    </div>
    <!-- chat input form -->
    <slot name="chatForm" :chatScrollBar="chatScrollBar"> </slot>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { nextTick, onMounted, watch } from "@vue/runtime-core";

import { isDarkMode } from "@composables/GlobalVariables";
import { messageReaction } from "@composables/ChatMessage";
import { clickOutsideListEmotion } from "../../services/ClickOutside";

import MessageOption from "@components/Chat/MessageOption.vue";
import ListIconMessageReaction from "@components/Chat/ListIconMessageReaction.vue";
import ListAllIconMessageReaction from "@components/Chat/ListAllIconMessageReaction.vue";

export default {
  name: "DisplayMessage",
  props: {
    messages: {
      type: Array,
    },
    currentUser: {
      type: Object,
    },
  },
  components: {
    MessageOption,
    ListIconMessageReaction,
    ListAllIconMessageReaction,
  },
  setup(props) {
    const chatScrollBar = ref(null);
    const isShowListIcon = ref(false);
    const isShowMessageOption = ref(false);
    const indexMessageReaction = ref(null);

    const handleReactionMessage = (
      icon,
      { messageId, chatType, chatPrivateId }
    ) => {
      const { displayName, uid, photoURL } = JSON.parse(
        localStorage.getItem("auth")
      );
      messageReaction({
        chatType,
        messageId,
        iconReaction: icon,
        chatPrivateId,
        userReaction: { displayName, uid, photoURL },
      });
      isShowListIcon.value = false;
      isShowMessageOption.value = false;
      indexMessageReaction.value = null;
    };

    const clickOutsideListIcon = (event) => {
      clickOutsideListEmotion({
        event: event,
        elementOne: ".list-icon-message-reaction-container",
        elementTwo: "#message-emotion",
        count,
        isShowListIcon: isShowListIcon,
        isShowOption: isShowMessageOption,
        messageIndex: indexMessageReaction,
        callback: clickOutsideListIcon,
      });
    };

    let count = ref(0);
    const clickOutsideAllIcon = (event) => {
      count.value++;
      clickOutsideListEmotion({
        event: event,
        elementOne: ".list-icon-wrapper",
        elementTwo: "#message-emotion",
        count,
        isShowListIcon: isShowAllIcon,
        isShowOption: isShowMessageOption,
        messageIndex: indexMessageReaction,
        callback: clickOutsideAllIcon,
      });
    };

    const isShowAllIcon = ref(false);
    const handleShowAllIcon = () => {
      isShowAllIcon.value = true;
      isShowListIcon.value = false;
      document.addEventListener("click", clickOutsideAllIcon);
      document.removeEventListener("click", clickOutsideListIcon);
    };

    const handleShowListIcon = (index) => {
      isShowAllIcon.value = false;
      count.value = 0;
      document.removeEventListener("click", clickOutsideAllIcon);
      if (index != indexMessageReaction.value) {
        isShowMessageOption.value = true;
        isShowListIcon.value = true;
        indexMessageReaction.value = index;
        return;
      }
      isShowMessageOption.value = false;
      isShowListIcon.value = false;
      indexMessageReaction.value = null;
    };

    // watch change of messages
    watch(
      () => props.messages,
      async () => {
        // await DOM updated then scroll bar to bottom
        await nextTick();
        chatScrollBar.value.scrollTop = chatScrollBar.value.scrollHeight;
      }
    );

    watch(isShowListIcon, () => {
      if (isShowListIcon.value) {
        document.addEventListener("click", clickOutsideListIcon);
      }
    });

    onMounted(() => {
      // set scroll bar auto bottom when mounted
      chatScrollBar.value.scrollTop = chatScrollBar.value.scrollHeight;
    });

    return {
      chatScrollBar,
      isDarkMode,
      isShowListIcon,
      isShowMessageOption,
      indexMessageReaction,
      isShowAllIcon,
      handleShowListIcon,
      handleReactionMessage,
      handleShowAllIcon,
    };
  },
};
</script>

<style>
@import "@assets/style/display_message.css";

.chat-message-send > .text-message .list-reaction,
.chat-message-receive > .text-message .list-reaction {
  position: absolute;
  bottom: -10px;
  font-size: 0.8em;
  display: flex;
  padding: 1px;
  border-radius: 100px;
  z-index: 2;
  background: #fff;
  cursor: pointer;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.chat-message-send > .text-message .list-reaction {
  right: 10px;
}

.chat-message-receive > .text-message .list-reaction {
  left: 70%;
}
</style>
