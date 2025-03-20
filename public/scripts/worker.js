importScripts("socket.io.js");
let socket = io("http://localhost:8080");
const broadcastChannel = new BroadcastChannel("SocketIOChannel");
const idToPort = {};
const xhr = new XMLHttpRequest();
let yesterData = {};

xhr.open("GET", "http://localhost:8080/init");
xhr.addEventListener("load", (e) => {
  yesterData = JSON.parse(xhr.responseText);
  broadcastChannel.postMessage(yesterData);
});
xhr.addEventListener("error", (e) => {
  console.log(e);
});
xhr.send();

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
    } else if (e.data[0] === "optionchain") {
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

socket.on("data", (data) => {
  broadcastChannel.postMessage(data);
});

socket.on("optionchaindata", (underlying, data) => {
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
  broadcastChannel.postMessage({ data: xdata, underlying: underlying });
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
