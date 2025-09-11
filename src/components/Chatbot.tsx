import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { customBusRoutes, busStops } from "@/data/busData";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hi! I'm NOVA. Tell me where you're starting from, where you want to go, and your travel times." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatContentRef = useRef<HTMLDivElement>(null);

  // A more advanced function to find routes based on locations and times
  const getBotResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // 1. Extract Locations
    let startLocation: string | null = null;
    let endLocation: string | null = null;
    const allStopNames = busStops.map(s => s.name.toLowerCase());

    // Find locations mentioned in the message
    const mentionedStops = allStopNames.filter(name => lowerCaseMessage.includes(name));
    
    if (mentionedStops.length >= 2) {
        // A simple way to determine start and end based on order of appearance
        startLocation = mentionedStops[0];
        endLocation = mentionedStops[1];
    } else if (mentionedStops.length === 1) {
        startLocation = mentionedStops[0];
    }

    if (!startLocation || !endLocation) {
        return "I'm sorry, I couldn't understand the start and end locations. Please mention at least two valid bus stops.";
    }

    // 2. Extract Times
    const timeRegex = /(\d{1,2})\s*([ap]m)/gi;
    const times = [...userMessage.matchAll(timeRegex)];
    let startHour = 0, endHour = 24; // Default to all day if no times are mentioned

    if (times.length >= 2) {
        const startTime = parseInt(times[0][1], 10);
        const startPeriod = times[0][2].toLowerCase();
        const endTime = parseInt(times[1][1], 10);
        const endPeriod = times[1][2].toLowerCase();
        
        startHour = (startPeriod === 'pm' && startTime !== 12) ? startTime + 12 : startTime;
        endHour = (endPeriod === 'pm' && endTime !== 12) ? endTime + 12 : endTime;
    }

    // 3. Find Matching Routes and Timings
    const suggestions: string[] = [];
    customBusRoutes.forEach(route => {
        const routeStops = [route.startPoint, ...route.intermediateStops, route.endPoint].map(s => s.toLowerCase());
        const startIndex = routeStops.indexOf(startLocation!);
        const endIndex = routeStops.indexOf(endLocation!);

        // Check if the route goes in the right direction
        if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
            route.timings.forEach(timing => {
                const departureHour = parseInt(timing.departure.split(':')[0]);
                const isAm = timing.departure.toLowerCase().includes('am');
                const departure24h = (isAm || departureHour === 12) ? departureHour : departureHour + 12;

                if (departure24h >= startHour && departure24h <= endHour) {
                    suggestions.push(`- Route "${route.name}": Departs ${timing.from} at ${timing.departure}, arrives at ${timing.to} by ${timing.arrival}.`);
                }
            });
        }
    });

    if (suggestions.length === 0) {
        return `I couldn't find any buses going from ${startLocation} to ${endLocation} within your specified time. Please try a different time or location.`;
    }

    return `
      Here are the buses I found from ${startLocation} to ${endLocation}:\n
      ${suggestions.join('\n')}
    `;
  };


  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = { text: inputValue, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate thinking and then respond
    setTimeout(() => {
        const botResponse: Message = { text: getBotResponse(inputValue), sender: "bot" };
        setMessages(prev => [...prev, botResponse]);
    }, 500);

    setInputValue("");
  };

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96">
          <Card className="flex flex-col h-[400px] md:h-[500px]">
            <CardHeader>
              <CardTitle>NOVA</CardTitle>
            </CardHeader>
            <CardContent ref={chatContentRef} className="flex-1 overflow-y-auto pr-4">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <p
                      className={`whitespace-pre-wrap rounded-lg px-3 py-2 max-w-[90%] ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g., from Navsari to Rajkamal..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default Chatbot;