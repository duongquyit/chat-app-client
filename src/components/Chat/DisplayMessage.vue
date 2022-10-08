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
                :messageId="message.messageId"
                :currentMessageId="currentMessageId"
                @clickIconOption="handleShowListIcon"
                @clickShowRemoveMessage="handleShowRemoveMessage"
              >
                <template v-slot:removeMessage>
                  <div
                    class="message-option-remove-message"
                    :class="{
                      'd-block':
                        isShowRemoveMessageOption &&
                        message.messageId === currentMessageId,
                    }"
                    @click="
                      handleClickSelectMessageRemove({
                        chatType: message.chatType,
                        messageId: message.messageId,
                        chatPrivateId: message.chatPrivateId,
                        senderId: messageData.sender.uid,
                      })
                    "
                  >
                    Remove
                  </div>
                </template>
                <template v-slot:listIcon>
                  <ListIconMessageReaction
                    v-if="
                      !isShowAllIcon &&
                      currentMessageId == message.messageId &&
                      !isShowRemoveMessageOption
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
                      isShowAllIcon &&
                      message.messageId == currentMessageId &&
                      !isShowRemoveMessageOption
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
                <span class="text-message-remove" v-if="message.isRemoved"
                  ><i>{{ $t("message.messageRemove") }}</i></span
                >
                <span
                  v-else
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
          <img :src="messageData.sender.photoURL" />
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
                <span class="text-message-remove" v-if="message.isRemoved"
                  ><i>{{ $t("message.messageRemove") }}</i></span
                >
                <span
                  v-else
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
                <div class="list-reaction" v-show="message.reaction?.length">
                  <span
                    v-for="icon in message.reaction"
                    :key="icon"
                    v-html="icon.icon"
                  ></span>
                </div>
              </div>
              <MessageOption
                :messageSend="false"
                :messageId="message.messageId"
                :currentMessageId="currentMessageId"
                @clickIconOption="handleShowListIcon"
                @clickShowRemoveMessage="handleShowRemoveMessage"
              >
                <template v-slot:listIcon>
                  <ListIconMessageReaction
                    v-if="
                      message.messageId == currentMessageId &&
                      !isShowAllIcon &&
                      !isShowRemoveMessageOption
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
                      message.messageId == currentMessageId &&
                      isShowAllIcon &&
                      !isShowRemoveMessageOption
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
      <ListUserSeen />
    </div>
    <!-- chat input form -->
    <slot name="chatForm" :chatScrollBar="chatScrollBar"> </slot>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { nextTick, onMounted, watch } from "@vue/runtime-core";

import { isDarkMode } from "@composables/GlobalVariables";
import {
  messageReaction,
  amountMessages,
  removeMessage,
} from "@composables/ChatMessage";
import { clickOutsideListEmotion } from "../../services/ClickOutside";
import currentUser from "@/composables/CurrentUser";

import MessageOption from "@components/Chat/MessageOption.vue";
import ListIconMessageReaction from "@components/Chat/ListIconMessageReaction.vue";
import ListAllIconMessageReaction from "@components/Chat/ListAllIconMessageReaction.vue";
import ListUserSeen from "@components/Chat/ListUserSeen";

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
    ListUserSeen,
  },
  setup() {
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

    const handleClickSelectMessageRemove = (message) => {
      removeMessage(currentUser.uid, message);
    };

    const isShowRemoveMessageOption = ref(false);
    const handleShowRemoveMessage = (messageId) => {
      currentMessageId.value =
        currentMessageId.value == messageId ? "" : messageId;
      isShowRemoveMessageOption.value = !isShowRemoveMessageOption.value;
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
      isShowRemoveMessageOption,
      handleShowListIcon,
      handleReactionMessage,
      handleShowAllIcon,
      checkContainReaction,
      handleClickSelectMessageRemove,
      handleShowRemoveMessage,
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

.message-option-remove-message {
  font-size: 0.7em;
  background: white;
  border-radius: 5px;
  position: absolute;
  bottom: -20px;
  z-index: 3;
  padding: 0.5em;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  cursor: pointer;
  display: none;
}

.text-message-remove {
  font-size: 0.9em;
  padding: 0.5em 1em;
  border: 1px solid #8080806b;
  border-radius: 100px;
  font-family: system-ui;
  color: gray;
}

.d-block {
  display: block !important;
}
</style>
