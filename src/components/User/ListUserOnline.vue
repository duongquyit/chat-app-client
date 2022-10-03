<template>
  <div
    class="chat-message-list-user-connected"
    :class="{ borderDarkModeLeft: isDarkMode }"
  >
    <div
      class="public-chat"
      :class="{ isSelected: itemSelected === 'public-messages' }"
      @click="handleClickPublicChat"
    >
      <span>{{ $t("message.chatType.public") }}</span>
    </div>
    <!-- GROUP CHAT -->
    <div class="group-chat-message">
      <div class="group-chat-message-header">
        <div
          class="group-chat-message-header-title"
          @click="handleClickGroupChat"
        >
          <p>{{ $t("message.chatType.group") }}</p>
          <span
            style="transition: transform 0.5s"
            :class="{ rotateArrow: isShowGroupsChat }"
            ><i class="fa-solid fa-angle-right"></i
          ></span>
        </div>
        <span @click="handleClickAddGroupChatForm">
          <i class="fa-regular fa-square-plus"></i
        ></span>
      </div>
      <div
        class="group-chat-message-body"
        :class="{ showListGroup: isShowGroupsChat }"
      >
        <div
          class="message-group-chat-empty"
          v-if="!listGroupsChatOfCurrentUser.length"
        >
          <p>{{ $t("message.group.groupMessageEmpty") }}</p>
        </div>
        <div
          class="group-chat-message-body-item"
          v-else
          :class="{ isSelected: itemSelected == group.groupChatId }"
          v-for="group in listGroupsChatOfCurrentUser"
          :key="group"
          @click="handleClickSelectGroupChat(group)"
        >
          <img :src="group?.groupChatPhotoURL" alt="" />
          <div class="group-chat-message-body-item-content">
            <p class="group-chat-message-body-item-name">
              {{ group?.groupChatName }}
            </p>
            <span style="padding: 0 0.5em" @click="handleClickGroupSelection">
              <i class="fa-solid fa-ellipsis"></i>
            </span>
            <div
              class="group-chat-selection"
              v-show="
                isShowGroupChatSelection && group.groupChatId == groupIdSelected
              "
            >
              <span @click="handleClickSelectEditGroup(group)">
                {{ $t("message.group.edit") }}
              </span>
              <span @click="handleClickSelectLeaveGroup(group.groupChatId)">
                {{ $t("message.group.leave") }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- LIST USER -->
    <span
      class="list-user-connected-title"
      :class="{ borderDarkModeBottom: isDarkMode }"
    >
      {{ $t("user.listUsersOnline") }}
    </span>
    <div class="list-user">
      <div
        class="user-connected-information"
        :class="{ isSelected: itemSelected == user?.uid }"
        v-for="user in listUsersConnected"
        :key="user.socket"
        draggable="true"
        @click="handleClickSelectUser(user)"
        @dragstart="handleDragStart($event, user)"
      >
        <img :src="user.photoURL" alt="" />
        <span>
          {{
            currentUser.uid == user.uid
              ? `${user.displayName} (${$t("user.currentUser")})`
              : `${user.displayName}`
          }}
        </span>
        <div v-if="user.isOnline" class="user-status-online"></div>
        <div v-else class="user-status-offline"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";

import { isDarkMode } from "@composables/GlobalVariables";
import { listGroupsChatOfCurrentUser } from "@composables/GroupChat";
import { useRoute } from "vue-router";

export default {
  name: "ListUserOnline",
  props: {
    listUsersConnected: {
      type: Array,
    },
    currentUser: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const route = useRoute();
    const isShowGroupsChat = ref(false);

    const itemSelected = ref(route.params.id);

    const isShowGroupChatSelection = ref(false);

    const handleClickPublicChat = () => {
      emit("selectWorldChat");
      itemSelected.value = "public-messages";
    };

    const handleClickGroupChat = () => {
      isShowGroupsChat.value = !isShowGroupsChat.value;
    };

    const handleClickAddGroupChatForm = () => {
      emit("addGroupChatForm");
    };

    const handleClickSelectGroupChat = (group) => {
      emit("selectGroupChat", group);
      itemSelected.value = group.groupChatId;
    };

    const handleClickGroupSelection = () => {
      isShowGroupChatSelection.value = !isShowGroupChatSelection.value;
    };

    const handleClickSelectEditGroup = (group) => {
      emit("selectEdit", group);
      isShowGroupChatSelection.value = false;
    };

    const handleClickSelectLeaveGroup = (groupChatId) => {
      emit("selectLeave", groupChatId);
    };

    const handleClickSelectUser = (user) => {
      emit("selectUser", user);
      itemSelected.value = user.uid;
    };

    const handleDragStart = (event, user) => {
      event.dataTransfer.setData("user", JSON.stringify(user));
    };

    return {
      itemSelected,
      isDarkMode,
      isShowGroupsChat,
      listGroupsChatOfCurrentUser,
      isShowGroupChatSelection,
      handleClickPublicChat,
      handleClickGroupChat,
      handleClickAddGroupChatForm,
      handleClickSelectGroupChat,
      handleClickGroupSelection,
      handleClickSelectEditGroup,
      handleClickSelectLeaveGroup,
      handleClickSelectUser,
      handleDragStart,
    };
  },
};
</script>

<style>
@import "@assets/style/list_user_online.css";
</style>
