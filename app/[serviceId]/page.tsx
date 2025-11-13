"use client";

import AuthProtected from "@/components/AuthProtected";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { apiFactory } from "@/lib/api";
import appStore from "@/store";
import { IAccount } from "@/store/models";
import { services, SubService } from "@/store/servicesStore";
import { ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ServicePage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.serviceId as string;
  const isAccountsDataFetched = useRef(false);

  const selectedService = services[serviceId];

  if (!selectedService) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">Service not found</h2>
      </div>
    );
  }

  const handleSubServiceClick = (subService: SubService) => {
    // Don't navigate if service is not ready
    if (!subService.isReady) {
      return;
    }
    router.push(`/${serviceId}/${subService.id}`);
  };

  const accessToken = appStore((state) => state.accessToken);
  const setAccounts = appStore((state) => state.setAccounts);

  useEffect(() => {
    if (accessToken !== null && !isAccountsDataFetched.current) {
      apiFactory.getUserAccounts(accessToken).then((response) => {
        setAccounts(response.Data.Account as IAccount[]);
        isAccountsDataFetched.current = true;
      });
    }
  }, [accessToken]);

  // Sort subservices: ready services first
  const sortedSubServices = [...selectedService.subServices].sort((a, b) => {
    const aReady = a.isReady ?? false;
    const bReady = b.isReady ?? false;
    if (aReady && !bReady) return -1;
    if (!aReady && bReady) return 1;
    return 0;
  });

  return (
    <AuthProtected>
      <div className="space-y-8">
        {/* Service Header */}
        <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 shadow-xl text-white">
          <div className="flex items-start gap-8">
            <div className="p-6 bg-white/20 backdrop-blur-sm rounded-3xl">
              <div className="text-white">{selectedService.icon}</div>
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-4">
                {selectedService.title}
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed max-w-3xl">
                {selectedService.description}
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Services Grid */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">
            Available Services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedSubServices.map((subService) => {
              const isReady = subService.isReady ?? false;

              return (
                <Card
                  key={subService.id}
                  className={`group p-6 transition-all duration-300 border-2 border-slate-200 bg-white gap-2 ${
                    isReady
                      ? "hover:shadow-xl cursor-pointer hover:border-blue-300 hover:-translate-y-1"
                      : "opacity-60 cursor-not-allowed"
                  }`}
                  onClick={() => handleSubServiceClick(subService)}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div
                      className={`p-3 bg-blue-100 rounded-xl ${
                        isReady ? "group-hover:bg-blue-200" : ""
                      } transition-colors`}
                    >
                      <div className="text-blue-600">{subService.icon}</div>
                    </div>
                    {isReady ? (
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-slate-200 text-slate-600 text-xs"
                      >
                        Not Ready
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    {subService.name}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {subService.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AuthProtected>
  );
}
