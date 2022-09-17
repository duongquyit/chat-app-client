<template>
  <div class="list-notification" :class="{ darkMode: isDarkMode }">
    <h3 class="notification-title">{{ $t("nav.notification.title") }}</h3>
    <div class="notification-message-no-item" v-if="!notification.length">
      <p>{{ $t("nav.notification.messageEmpty") }}</p>
    </div>
    <div
      v-else
      class="notification-item"
      :class="{ isUnseen: !notificationItem.isSeen }"
      v-for="notificationItem in notification"
      :key="notificationItem"
      @click="handleClickNotificationItem(notificationItem.docId)"
    >
      <img :src="notificationItem.sender.photoURL" alt="" />
      <div class="notification-message-container">
        <span>
          {{ $t("nav.notification.message") }}
          {{ notificationItem.sender.displayName }}
        </span>
        <span class="notification-time-momment">
          {{ timeSince(notificationItem.createdAt) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { timeSince } from "@composables/TimeFormart";
export default {
  name: "ListNotification",
  props: ["isDarkMode", "notification"],
  setup(props, { emit }) {
    const handleClickNotificationItem = (notiId) => {
      emit("updateSeenStatus", notiId);
    };
    return { timeSince, handleClickNotificationItem };
  },
};
</script>

<style>
@import "@assets/style/list_notification.css";
</style>