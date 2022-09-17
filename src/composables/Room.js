import { socket } from "@/plugins/socket"

const addUserToRoom = (user) => {
  socket.emit('addUserToRoom', user);
}

const removeUserFromRoom = () => {
  socket.emit('removeUserFromRoom', 'remove user from room');
}

export { addUserToRoom, removeUserFromRoom }