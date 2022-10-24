<template>
  <div
    class="list-users-seen-wrapper"
    :class="{ 'seen-single-item': users.length == 1 }"
    v-if="users.length"
  >
    <div
      class="user-seen-item"
      v-for="user in users.slice(0, 4)"
      :key="user.uid"
    >
      <img :src="user.photoURL" alt="" />
    </div>
    <div class="amount-user-remaining" v-show="users.length > 4">
      <p>+{{ users.length - 4 }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListUserSeen",
  props: {
    users: {
      type: Array,
    },
  },
};
</script>

<style>
.list-users-seen-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row-reverse;
  width: 100%;
  padding-top: 5px;
  transform: translateX(10px);
}

.message-receive-item .list-users-seen-wrapper {
  transform: translateX(58px);
}

.seen-single-item {
  width: 14px;
  position: absolute;
  bottom: 2px;
  right: -2px;
}

.user-seen-item {
  width: 14px;
  height: 14px;
  padding: 0 1px;
}

.list-users-seen-wrapper .user-seen-item img {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.amount-user-remaining {
  font-size: 10px;
  background: #80808029;
  border-radius: 20px;
  color: gray;
  padding: 1px 5px;
  font-weight: 700;
}
</style>
