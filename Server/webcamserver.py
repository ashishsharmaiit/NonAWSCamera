const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8082 });

const clients = new Set();

wss.on('connection', ws => {
    console.log('Client connected');
  
    // Add the client to the set of connected clients
    clients.add(ws);
  
    // Event listener for messages from clients
    ws.on('message', message => {
      console.log('Message from client:', message);
  
      // Parse the message as JSON
      const parsedMessage = JSON.parse(message);
  
      // Handle different message types
      if (parsedMessage.type === 'offer') {
        const offer = parsedMessage.sdp;
        console.log('Received SDP offer:', offer);
  
        // Send the acceptance message back to the client
        relay(JSON.stringify({type:'offer', sdp: offer}), ws);
        console.log('Offer I am sending is:', JSON.stringify({type:'offer', sdp: offer}));
  
      } else if (parsedMessage.type === 'answer') {
        const answer = parsedMessage.sdp;
        console.log('Received SDP answer:', answer);
  
        // Send the acceptance message back to the client
        relay(message, ws);
        console.log('Answer I am sending is:', JSON.stringify({type:'answer',sdp:answer}));
  
      } else if (parsedMessage.type === 'candidate') {
        const candidate = parsedMessage.candidate;
        console.log('Received ICE Candidate:', candidate);
  
        // Send the acceptance message back to the client
        relay(JSON.stringify(candidate), ws);
      }
    });
  
    // Event listener for client disconnections
    ws.on('close', () => {
      console.log('Client disconnected');
  
      // Remove the client from the set of connected clients
      clients.delete(ws);
    });
  });
  
  // Function to broadcast a message to all clients except the sender
  function reply(message, sender) {
    clients.forEach(client => {
      if (client === sender && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  function relay(message, sender) {
    clients.forEach(client => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  