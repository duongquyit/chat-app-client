<template>
  <nav>
    <div
      class="navbar-container"
      :class="{
        borderDarkModeLeft: isDarkMode,
        borderDarkModeRight: isDarkMode,
      }"
    >
      <div class="navbar">
        <ul :class="{ darkMode: isDarkMode }">
          <li>
            <img class="navbar-avatar" :src="currentUser?.photoURL" alt="" />
          </li>
          <li>
            <div class="locale-value" @click="handleShowLocaleChange">
              <span>{{ language.get(locale)[0] }}</span>
              <img :src="language.get(locale)[1]" alt="" />
            </div>
            <LocaleChange
              v-if="isShowLocaleChange"
              :language="language"
              @changeLanguage="handleChangeLanguage"
            />
          </li>
          <li>
            <div
              class="background-mode"
              :class="{ darkModeToggle: isDarkMode }"
              @click="handleClickThemeMode"
            >
              <div
                class="background-mode-option"
                :class="{ darkModeToggleOption: isDarkMode }"
              >
                <span v-if="isDarkMode" class="dark-mode-icon">
                  <i class="fa-solid fa-moon"></i>
                </span>
                <span v-else class="light-mode-icon">
                  <i class="fa-solid fa-sun"></i>
                </span>
              </div>
            </div>
          </li>
          <li>
            <span
              class="nav-bar-item notification-icon"
              @click="handleClickNotificationItem"
            >
              <i class="fa-solid fa-bell"></i>
              <p class="nav-bar-icon-description">
                {{ $t("nav.notification.title") }}
              </p>
              <div v-if="countNotification" class="amount-notification">
                {{ countNotification }}
              </div>
            </span>
            <ListNotification
              v-if="isShowNotification"
              :isDarkMode="isDarkMode"
              :notification="listNotifications"
              @updateSeenStatus="handleUpdateSeenStatus"
            />
          </li>
          <li>
            <span class="nav-bar-item">
              <i class="fa-solid fa-message"></i>
              <p class="nav-bar-icon-description">{{ $t("nav.message") }}</p>
            </span>
          </li>
          <li>
            <span class="nav-bar-item">
              <i class="fa-solid fa-user"></i>
              <p class="nav-bar-icon-description">{{ $t("nav.user") }}</p>
            </span>
          </li>
          <li>
            <span class="nav-bar-item" @click="handleLogout">
              <i class="fa-solid fa-right-from-bracket"></i>
              <p class="nav-bar-icon-description">{{ $t("nav.logout") }}</p>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";

import { isDarkMode } from "@composables/GlobalVariables";
import { listNotifications, updateSeenStatus } from "@composables/Notification";
import { logout } from "@composables/Logout";
import { language } from "@composables/Language";

import ListNotification from "@components/Template/ListNotification.vue";
import LocaleChange from "@components/Template/LocaleChange.vue";

export default {
  name: "TheNavbar",
  props: ["currentUser", "countNotification"],
  components: {
    ListNotification,
    LocaleChange,
  },
  setup() {
    const isShowNotification = ref(false);

    const { locale } = useI18n({});
    const isShowLocaleChange = ref(false);

    const handleShowLocaleChange = () => {
      isShowLocaleChange.value = !isShowLocaleChange.value;
    };

    const handleChangeLanguage = (lang) => {
      locale.value = lang[0];
      isShowLocaleChange.value = false;
    };

    const handleClickThemeMode = () => {
      isDarkMode.value = !isDarkMode.value;
    };

    const handleClickNotificationItem = () => {
      isShowNotification.value = !isShowNotification.value;
    };

    const handleUpdateSeenStatus = (docId) => {
      updateSeenStatus(docId);
    };

    const handleLogout = () => {
      logout();
    };

    watch([isShowNotification, isShowLocaleChange], () => {
      // click outsie notification
      const clickOutsideNotification = (event) => {
        const listNotifications = document.querySelector(".list-notification");
        const notifiIcon = document.querySelector(".notification-icon");
        if (
          !listNotifications?.contains(event.target) &&
          !notifiIcon?.contains(event.target)
        ) {
          isShowNotification.value = false;
          document.removeEventListener("click", clickOutsideNotification);
        }
      };
      if (isShowNotification.value) {
        document.addEventListener("click", clickOutsideNotification);
      }

      // click outside change locale
      const clickOutsideLocaleChange = (event) => {
        const localeValue = document.querySelector(".locale-value");
        const localeChange = document.querySelector(".locale-change");
        if (
          !localeValue?.contains(event.target) &&
          !localeChange?.contains(event.target)
        ) {
          isShowLocaleChange.value = false;
          document.removeEventListener("click", clickOutsideLocaleChange);
        }
      };
      if (isShowLocaleChange.value) {
        document.addEventListener("click", clickOutsideLocaleChange);
      }
    });

    return {
      isDarkMode,
      listNotifications,
      isShowNotification,
      language,
      locale,
      isShowLocaleChange,
      handleChangeLanguage,
      handleShowLocaleChange,
      handleClickThemeMode,
      handleClickNotificationItem,
      handleUpdateSeenStatus,
      handleLogout,
    };
  },
};
</script>

<style>
@import "@assets/style/navbar.css";

.navbar-avatar {
  width: 3em;
  height: 3em;
}
</style>
