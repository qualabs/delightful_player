import * as config from '../config.js';

const IP = config.SERVER_IP;
const PORT = config.SERVER_PORT;
const url = "ws://" + IP + ":"+ PORT + "/";
export const ws = new WebSocket(url);