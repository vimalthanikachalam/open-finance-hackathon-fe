"use client";
import appStore from "@/store";
import { Bolt, Bot } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type Props = {};

const FloatingMenu = (props: Props) => {
  const appSection = appStore((state) => state.bottomActiveMenu);
  const path = usePathname();
  const setBottomActiveMenu = appStore((state) => state.setBottomActiveMenu);
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
    setBottomActiveMenu(path);
  };

  return (
    <>
      {["/", "/pfm", "/ai-assistant"].includes(path) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-slate-200 p-2 flex items-center gap-2">
            <button
              onClick={() => handleNavigation("/")}
              className={`group cursor-pointer relative flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                path === "/"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Bolt className="w-5 h-5" />
              <span className="text-sm">OF Services</span>
              {path === "/" && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavigation("/ai-assistant")}
              className={`group relative cursor-pointer flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                path.includes("/ai-assistant")
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Bot className="w-5 h-5" />
              <span className="text-sm">AI Assistant</span>
              {path.includes("/ai-assistant") && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </button>

            {/* <button
              onClick={() => handleNavigation("/pfm")}
              className={`group relative cursor-pointer flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                path.includes("/pfm")
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <PieChart className="w-5 h-5" />
              <span className="text-sm">PFM</span>
              {path.includes("/pfm") && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </button> */}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingMenu;
