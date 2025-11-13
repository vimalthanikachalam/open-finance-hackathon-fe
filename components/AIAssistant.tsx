"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  checkAIHealth,
  getCreditCardRecommendations,
  queryAI,
  type ChatMessage,
} from "@/lib/aiApi";
import { apiFactory } from "@/lib/api";
import appStore from "@/store";
import {
  Bot,
  CreditCard as CreditCardIcon,
  ExternalLink,
  Loader2,
  Maximize2,
  Minimize2,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AIAssistant() {
  const router = useRouter();
  const { toast } = useToast();
  const { isLoggedIn, setConsentModalOpen, setSelectedService, accessToken } =
    appStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load conversation from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("ai-chat-history");
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
    }

    // Check AI service health
    checkAIHealth().then((available) => {
      setAiAvailable(available);
      if (!available) {
        toast({
          title: "AI Service Unavailable",
          description: "Please ensure the AI service is running on port 8000",
          variant: "destructive",
        });
      }
    });
  }, [toast]);

  // Save conversation to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("ai-chat-history", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!isLoggedIn) {
      setIsOpen(false);
      // Set the service context to bankDataSharing to show all permissions
      setSelectedService("bankDataSharing", "Bank Data Sharing");
      setConsentModalOpen(true);
      return;
    }

    if (!aiAvailable) {
      toast({
        title: "AI Service Unavailable",
        description: "Please start the AI service first",
        variant: "destructive",
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Check if query is about credit cards
      const isCreditCardQuery =
        /credit\s*card|card\s*recommendation|card\s*suggest/i.test(input);

      // Add a delay to simulate AI thinking/computing
      const [response] = await Promise.all([
        queryAI(input),
        new Promise((resolve) => setTimeout(resolve, 1500)), // 1.5 second delay
      ]);

      // Check if similarity score is too low (out of scope)
      const isOutOfScope = response.similarity_score < 0.3;

      let assistantMessage: ChatMessage;

      if (isOutOfScope) {
        // Out of scope response
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I'd love to help! However, that's outside my area of expertise. I can assist you with:\n\n• Viewing and managing your bank accounts\n• Checking balances and transactions\n• Making payments and transfers\n• Managing beneficiaries and direct debits\n• Exploring financial products like loans, mortgages, and savings\n• Verifying payee details for secure payments\n• Personal finance insights and analytics\n• ADCB credit card recommendations based on your spending\n\nWhat would you like to know about your banking services?`,
          timestamp: Date.now(),
        };
      } else if (isCreditCardQuery && accessToken) {
        // Fetch transactions and get credit card recommendations
        try {
          const accountsResponse = await apiFactory.getUserAccounts(
            accessToken
          );
          const accounts = accountsResponse.Data.Account;

          if (accounts && accounts.length > 0) {
            const accountId = accounts[0].AccountId;
            const transactionsResponse =
              await apiFactory.getAccountTransactions(accessToken, accountId);
            const transactions = transactionsResponse.Data.Transaction || [];

            const recommendations = await getCreditCardRecommendations(
              transactions
            );

            assistantMessage = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: `Based on your spending patterns, I've found ${
                recommendations.recommendations.length
              } ADCB credit cards that could help you save money:\n\n${recommendations.recommendations
                .map(
                  (card, idx) =>
                    `${idx + 1}. **${card.name}**\n   ${card.reason}\n   ${
                      card.potential_savings
                    }`
                )
                .join("\n\n")}`,
              creditCardRecommendations: recommendations.recommendations,
              cta: {
                label: "View All Credit Cards",
                route: response.deeplink.startsWith("/")
                  ? response.deeplink
                  : `/${response.deeplink}`,
              },
              timestamp: Date.now(),
            };
          } else {
            assistantMessage = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content:
                "I'd love to show you credit card recommendations, but I need your transaction history first. Please view your transactions to get personalized recommendations.",
              cta: {
                label: response.cta,
                route: response.deeplink.startsWith("/")
                  ? response.deeplink
                  : `/${response.deeplink}`,
              },
              timestamp: Date.now(),
            };
          }
        } catch (error) {
          console.error("Error fetching credit card recommendations:", error);
          assistantMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response.matched_description,
            cta: {
              label: response.cta,
              route: response.deeplink.startsWith("/")
                ? response.deeplink
                : `/${response.deeplink}`,
            },
            timestamp: Date.now(),
          };
        }
      } else {
        // Valid response with CTA
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.matched_description,
          cta: {
            label: response.cta,
            route: response.deeplink.startsWith("/")
              ? response.deeplink
              : `/${response.deeplink}`,
          },
          timestamp: Date.now(),
        };
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm sorry, I couldn't process your request. Please make sure the AI service is running and try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCTAClick = (route: string) => {
    router.push(route);
    setIsOpen(false);
  };

  const clearHistory = () => {
    setMessages([]);
    sessionStorage.removeItem("ai-chat-history");
    toast({
      title: "Chat History Cleared",
      description: "All messages have been removed",
    });
  };

  const handleAuthClick = () => {
    setIsOpen(false);
    // Set the service context to bankDataSharing to show all permissions
    setSelectedService("bankDataSharing", "Bank Data Sharing");
    setConsentModalOpen(true);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-indigo-500/50 active:scale-95"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="h-6 w-6 animate-pulse" />
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col transition-all duration-300 ${
        isExpanded
          ? "inset-4 md:inset-8"
          : "bottom-6 right-6 w-[380px] h-[600px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="h-6 w-6 text-white" />
            <div
              className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${
                aiAvailable ? "bg-green-400" : "bg-red-400"
              } border-2 border-white`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">AI Assistant</h3>
            <p className="text-xs text-white/80">
              {aiAvailable ? "Ready to help" : "Service offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Welcome to AI Assistant
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  Ask me anything about your banking services, transactions, or
                  financial insights!
                </p>
                {!isLoggedIn && (
                  <Button
                    onClick={handleAuthClick}
                    variant="default"
                    size="sm"
                    className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Authorize to Start
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-linear-to-br from-indigo-600 to-purple-600 text-white"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>

                    {/* Credit Card Recommendations */}
                    {message.creditCardRecommendations &&
                      message.creditCardRecommendations.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {message.creditCardRecommendations.map(
                            (card, idx) => (
                              <div
                                key={idx}
                                className="bg-white rounded-lg p-3 shadow-sm border border-slate-200"
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  <CreditCardIcon className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                  <div>
                                    <h4 className="font-semibold text-slate-900 text-sm">
                                      {card.name}
                                    </h4>
                                    <p className="text-xs text-slate-600 mt-1">
                                      {card.reason}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {card.benefits
                                    .slice(0, 3)
                                    .map((benefit, bidx) => (
                                      <span
                                        key={bidx}
                                        className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full"
                                      >
                                        {benefit}
                                      </span>
                                    ))}
                                </div>
                                <p className="text-xs font-medium text-emerald-600 mb-2">
                                  {card.potential_savings}
                                </p>
                                <Button
                                  onClick={() =>
                                    window.open(card.apply_url, "_blank")
                                  }
                                  size="sm"
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"
                                >
                                  Apply Now{" "}
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      )}

                    {message.cta && (
                      <Button
                        onClick={() => handleCTAClick(message.cta!.route)}
                        size="sm"
                        className="mt-3 w-full bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-sm hover:shadow-md transition-all cursor-pointer border-0"
                      >
                        {message.cta.label}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    <span className="text-sm text-slate-600">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
        {!isLoggedIn ? (
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">
              Please authorize to use AI Assistant
            </p>
            <Button
              onClick={handleAuthClick}
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Authorize Now
            </Button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything..."
                className="resize-none min-h-11 max-h-[120px]"
                rows={1}
                disabled={isLoading || !aiAvailable}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || !aiAvailable}
                size="icon"
                className="h-11 w-11 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {messages.length > 0 && (
              <Button
                onClick={clearHistory}
                variant="ghost"
                size="sm"
                className="w-full text-xs text-slate-500 hover:text-slate-700"
              >
                Clear History
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
