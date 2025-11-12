import AuthProtected from "@/components/AuthProtected";
import { Card } from "@/components/ui/card";
import { Bot, MessageSquare, Sparkles, Target, Zap } from "lucide-react";

type Props = {};

const AiAssistant = (props: Props) => {
  return (
    <AuthProtected>
      <div className="space-y-12">
        <div className="text-center space-y-6 py-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            Powered by Advanced AI
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance">
            <span className="text-slate-900">AI Financial</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Assistant
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto text-pretty leading-relaxed">
            Your intelligent banking companion. Get instant answers,
            personalized advice, and smart insights powered by cutting-edge AI
            technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="group relative overflow-hidden p-8 hover:shadow-2xl transition-all duration-500 border-2 border-slate-200 hover:border-indigo-300 bg-white hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6 w-fit">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Smart Conversations
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Ask questions about your accounts, transactions, and financial
                products in natural language.
              </p>
            </div>
          </Card>

          <Card className="group relative overflow-hidden p-8 hover:shadow-2xl transition-all duration-500 border-2 border-slate-200 hover:border-indigo-300 bg-white hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6 w-fit">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Personalized Insights
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Receive tailored recommendations based on your spending patterns
                and financial goals.
              </p>
            </div>
          </Card>

          <Card className="group relative overflow-hidden p-8 hover:shadow-2xl transition-all duration-500 border-2 border-slate-200 hover:border-indigo-300 bg-white hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6 w-fit">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Instant Actions
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Execute payments, transfers, and account operations through
                simple voice or text commands.
              </p>
            </div>
          </Card>
        </div>

        <div className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl text-white">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Bot className="w-20 h-20 mx-auto" />
            <h2 className="text-4xl font-bold">Try AI Assistant Now</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="cursor-pointer px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
                Start Chatting
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthProtected>
  );
};

export default AiAssistant;
