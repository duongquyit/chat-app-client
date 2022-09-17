const clickOutsideListEmotion = (data) => {
  const { event, elementOne, count, elementTwo, isShowListIcon, isShowOption, messageIndex, callback } = data;
  const listAllIcon = document.querySelector(`${elementOne}`);
  const messagesOption = document.querySelectorAll(`${elementTwo}`);
  if (!listAllIcon?.contains(event.target) &&
    !messagesOption[messageIndex.value]?.contains(event.target) &&
    count.value - 1) {
    isShowListIcon.value = false;
    isShowOption.value = false;
    messageIndex.value = null;
    count.value = 0;
    document.removeEventListener('click', callback);
  }
}

export { clickOutsideListEmotion }