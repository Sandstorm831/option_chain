importScripts("socket.io.js");
let socket = io("http://localhost:8080");
const broadcastChannel = new BroadcastChannel("SocketIOChannel");
const idToPort = {};
const xhr = new XMLHttpRequest();
let yesterData = {};
let yesterDataFetched = false;
const initialStrikeN = 18000;
const initialStrikeS = 68000;

xhr.open("GET", "http://localhost:8080/init");
xhr.addEventListener("load", (e) => {
  yesterData = JSON.parse(xhr.responseText);
  console.log(yesterData);
  broadcastChannel.postMessage(yesterData);
  yesterDataFetched = true;
});
xhr.addEventListener("error", (e) => {
  console.log(e);
});
xhr.send();

function getIndexfromToken(token) {
  let index, subIndex, percInd, yesterIndex;
  const num = Number(token.slice(0, token.length - 1));
  const sym = token[token.length - 1];
  subIndex = sym === "C" ? 1 : 3;
  percInd = sym === "C" ? 0 : 4;
  yesterIndex = sym === "C" ? 0 : 1;
  if (num < 30000) {
    index = (num - initialStrikeN) / 100;
  } else {
    index = (num - initialStrikeS) / 100;
  }
  return [index, subIndex, percInd, yesterIndex];
}

function calculatePercentageChange(val, anchor) {
  return Number((((val - anchor) / anchor) * 100).toFixed(2));
}

onconnect = function (event) {
  const port = event.ports[0];
  if (socket.connected) {
    broadcastChannel.postMessage({
      status: true,
      transport: socket.io.engine.transport.name,
    });
  } else {
    socket.connect();
  }
  port.onmessage = (e) => {
    if (e.data === "disconnect") {
      socket.disconnect();
      broadcastChannel.postMessage({ status: false, transport: "Undefined" });
    } else if (e.data === "reconnect") {
      socket.connect();
    } else if (e.data === "yesterdata") {
      if (yesterDataFetched) broadcastChannel.postMessage(yesterData);
      else broadcastChannel.postMessage({ requestagain: "requestagain" });
    } else if (e.data[0] === "optionchain") {
      broadcastChannel.postMessage({
        status: socket.connected,
        transport: socket.io.engine.transport.name,
      });
      socket.emit(e.data[0], e.data[1], e.data[2]);
      console.log(
        `sent event ${e.data[0]} with data ${e.data[1]} with id : ${e.data[2]}`,
      );
    } else if (e.data[0] === "realtime") {
      broadcastChannel.postMessage({
        status: socket.connected,
        transport: socket.io.engine.transport.name,
      });
      socket.emit(e.data[0], e.data[1]);
      console.log(`sent event ${e.data[0]} with data ${e.data[1]}`);
    } else if (e.data[0] === "release") {
      broadcastChannel.postMessage({
        status: socket.connected,
        transport: socket.io.engine.transport.name,
      });
      socket.emit(e.data[0], e.data[1]);
      console.log(`sent event ${e.data[0]} with data ${e.data[1]}`);
    }
  };
};

socket.on("disconnect", (reason, details) => {
  broadcastChannel.postMessage({ status: false, transport: "Undefined" });
});

socket.on("connect", () => {
  broadcastChannel.postMessage({
    status: true,
    transport: socket.io.engine.transport.name,
  });
  socket.io.engine.on("upgrade", (transport) => {
    broadcastChannel.postMessage({ status: true, transport: transport.name });
  });
});

// socket.on("data", (data) => {
//   broadcastChannel.postMessage(data);
// });

socket.on("optionchaindata", (underlying, data, id) => {
  console.log("recieved optionchaindata");
  console.log(data);
  console.log(underlying);
  const xdata = [];
  for (let i = 0; i < data.length; i++) {
    let x = [];
    x.push(
      calculatePercentageChange(
        data[i][1],
        yesterData.yesterOptionPrice.N[i][0],
      ),
    );
    x.push(data[i][1]);
    x.push(data[i][0]);
    x.push(data[i][2]);
    x.push(
      calculatePercentageChange(
        data[i][2],
        yesterData.yesterOptionPrice.N[i][1],
      ),
    );
    xdata.push(x);
  }
  broadcastChannel.postMessage({ data: xdata, underlying: underlying, id: id });
});

socket.on("realtimedata", (data) => {
  console.log("recieved realtimedata");
  console.log(data);
  const [index, subIndex, percInd, yesterIndex] = getIndexfromToken(data.token);
  let chg;
  if (Number(data.token.slice(0, data.token.length - 1)) < 30000)
    chg = calculatePercentageChange(
      data.tokenval,
      yesterData.yesterOptionPrice.N[index][yesterIndex],
    );
  else
    chg = calculatePercentageChange(
      data.tokenval,
      yesterData.yesterOptionPrice.S[index][yesterIndex],
    );
  console.log("realtimedata before broadcasting");
  broadcastChannel.postMessage({
    token: data.token,
    tokenval: data.tokenval,
    tokenChg: chg,
  });
  console.log("realtimedata recieved and broadcasted");
  console.log({
    token: data.token,
    tokenval: data.tokenval,
    tokenChg: chg,
  });
});

socket.on("update", (data) => {
  broadcastChannel.postMessage({ updates: data });
});

/*
useEffect(() => {
  if (socket.connected) {
    setConnectionStatus(true);
    setTransport(socket.io.engine.transport.name);
  } else {
    socket.connect();
  }
  socket.on("disconnect", (reason, details) => {
    setConnectionStatus(false);
    setTransport("undefined");
    socket.io.engine.on("upgrade", (transport) => {
      setTransport(transport.name);
    });
  });
  socket.on("connect", () => {
    setConnectionStatus(true);
    setTransport(socket.io.engine.transport.name);
    socket.io.engine.on("upgrade", (transport) => {
      setTransport(transport.name);
    });
  });
  socket.on("data", (data: dataObject) => {
    setData(data.data);
    setUnderlying(data.underlying);
  });
  return () => {
    socket.removeAllListeners();
  };
}, []);
*/

/*
useEffect(() => {
  if (socket.connected) {
    setConnectionStatus(true);
  }
  socket.on("disconnect", (reason, details) => {
    setConnectionStatus(false);
    socket.io.engine.on("upgrade", (transport) => {});
  });
  socket.on("connect", () => {
    setConnectionStatus(true);
    socket.io.engine.on("upgrade", (transport) => {});
  });
  socket.on("data", (data: dataObject) => {
    setData(data.data);
  });
  return () => {
    socket.removeAllListeners();
  };
}, []);
*/
