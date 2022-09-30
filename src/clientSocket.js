import * as config from "../config.js";

let ws= null; 
if (!config.MODOWEB){
    const IP = config.SERVER_IP;
    const PORT = config.SERVER_PORT;
    const url = "ws://" + IP + ":"+ PORT + "/";
    ws = new WebSocket(url);
}
export {ws};