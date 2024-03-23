// emision basica 

// Del cliente al servidor


// cliente
socket.emit('hello', 'world');

// servidor
io.on('connection', (socket) => {
    socket.on('hello', (arg) => {
      console.log(arg); // 'world'
    });
});


// Del servidor al cliente

// servidor

io.on('connection', (socket) => {
    socket.emit('hello', 'world');
});


// cliente
socket.on('hello', (arg) => {
    console.log(arg); // 'world'
});


/* Los eventos son geniales, pero en algunos casos es posible que desees una API de solicitud-respuesta más clásica. En Socket.IO, esta característica se denomina "agradecimientos". 
*/

// con funcion

// Del cliente al servidor

// Cliente
socket.timeout(5000).emit('request', { foo: 'bar' }, 'baz', (err, response) => {
    if (err) {
      // the server did not acknowledge the event in the given delay
    } else {
      console.log(response.status); // 'ok'
    }
});


// Servidor

io.on('connection', (socket) => {
    socket.on('request', (arg1, arg2, callback) => {
      console.log(arg1); // { foo: 'bar' }
      console.log(arg2); // 'baz'
      callback({
        status: 'ok'
      });
    });
});




// Del servidor al cliente

// Servidor

io.on('connection', (socket) => {
    socket.timeout(5000).emit('request', { foo: 'bar' }, 'baz', (err, response) => {
      if (err) {
        // the client did not acknowledge the event in the given delay
      } else {
        console.log(response.status); // 'ok'
      }
    });
});


// Cliente

socket.on('request', (arg1, arg2, callback) => {
    console.log(arg1); // { foo: 'bar' }
    console.log(arg2); // 'baz'
    callback({
      status: 'ok'
    });
});



// Con una promesa
/* El emitWithAck()método proporciona la misma funcionalidad, pero devuelve una Promesa que se resolverá una vez que la otra parte reconozca el evento:

*/

// Del cliente al servidor

// cliente
try {
    const response = await socket.timeout(5000).emitWithAck('request', { foo: 'bar' }, 'baz');
    console.log(response.status); // 'ok'
  } catch (e) {
    // the server did not acknowledge the event in the given delay
}


// Servidor

io.on('connection', (socket) => {
    socket.on('request', (arg1, arg2, callback) => {
      console.log(arg1); // { foo: 'bar' }
      console.log(arg2); // 'baz'
      callback({
        status: 'ok'
      });
    });
});



// Del servidor al cliente

// Servidor
io.on('connection', async (socket) => {
    try {
      const response = await socket.timeout(5000).emitWithAck('request', { foo: 'bar' }, 'baz');
      console.log(response.status); // 'ok'
    } catch (e) {
      // the client did not acknowledge the event in the given delay
    }
});


// Cliente

socket.on('request', (arg1, arg2, callback) => {
    console.log(arg1); // { foo: 'bar' }
    console.log(arg2); // 'baz'
    callback({
      status: 'ok'
    });
  });



// oyentes generales

// Un oyente general es un oyente al que se llamará para cualquier evento entrante. Esto es útil para depurar su aplicación:



// Remitente

socket.emit('hello', 1, '2', { 3: '4', 5: Uint8Array.from([6]) });


// Receptor

socket.onAny((eventName, ...args) => {
    console.log(eventName); // 'hello'
    console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
  });

// De manera similar, para paquetes salientes:

socket.onAnyOutgoing((eventName, ...args) => {
    console.log(eventName); // 'hello'
    console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
});


//  api del servidor

/* En la jerga de Socket.IO, una sala es un canal arbitrario al que los sockets pueden unirse y salir. Se puede utilizar para transmitir eventos a un subconjunto de clientes conectados: 
 */


io.on('connection', (socket) => {
    // join the room named 'some room'
    socket.join('some room');
    
    // broadcast to all connected clients in the room
    io.to('some room').emit('hello', 'world');
  
    // broadcast to all connected clients except those in the room
    io.except('some room').emit('hello', 'world');
  
    // leave the room
    socket.leave('some room');
  });





