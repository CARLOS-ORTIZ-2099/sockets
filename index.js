// web sockets es un protocolo de comunicacion bidoreccional entre cleinte y servidor


// socket IO es una libreria que abstrae muchos conceptos de websockets, esta simplifica el manejo bidireccional de datos 


const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

// ejecutando una funcion asicrona para guardar los mensajes en la Db
async function main() {
    // open the database file
    const db = await open({
      filename: 'chat.db',
      driver: sqlite3.Database
    });


    // create our 'messages' table (you can ignore the 'client_offset' column for now)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          client_offset TEXT UNIQUE,
          content TEXT
      );
    `);

  const app = express();
  const server = createServer(app);
  // instanciando un objeto del tipo server y pasandole como parametro el servidor http
  // con el segundo parametro hacemos una Recuperación del estado de conexión

  // Esta función almacenará temporalmente todos los eventos enviados por el servidor e intentará restaurar el estado de un cliente cuando se vuelva a conectar: restaurar sus habitaciones, enviar cualquier evento perdido
  // Debe estar habilitado en el lado del servidor:
  const io = new Server(server, {connectionStateRecovery: {}});

  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });
  
  // creando un evento para la instancia de socket io
  io.on('connection', async (socket) => {
    // definiendo el evento chat message que se emitira en el archivo index.html 
    // cuando se envie un datos del formulario
    socket.on('chat message', async (msg, clientOffset, callback) => {
        let result;
        try{
          // store the message in the database
          result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
        }
        catch(err) {
          // TODO handle the failure
          return
        }
      
      // la ejecucion del evento chat message desencadenara a su vez una emision de otro evento
      // include the offset with the message
      io.emit('chat message', msg, result.lastID);

    });

    // Y finalmente el servidor enviará los mensajes que faltan al (re)conectarse:

    if (!socket.recovered) {
      // if the connection state recovery was not successful
      try {
        await db.each('SELECT id, content FROM messages WHERE id > ?',
          [socket.handshake.auth.serverOffset || 0],
          (_err, row) => {
            socket.emit('chat message', row.content, row.id);
          }
        )
      } catch (e) {
        // something went wrong
      }
    }


  });

  

  server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
  });

}


main()






