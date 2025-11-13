"use client";
import { clearSession } from "@/lib/sessionStorage";
import appStore from "@/store";
import { ArrowLeft, Landmark, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type Props = {};

const Header = (props: Props) => {
  const bottomActiveMenu = appStore((state) => state.bottomActiveMenu);
  const isLoggedIn = appStore((state) => state.isLoggedIn);
  const accessToken = appStore((state) => state.accessToken);
  const clearTokenData = appStore((state) => state.clearTokenData);
  const path = usePathname();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    // 1. Clear session from cookies
    clearSession();

    // 2. Clear AI chat history from sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ai-chat-history");
      // Clear all sessionStorage just to be safe
      sessionStorage.clear();

      // Clear all localStorage
      localStorage.clear();
    }

    // 3. Clear all cookies (including any other cookies that might exist)
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name =
          eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        // Also try to clear with domain
        document.cookie = `${name}=; path=/; domain=${window.location.hostname}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    }

    // 4. Reset the entire store to initial state
    appStore.setState({
      isLoggedIn: false,
      bottomActiveMenu: "/",
      isConsentModalOpen: false,
      selectedService: null,
      selectedServiceTitle: null,
      selectedConsents: [],
      grantedConsents: {},
      oauthCodeVerifier: null,
      oauthConsentId: null,
      accessToken: null,
      refreshToken: null,
      tokenType: null,
      tokenExpiresIn: null,
      tokenScope: null,
      Accounts: [],
      selectedAccountId: null,
      accountBalanceData: {
        AccountId: String(),
        Balance: [],
      },
      beneficiariesData: {
        AccountId: String(),
        Beneficiary: [],
      },
      transactionsData: {
        AccountId: String(),
        Transaction: [],
      },
    });

    // 5. Navigate to home page and force a hard reload for fresh state
    router.push("/");
    // Use setTimeout to ensure navigation happens before reload
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }, 100);
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
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">Clear</span>
                <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Banking
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Show Logout button when user is logged in */}
            {isLoggedIn && accessToken && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl transition-all shadow-md hover:shadow-lg"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
