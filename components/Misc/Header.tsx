"use client";
import appStore from "@/store";
import { ArrowLeft, Landmark } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type Props = {};

const Header = (props: Props) => {
  const bottomActiveMenu = appStore((state) => state.bottomActiveMenu);
  const path = usePathname();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <nav className="border-b border-blue-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {path !== "/" && bottomActiveMenu === "of-services" && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-blue-50 rounded-xl transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-blue-600" />
              </button>
            )}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                router.replace("/");
                appStore.setState({ bottomActiveMenu: "/" });
              }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">Clear</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Banking
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
              Sign In
            </button>
            {/* <button className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-md hover:shadow-lg">
              Get Started
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
