import * as config from '../config.js';

const IP = config.SERVER_IP;
const PORT = config.SERVER_PORT;
const url = "ws://" + IP + ":"+ PORT + "/";
let ws= null; 
if (!config.MODOWEB){
    ws = new WebSocket(url);
}
export {ws};