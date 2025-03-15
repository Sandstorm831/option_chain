importScripts("socket.io.js");

let socket = io("http://localhost:8080");
const broadcastChannel = new BroadcastChannel("SocketIOChannel");
const idToPort = {};

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
