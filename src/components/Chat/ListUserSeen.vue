<template>
  <div class="list-users-seen-wrapper">
    <div class="user-seen-item">
      <img
        src="https://res.cloudinary.com/dqstetacw/image/upload/w_300,c_fill,ar_1:1,g_auto,r_max,b_rgb:262c35/w_100,c_fill,ar_1:1,g_auto,r_max,b_rgb:262c35/v1662385027/wjap0yvvihx3azvj88x8.jpg"
        alt=""
      />
    </div>
    <div class="user-seen-item">
      <img
        src="https://res.cloudinary.com/dqstetacw/image/upload/w_300,c_fill,ar_1:1,g_auto,r_max,b_rgb:262c35/w_100,c_fill,ar_1:1,g_auto,r_max,b_rgb:262c35/v1662385027/wjap0yvvihx3azvj88x8.jpg"
        alt=""
      />
    </div>
    <div class="user-seen-item">
      <img
        src="https://res.cloudinary.com/dqstetacw/image/upload/w_300,c_fill,ar_1:1,g_auto,r_max,b_rgb:262c35/w_100,c_fill,ar_1:1,g_auto,r_max,b_rgb:262c35/v1662385027/wjap0yvvihx3azvj88x8.jpg"
        alt=""
      />
    </div>
    <div class="user-seen-item">
      <img
        src="https://res.cloudinary.com/dqstetacw/image/upload/w_300,c_fill,ar_1:1,g_auto,r_max,b_rgb:262c35/w_100,c_fill,ar_1:1,g_auto,r_max,b_rgb:262c35/v1662385027/wjap0yvvihx3azvj88x8.jpg"
        alt=""
      />
    </div>
    <div class="amount-user-remaining">
      <p>+3</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListUserSeen",
};
</script>

<style>
.list-users-seen-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row-reverse;
}

.user-seen-item {
  width: 14px;
  height: 14px;
  padding: 0 1px;
}

.user-seen-item img {
  width: 100%;
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
