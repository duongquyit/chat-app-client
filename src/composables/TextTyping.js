import { socket } from "@/plugins/socket";

const textTyping = (roomKey) => {
  socket.emit("typingText", roomKey);
};

const stopTyping = () => {
  socket.emit("stopTyping");
};

export { textTyping, stopTyping };
