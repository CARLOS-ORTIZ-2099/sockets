// Manejo de desconexiones

/* 
Ahora, resaltemos dos propiedades realmente importantes de Socket.IO:

un cliente Socket.IO no siempre está conectado
un servidor Socket.IO no almacena ningún evento 

Lo que significa que su aplicación debe poder sincronizar el estado local del cliente con el estado global en el servidor después de una desconexión temporal.

*/

/* NOTA
El cliente Socket.IO intentará reconectarse automáticamente después de un pequeño retraso. Sin embargo, cualquier evento perdido durante el período de desconexión se perderá efectivamente para este cliente. 


*/
// En el contexto de nuestra aplicación de chat, esto implica que un cliente desconectado podría perder algunos mensajes: