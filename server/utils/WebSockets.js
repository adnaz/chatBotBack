import AssistantV2 from 'ibm-watson/assistant/v2.js';
import  {IamAuthenticator}  from 'ibm-watson/auth/index.js';
import { v4 as uuidv4 } from "uuid";
const assistant = new AssistantV2({
  version: '2020-04-01',
  authenticator: new IamAuthenticator({
      apikey: 'wliSRG_BhJHIUKeJi0uAJrLrWUoscvmYLtbmOJiSyFPI',
  }),
  serviceUrl: 'https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/b998d189-6a2d-4dd9-94dd-59a584c31e43',
  disableSslVerification: true,
});

class WebSockets {
 
  static  users = [];
    
     
  connection(client) {
    console.log('connection')
    // event fired when the chat room is disconnected
    client.on("disconnect", () => {
      console.log("disconnect")
      WebSockets.users = WebSockets.users.filter((user) => user.socketId !== client.id);
    });
    // add identity of user mapped to the socket id
    client.on("identity", (userId) => {
      console.log("identity"+userId)

      WebSockets.users.push({
        socketId: client.id,
        userId: userId,
      });
    });
    // subscribe person to chat & other user as well
    client.on("subscribe", (room, otherUserId = "") => {
      console.log("sub")

      this.subscribeOtherUser(room, otherUserId);
      client.join(room);
    });
    // mute a chat room
    client.on("unsubscribe", (room) => {
      console.log("unsub")

      client.leave(room);
    });

    client.on("chat message", msg => {
      console.log(JSON.stringify(msg) );
      // let restaurants =  getRestaurants(msg[0].text)
      assistant.messageStateless({
          assistantId: '8f27c02a-fae4-47eb-96e4-85a44a5022a3',
          session_id:client.id,
          input: {
              'message_type': 'text',
              'text': msg[0].text,
          }
      })
      .then(res => {
          return res.result;
      })
      .then(data=> {
          console.log(JSON.stringify(data))
          let session_id=data?.output?.context?.session_id
          let sendMsg = [{
          _id: uuidv4(),
          text: data.output.generic[0].text,
          options:data?.output?.generic[1],
          createdAt: new Date(Date.now()),
          user: {
            _id: 2,
            name: 'chat bot',
          },
          image: '',
          haveRestaurants: true,
          menus: data.data,
          // You can also add a video prop:
          // video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          // Mark the message as sent, using one tick
          sent: true,
          // Mark the message as received, using two tick
          received: true,
          // Mark the message as pending with a clock loader
          pending: true,
  
          // Any additional custom parameters are passed through
        }]
        io.emit("chat message", sendMsg);
      } )
      .catch(err => {
          console.log(err);
      });
      
    }
    )
  }

  

  subscribeOtherUser(room, otherUserId) {
    const userSockets = this.users.filter(
      (user) => user.userId === otherUserId
    );
    userSockets.map((userInfo) => {
      const socketConn = global.io.sockets.connected(userInfo.socketId);
      if (socketConn) {
        socketConn.join(room);
      }
    });
  }


   async getMenus(name, city=1){
    const body = {
        name,
        city
    }
    fetch('https://www.livreur24.ma/api/v1/chat/menus?key=',{
        method:'POST',
        body:JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response=>response.json())
    .then(data=>{
        return data;
    })
    
}
  async getRestaurants(name, city=1){
    const body = {
        name,
        city
    }
    fetch('https://www.livreur24.ma/api/v1/chat/restaurants?key=',{
        method:'POST',
        body:JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response=>response.json())
    .then(data=>{
        return data;
    })
}
}

export default new WebSockets();
