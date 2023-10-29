/**
 * @author Leviathenn/Levi.A/Leviathan
 */
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

const wss = new WebSocketServer({ port: 8080 });

const connections = {};
const makeid = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

wss.on('connection', function connection(ws, request) {
    const url = new URL(request.url, `ws://${request.headers.host}`);
    const path = url.pathname;
    ws.send(path);  
    if (path.startsWith('/connect/')) {
        const connectid = path.slice('/connect/'.length);
        if(!connections[connectid]){
            ws.send(json.stringify({message:"Invalid gamecode!"}));
            ws.close();
        }
        ws.on('message', (msg)=>{
            try {
                var msgdata = JSON.parse(msg);
                var game = connections[connectid];
                if(msgdata["action"] == "gamestart" && !game["gamestarted"] == true){
                    game["gamestarted"] = true;
                }else if(msgdata["action"] == "correct"){
                    var player = msgdata["playerName"];
                    game.Players[player]["score"] += 1000;
                }else if(msgdata["action"] == "incorrect"){
                    var player = msgdata["playerName"];
                    game.Players[player]["score"] -= 1000;
                }else if(msgdata["action"] == "join"){
                    game.Players[msgdata["playerName"]] = {
                        score: 0,
                        PowerUps: [],
                        isHost: false
                    }
                }else if(msgdata["action"] == "leave" || msgdata["action"] == "kick"){
                    game.Players[msgdata["playerName"]] == null;
                }
            } catch (error) {
                ws.send(JSON.stringify({message:"invalid"}))
            }
        })
    
        // Perform actions related to the specific 'connectid'
        ws.send(`Connected to connection with ID: ${connectid}`);
      } else if(path.startsWith('/new')) {
        const sessionNew = makeid(6);
        connections[sessionNew] = {
            Players: {},
            gamestarted: false

        };
        ws.send(JSON.stringify({"gamecode": sessionNew}));
      }else{
     
      }

  ws.send('something');
});
