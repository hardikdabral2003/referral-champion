
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessagesSquare, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotProps {
  campaignId: string;
  referralCode: string;
}

const Chatbot = ({ campaignId, referralCode }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "👋 Hi there! I'm here to help you with this referral. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // Simulate bot "thinking"
    setTimeout(() => {
      // Simple response logic based on keywords
      let botResponse = "";
      const lowercaseInput = input.toLowerCase();
      
      if (lowercaseInput.includes("how") && lowercaseInput.includes("work")) {
        botResponse = `This is a referral program where you can earn rewards for completing certain tasks. Your referral code is ${referralCode}.`;
      } else if (lowercaseInput.includes("reward") || lowercaseInput.includes("prize")) {
        botResponse = "You can earn special rewards by completing the tasks in this campaign. The rewards will be sent directly to you!";
      } else if (lowercaseInput.includes("task") || lowercaseInput.includes("do")) {
        botResponse = "To earn your reward, simply complete the required task for this campaign, which is usually signing up or making a purchase.";
      } else if (lowercaseInput.includes("thanks") || lowercaseInput.includes("thank you")) {
        botResponse = "You're welcome! I'm happy to help. Is there anything else you'd like to know?";
      } else if (lowercaseInput.includes("hi") || lowercaseInput.includes("hello")) {
        botResponse = "Hello! How can I help you with this referral today?";
      } else {
        botResponse = "I'm not sure I understand. Could you rephrase your question? You can ask about how the referral works, what rewards you can earn, or what tasks you need to complete.";
      }
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={toggleChatbot}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all duration-300 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open chat"
      >
        <MessagesSquare className="h-6 w-6" />
      </button>

      {/* Chatbot window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-xl shadow-xl transition-all duration-300 transform origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-[30rem] bg-white rounded-xl overflow-hidden border border-border">
          {/* Header */}
          <div className="bg-primary p-4 text-white flex justify-between items-center">
            <h3 className="font-semibold">Referral Assistant</h3>
            <button
              onClick={toggleChatbot}
              className="text-white hover:bg-white/10 p-1 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages container */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2 animate-fade-in ${
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-white border border-border shadow-sm"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-border">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
