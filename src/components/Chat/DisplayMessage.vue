<template>
  <div class="chat-message-list-message">
    <div class="chat-message-show-message" ref="chatScrollBar">
      <div
        class="message"
        v-for="(messageData, index) in messages"
        :key="index"
      >
        <div
          class="chat-message-send"
          v-if="messageData.sender.uid == currentUser?.uid"
        >
          <div class="message-text-wrapper">
            <div
              class="text-message message-send-item"
              :class="{
                'container-reaction': checkContainReaction(message.reaction),
              }"
              v-for="(message, index) in messageData.messages"
              :key="message.messageId"
            >
              <MessageOption
                :messageSend="true"
                :isShowMessageOption="isShowMessageOption"
                :messageId="message.messageId"
                :currentMessageId="currentMessageId"
                @clickIconOption="handleShowListIcon"
              >
                <template v-slot:listIcon>
                  <ListIconMessageReaction
                    v-if="
                      !isShowAllIcon && currentMessageId == message.messageId
                    "
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
                    v-if="
                      isShowAllIcon && message.messageId == currentMessageId
                    "
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
              <div class="text">
                <div
                  class="message-tooltip tooltip-send"
                  v-if="message.createdAt"
                >
                  {{ $d(message?.createdAt?.toDate(), "long") }}
                </div>
                <span
                  class="text-message-send"
                  :class="{
                    'message-send-item-first':
                      index == 0 && messageData.messages.length > 1,
                    'message-send-item-last':
                      index == messageData.messages.length - 1 &&
                      messageData.messages.length > 1,
                    'message-send-item-only-one':
                      messageData.messages.length == 1,
                  }"
                  v-html="message.message"
                >
                </span>

                <div class="list-reaction" v-show="message.reaction?.length">
                  <span
                    v-for="icon in message.reaction"
                    :key="icon"
                    v-html="icon.icon"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- message receive -->
        <div class="chat-message-receive" v-else>
          <img
            v-show="messageData.sender.photoURL"
            :src="messageData.sender.photoURL"
            alt=""
          />
          <div class="message-text-wrapper">
            <div
              class="text-message message-receive-item"
              :class="{
                'container-reaction': checkContainReaction(message.reaction),
              }"
              v-for="(message, index) in messageData.messages"
              :key="message.messageId"
            >
              <div class="text">
                <span
                  class="text-message-receive"
                  :class="{
                    'message-item-first':
                      index == 0 && messageData.messages.length > 1,
                    'message-item-last':
                      index == messageData.messages.length - 1 &&
                      messageData.messages.length > 1,
                    'message-item': messageData.messages.length == 1,
                  }"
                  v-html="message.message"
                >
                </span>
                <div class="message-tooltip tooltip-receive">
                  {{ $d(message.createdAt?.toDate(), "long") }}
                </div>
                <div class="list-reaction" v-if="message.reaction?.length">
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
                :messageId="message.messageId"
                :currentMessageId="currentMessageId"
                @clickIconOption="handleShowListIcon"
              >
                <template v-slot:listIcon>
                  <ListIconMessageReaction
                    v-if="
                      message.messageId == currentMessageId && !isShowAllIcon
                    "
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
                    v-else-if="
                      message.messageId == currentMessageId && isShowAllIcon
                    "
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
import { messageReaction, amountMessages } from "@composables/ChatMessage";
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
    const currentMessageId = ref("");
    const currentOption = ref(null);

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
      currentMessageId.value = "";
      currentOption.value = null;
    };

    const clickOutsideListIcon = (event) => {
      clickOutsideListEmotion({
        event: event,
        elementOne: ".list-icon-message-reaction-container",
        elementTwo: currentOption.value,
        count,
        isShowListIcon: isShowListIcon,
        currentMessageId: currentMessageId,
        messageIndex: indexMessageReaction,
        callback: clickOutsideListIcon,
      });
    };

    const isShowAllIcon = ref(false);
    let count = ref(0);
    const clickOutsideAllIcon = (event) => {
      count.value++;
      clickOutsideListEmotion({
        event: event,
        elementOne: ".list-icon-wrapper",
        elementTwo: currentOption.value,
        count,
        isShowListIcon: isShowAllIcon,
        currentMessageId: currentMessageId,
        messageIndex: indexMessageReaction,
        callback: clickOutsideAllIcon,
      });
    };

    const handleShowAllIcon = () => {
      isShowAllIcon.value = true;
      isShowListIcon.value = false;
      document.addEventListener("click", clickOutsideAllIcon);
      document.removeEventListener("click", clickOutsideListIcon);
    };

    const handleShowListIcon = (messageId, optionElement) => {
      isShowAllIcon.value = false;
      count.value = 0;
      document.removeEventListener("click", clickOutsideAllIcon);
      if (messageId != currentMessageId.value) {
        isShowMessageOption.value = true;
        isShowListIcon.value = true;
        currentMessageId.value = messageId;
        currentOption.value = optionElement;
        return;
      }
      isShowMessageOption.value = false;
      isShowListIcon.value = false;
      currentMessageId.value = "";
      currentOption.value = null;
    };

    const checkContainReaction = (reaction) => {
      return reaction && reaction.length ? true : false;
    };

    // watch change of messages
    watch(amountMessages, async () => {
      // await DOM updated then scroll bar to bottom
      await nextTick();
      chatScrollBar.value.scrollTop = chatScrollBar.value.scrollHeight;
    });

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
      currentMessageId,
      indexMessageReaction,
      isShowAllIcon,
      handleShowListIcon,
      handleReactionMessage,
      handleShowAllIcon,
      checkContainReaction,
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

.container-reaction {
  margin-bottom: 0.8em;
}
</style>
