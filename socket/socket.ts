import { io } from 'socket.io-client'

const SERVER_ADDR = "192.168.28.149:8080"

export const socket = io(SERVER_ADDR)