'use strict';

const business = require('./monolithic_purchases');

class purchases extends require('./server'){
    constructor(){
        super("purchases",process.argv[2]?Number(process.argv[2]):9030,["POST/purchases","GET/purchases"]);
        this.connectoToDistributor("127.0.0.1",9000,(data)=>{
            console.log("Distributor Notification", data);
        });
    }

    onRead(socket, data){
        console.log("onRead", socket.remoteAddress, socket.remotePort,data);
        business.onRequest(socket, data.method, data.uri, data.params, (s, packet)=>{
            socket.write(JSON.stringify(packet)+"$");
        });
    }
}

new purchases();