<template>
  <form
    class="create-new-group-chat-form"
    :class="{ darkMode: isDarkMode }"
    @submit.prevent="handleSubmitGroupChatForm"
  >
    <span
      style="text-align: right; color: #ff2f00; font-size: 1.2em"
      @click="handleCloseGroupChatForm"
    >
      <i class="fa-solid fa-circle-xmark"></i>
    </span>
    <div class="create-new-group-chat-form-infor">
      <!-- GROUP CHAT NAME -->
      <p>{{ $t("message.group.groupName") }}</p>
      <!-- show input group chat name when form is create -->
      <input
        v-if="create"
        :class="{ darkMode: isDarkMode }"
        type="text"
        v-model="groupChatName"
      />
      <!-- update template -->
      <span v-if="!create" class="group-chat-name">
        <p v-if="!isEditGroupChatName">{{ groupChatName }}</p>
        <input
          v-else
          type="text"
          @keydown.enter="handleKeydownInput"
          v-model="groupChatName"
        />
        <span class="edit-group-chat-name-icon" @click="handleClickEditIcon">
          <span v-if="!isEditGroupChatName">
            <i class="fa-solid fa-pen"></i>
          </span>
          <span v-else>
            <i class="fa-solid fa-xmark"></i>
          </span>
        </span>
      </span>
      <!-- IMAGE GROUP CHAT -->
      <p>{{ $t("message.group.groupImage") }}</p>
      <input
        style="display: none"
        type="file"
        id="groupChatImageFile"
        @change="handleUploadImageGroup"
      />
      <label
        class="new-group-chat-form-upload-image"
        for="groupChatImageFile"
        @dragstart.prevent=""
        @dragover.prevent=""
        @drop.prevent="handleUploadImageGroup"
      >
        <span
          v-if="!groupChatPhotoURL"
          style="font-size: 2em; color: #80808082"
        >
          <i class="fa-solid fa-plus"></i>
        </span>
        <img v-else :src="groupChatPhotoURL" alt="" />
      </label>
    </div>
    <!-- GROUP CHAT LIST USER -->
    <p style="text-align: left; font-size: 1.1em">
      {{ $t("message.group.groupMembers") }}
    </p>
    <div
      class="create-new-group-chat-form-member"
      @dragover.prevent=""
      @drop="handleDropUser"
      ref="listUsersDropScroll"
    >
      <p v-if="!listUsersDrop.length" class="message-list-drop-user-empty">
        {{ $t("message.group.groupMembersDropMessage") }}
      </p>
      <div
        class="create-new-group-chat-form-member-item"
        v-else
        v-for="user in listUsersDrop"
        :key="user.uid"
      >
        <img :src="user.photoURL" alt="" />
        <p>{{ user.displayName }}</p>
        <span
          class="remove-user-out-list-member-icon"
          @click="handleRemoveUserOutListUserDrop(user)"
          >&times;</span
        >
      </div>
    </div>
    <button
      class="new-group-chat-submit-btn"
      :class="{ notAllowSubmitButton: !groupChatName || !listUsersDrop.length }"
      v-show="create"
      type="submit"
      :disabled="!groupChatName || !listUsersDrop.length"
    >
      {{ $t("message.group.groupCreateBtn") }}
    </button>
  </form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { nextTick, watch } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";

import { uploadImageToCloud, isPending } from "@composables/UploadImage";
import { updateGroupChat } from "@composables/GroupChat";
import { toast } from "@composables/ToastMessage";
import { isDarkMode } from "@composables/GlobalVariables";
import currentUser from "@composables/CurrentUser";

export default {
  name: "GroupChatForm",
  props: ["create", "group"],
  setup(props, { emit }) {
    const listUsersDropScroll = ref(null);
    const groupChatName = ref(props?.group?.groupChatName || "");
    const listUsersDrop = ref(props?.group?.members || []);
    const groupChatPhotoURL = ref(props?.group?.groupChatPhotoURL || "");
    const isEditGroupChatName = ref(false);

    const { t } = useI18n();

    const handleSubmitGroupChatForm = () => {
      if (listUsersDrop.value.length < 1) {
        toast.error(t("toast.notEnoughMembers"));
        return;
      }
      emit(
        "createGroupChat",
        listUsersDrop.value,
        currentUser,
        groupChatName.value,
        groupChatPhotoURL.value
      );
    };

    const handleKeydownInput = () => {
      if (!groupChatName.value.trim()) {
        toast.error(t("toast.nameBlank"));
        return;
      }
      if (groupChatName.value != props.group.groupChatName) {
        emit("updateGroupChatName", groupChatName.value);
        isEditGroupChatName.value = false;
        return;
      }
      isEditGroupChatName.value = true;
    };

    const handleCloseGroupChatForm = () => {
      emit("closeGroupChatForm");
    };

    const handleClickEditIcon = () => {
      if (
        isEditGroupChatName.value &&
        groupChatName.value != props.group.groupChatName
      ) {
        groupChatName.value = props.group.groupChatName;
      }
      isEditGroupChatName.value = !isEditGroupChatName.value;
    };

    // handle upload group chat photo
    const handleUploadImageGroup = async (evt) => {
      const imgFile = evt?.dataTransfer?.files[0] || evt?.target?.files[0];
      if (imgFile) {
        const { secure_url } = await uploadImageToCloud(imgFile);
        groupChatPhotoURL.value = secure_url;

        // handle when update form
        if (!props.create) {
          updateGroupChat({
            groupChatId: props.group.groupChatId,
            groupChatName: groupChatName.value,
            groupChatPhotoURL: secure_url,
            members: listUsersDrop.value,
          });
        }
      }
    };

    // drag and drop user
    const handleDropUser = (e) => {
      const userDrop = JSON.parse(e.dataTransfer.getData("user"));
      const userDropExist = listUsersDrop.value.find(
        ({ uid }) => uid == userDrop.uid
      );
      if (!userDropExist && userDrop.uid != currentUser.uid) {
        listUsersDrop.value.push(userDrop);

        // handle when update form
        if (!props.create) {
          updateGroupChat({
            groupChatId: props.group.groupChatId,
            groupChatName: groupChatName.value,
            groupChatPhotoURL: groupChatPhotoURL.value,
            members: listUsersDrop.value,
          });
        }
        return;
      }
      toast.error(t("toast.existsUser"));
    };

    // remove user from list user droped
    const handleRemoveUserOutListUserDrop = (user) => {
      const index = listUsersDrop.value.findIndex(({ uid }) => uid == user.uid);
      if (listUsersDrop.value.length <= 2) {
        toast.error(t("toast.notEnoughMembers"));
        return;
      }
      // handle when update form
      if (!props.create) {
        if (currentUser.uid != props.group.creator.uid) {
          toast.error(t("toast.bossConfirm"));
          return;
        }
        listUsersDrop.value.splice(index, 1);
        updateGroupChat({
          groupChatId: props.group.groupChatId,
          groupChatName: groupChatName.value,
          groupChatPhotoURL: groupChatPhotoURL.value,
          members: listUsersDrop.value,
        });
        return;
      }
      // handle when create format
      listUsersDrop.value.splice(index, 1);
    };

    watch(
      listUsersDrop,
      async () => {
        await nextTick();
        listUsersDropScroll.value.scrollTop =
          listUsersDropScroll.value.scrollHeight;
      },
      { deep: true }
    );

    return {
      listUsersDrop,
      groupChatName,
      currentUser,
      listUsersDropScroll,
      groupChatPhotoURL,
      isPending,
      isEditGroupChatName,
      isDarkMode,
      handleSubmitGroupChatForm,
      handleKeydownInput,
      handleCloseGroupChatForm,
      handleClickEditIcon,
      handleUploadImageGroup,
      handleDropUser,
      handleRemoveUserOutListUserDrop,
    };
  },
};
</script>

<style>
@import "@assets/style/group_chat_form.css";
</style>
