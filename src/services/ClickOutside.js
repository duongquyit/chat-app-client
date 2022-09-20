const clickOutsideListEmotion = (data) => {
  const { event, elementOne, count, elementTwo, isShowListIcon, currentMessageId, callback } = data;
  const listAllIcon = document.querySelector(`${elementOne}`);
  if (!listAllIcon?.contains(event.target) &&
    !elementTwo?.contains(event.target) &&
    count.value - 1) {
    console.log('running here');
    isShowListIcon.value = false;
    currentMessageId.value = '';
    count.value = 0;
    document.removeEventListener('click', callback);
  }
}

export { clickOutsideListEmotion }
