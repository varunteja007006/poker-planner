import { v4 as uuidv4 } from "uuid";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function generateRandomRoomCode(length: number = 12): string {
  let roomCode = "";

  for (let i = 0; i < length; i++) {
    roomCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return roomCode + "__" + uuidv4().slice(0, 8);
}
