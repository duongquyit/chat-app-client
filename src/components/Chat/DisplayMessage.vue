<template>
  <div class="chat-message-list-message">
    <div
      class="loading-limit-message-wrapper"
      :class="{ 'd-block': loadingNewMessage }"
    >
      <img :src="loadingImage" alt="" />
    </div>
    <div
      class="chat-message-show-message"
      @scroll="handleScrollBoxMessage"
      ref="chatScrollBar"
    >
      <div
        class="message"
        v-for="(messageData, index) in messages.get(`${chatMessagesKey}`)
          ?.messages"
        :key="index"
      >
        <div
          class="chat-message-send"
          v-if="
            messageData.sender.uid == currentUser?.uid &&
            messageData.messages.length
          "
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
              <ListUserSeen :users="listUsersSeen(message.messageId)" />
            </div>
          </div>
        </div>
        <!-- message receive -->
        <div
          class="chat-message-receive"
          v-else-if="
            messageData.sender.uid != currentUser?.uid &&
            messageData.messages.length
          "
        >
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
              <ListUserSeen :users="listUsersSeen(message.messageId)" />
            </div>
          </div>
        </div>
      </div>
      <TextTyping
        v-if="listUsersTying.length && roomKey === chatMessagesKey"
        :users="listUsersTying"
      />
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
  removeMessage,
  lastMessageId,
} from "@composables/ChatMessage";
import { clickOutsideListEmotion } from "../../services/ClickOutside";
import currentUser from "@/composables/CurrentUser";
import { seenStatus } from "@/composables/SeenMessageStatus";
import {
  messages,
  LIMIT_MESSAGE,
  getPublicChatMessage,
  getPrivateChatMessage,
  getGroupChatMessage,
} from "@/composables/ChatMessage";
import debounce from "@/composables/debounce";
import { socket } from "@/plugins/socket";

import MessageOption from "@components/Chat/MessageOption.vue";
import ListIconMessageReaction from "@components/Chat/ListIconMessageReaction.vue";
import ListAllIconMessageReaction from "@components/Chat/ListAllIconMessageReaction.vue";
import ListUserSeen from "@components/Chat/ListUserSeen";
import TextTyping from "@components/Chat/TextTyping.vue";

// loading image import
import loadingImage from "@/assets/images/Rolling-1s-200px.gif";

export default {
  name: "DisplayMessage",
  props: {
    chatMessagesKey: {
      type: String,
    },
    isChatPrivate: {
      type: Boolean,
    },
    isChatGroup: {
      type: Boolean,
    },
  },
  components: {
    MessageOption,
    ListIconMessageReaction,
    ListAllIconMessageReaction,
    ListUserSeen,
    TextTyping,
  },
  setup(props) {
    const chatScrollBar = ref(null);
    const isShowListIcon = ref(false);
    const isShowMessageOption = ref(false);
    const indexMessageReaction = ref(null);
    const currentMessageId = ref("");
    const currentOption = ref(null);

    // handle reaction message
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

    // handle seen message
    const listUsersSeen = (messageId) => {
      const users = [];
      seenStatus.value.get(props.chatMessagesKey)?.forEach((item) => {
        if (item.messageId === messageId && item.user.uid != currentUser.uid) {
          users.push(item.user);
        }
      });
      return users;
    };

    // handle scroll
    const loadingNewMessage = ref(false);
    const limitCount = ref(1);
    const handleScrollBoxMessage = (e) => {
      const timeDelay = 1000;
      loadingNewMessage.value = false;
      debounce(timeDelay, () => {
        if (e.target.scrollTop === 0) {
          loadingNewMessage.value = true;
          const { amountMessages } = messages.value.get(props.chatMessagesKey);
          limitCount.value =
            Math.round(amountMessages / LIMIT_MESSAGE - 0.5) + 1;
          if (!props.isChatPrivate) {
            getPublicChatMessage(limitCount.value);
          } else {
            if (props.isChatGroup) {
              getGroupChatMessage(props.chatMessagesKey, limitCount.value);
              return;
            }
            getPrivateChatMessage(props.chatMessagesKey, limitCount.value);
          }
        }
      });
    };

    // watch change of messages
    watch(lastMessageId, async () => {
      // await DOM updated then scroll bar to bottom
      await nextTick();
      chatScrollBar.value.scrollTop = chatScrollBar.value.scrollHeight;
    });

    watch(isShowListIcon, () => {
      if (isShowListIcon.value) {
        document.addEventListener("click", clickOutsideListIcon);
      }
    });

    watch(
      messages,
      async (newVal) => {
        if (newVal.get(props.chatMessagesKey).amountMessages > LIMIT_MESSAGE) {
          const currentPositon = chatScrollBar.value.scrollHeight;
          await nextTick();
          chatScrollBar.value.scrollTop =
            chatScrollBar.value.scrollHeight - currentPositon;
        }
      },
      { deep: true }
    );

    watch(
      () => props.chatMessagesKey,
      async () => {
        limitCount.value = 1;
        await nextTick();
        chatScrollBar.value.scrollTop = chatScrollBar.value.scrollHeight;
      }
    );

    watch(
      [limitCount, loadingNewMessage],
      ([newLimitVal, newLoadVal], [oldLimitval, oldLoadVal]) => {
        if (newLimitVal === oldLimitval) {
          loadingNewMessage.value = false;
        }
      }
    );

    const roomKey = ref(null);
    const listUsersTying = ref([]);
    onMounted(() => {
      // set scroll bar auto bottom when mounted
      chatScrollBar.value.scrollTop = chatScrollBar.value.scrollHeight;

      // socket
      socket.on("listUsersTyping", (listUsers, room) => {
        roomKey.value = room;
        listUsersTying.value = listUsers;
        console.log(props.chatMessagesKey == roomKey.value);
      });
    });

    return {
      seenStatus,
      messages,
      currentUser,
      chatScrollBar,
      currentMessageId,
      checkContainReaction,
      roomKey,
      listUsersTying,
      listUsersSeen,
      loadingImage,
      loadingNewMessage,
      isDarkMode,
      isShowListIcon,
      isShowMessageOption,
      indexMessageReaction,
      isShowAllIcon,
      isShowRemoveMessageOption,
      handleShowListIcon,
      handleReactionMessage,
      handleShowAllIcon,
      handleClickSelectMessageRemove,
      handleShowRemoveMessage,
      handleScrollBoxMessage,
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

.loading-limit-message-wrapper {
  position: absolute;
  width: calc(100% - 0.5em);
  height: 4em;
  top: 0;
  padding: 0.5em;
  display: none;
}

.loading-limit-message-wrapper img {
  width: 3em;
  height: 3em;
}
</style>
