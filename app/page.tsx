"use client";

import { Card } from "@/components/ui/card";
import { services } from "@/store/servicesStore";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClearBankingPage() {
  const router = useRouter();

  const handleServiceClick = (serviceKey: string) => {
    router.push(`/${serviceKey}`);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-2">
          <Zap className="w-4 h-4" />
          Financial Services
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-balance">
          <span className="text-slate-900">Open Finance</span>
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Services
          </span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto text-pretty leading-relaxed">
          Empower your business with secure, scalable, and modern banking APIs.
          Access comprehensive financial data and payment services with
          enterprise-grade security.
        </p>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(services).map(([key, service]) => (
          <Card
            key={key}
            className="group relative overflow-hidden p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-slate-200 hover:border-blue-300 bg-white hover:-translate-y-1"
            onClick={() => handleServiceClick(key)}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">{service.icon}</div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                {service.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{service.subServices.length} Services</span>
                </div>
                <span className="text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                  Explore →
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Trust Section */}
      <div className="bg-white rounded-3xl p-12 border-2 border-slate-200 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <div className="inline-flex p-4 bg-blue-100 rounded-2xl">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Bank-Level Security
            </h3>
            <p className="text-slate-600">
              Enterprise-grade encryption and compliance
            </p>
          </div>
          <div className="space-y-3">
            <div className="inline-flex p-4 bg-indigo-100 rounded-2xl">
              <Zap className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Real-Time Processing
            </h3>
            <p className="text-slate-600">
              Instant data access and payment execution
            </p>
          </div>
          <div className="space-y-3">
            <div className="inline-flex p-4 bg-blue-100 rounded-2xl">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">99.9% Uptime</h3>
            <p className="text-slate-600">
              Reliable infrastructure you can trust
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
