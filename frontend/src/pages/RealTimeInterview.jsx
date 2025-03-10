import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Send } from 'lucide-react';

const RealTimeInterview = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('WebSocket connection placeholder');
    setIsConnected(true); // Placeholder for WebSocket connection state

    return () => {
      console.log('WebSocket cleanup placeholder');
      setIsConnected(false);
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    console.log('Sending message placeholder:', input);
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Real-Time Interview Session</h1>

      <div className="border rounded-lg p-4 mb-4 h-64 overflow-y-auto bg-gray-100">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet. Your session will start shortly.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`p-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-purple-500 text-white' : 'bg-gray-300'}`}>
                {msg.text}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response..."
          className="flex-1 p-2 border rounded-lg"
        />
        <Button onClick={handleSend}>
          <Send className="mr-1" /> Send
        </Button>
        <Button variant="outline">
          <Mic className="mr-1" /> Speak
        </Button>
      </div>

      {!isConnected && <p className="text-red-500 mt-4">Disconnected. Trying to reconnect...</p>}
    </div>
  );
};

export default RealTimeInterview;
