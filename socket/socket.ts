import { io } from 'socket.io-client'

const SERVER_ADDR = "localhost:3001/current_cart"

export const socket = io(SERVER_ADDR)