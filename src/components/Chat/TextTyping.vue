<template>
  <div class="text-typing-wrapper">
    <div class="list-users-typing-wrapper">
      <div class="user-item" v-for="user in users" :key="user.uid">
        <img :src="user.photoURL" alt="" />
      </div>
    </div>
    <div class="typing-animation">
      <div class="dots-3"></div>
    </div>
  </div>
</template>

<script>
import typingAnimation from "@assets/images/typing-animation.gif";

export default {
  name: "TextTyping",
  props: {
    users: {
      type: Array,
    },
  },
  setup() {
    return { typingAnimation };
  },
};
</script>

<style>
.text-typing-wrapper {
  text-align: left;
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.list-users-typing-wrapper {
  display: flex;
  flex-direction: row-reverse;
}

.user-item:not(:last-child) {
  margin-left: -8px;
}

.list-users-typing-wrapper img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.typing-animation {
  padding: 6px 8px;
  background: #e4e6ebb0;
  border-radius: 20px;
  margin-left: 4px;
}

.typing-animation img {
}

.dots-3 {
  width: 32px;
  aspect-ratio: 2;
  --_g: no-repeat radial-gradient(circle closest-side, #0000004f 90%, #0000);
  background: var(--_g) 0% 50%, var(--_g) 50% 50%, var(--_g) 100% 50%;
  background-size: calc(100% / 3) 50%;
  animation: d3 1.2s infinite linear;
}
@keyframes d3 {
  20% {
    background-position: 0% 0%, 50% 50%, 100% 50%;
  }
  40% {
    background-position: 0% 100%, 50% 0%, 100% 50%;
  }
  60% {
    background-position: 0% 50%, 50% 100%, 100% 0%;
  }
  80% {
    background-position: 0% 50%, 50% 50%, 100% 100%;
  }
}
</style>
