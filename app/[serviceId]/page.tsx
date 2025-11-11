"use client";

import { Card } from "@/components/ui/card";
import { services, SubService } from "@/store/servicesStore";
import { ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function ServicePage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.serviceId as string;

  const selectedService = services[serviceId];

  if (!selectedService) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">Service not found</h2>
      </div>
    );
  }

  const handleSubServiceClick = (subService: SubService) => {
    router.push(`/${serviceId}/${subService.id}`);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Service Header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 shadow-xl text-white">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedService.subServices.map((subService) => (
              <Card
                key={subService.id}
                className="group p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-slate-200 hover:border-blue-300 bg-white hover:-translate-y-1"
                onClick={() => handleSubServiceClick(subService)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <div className="text-blue-600">{subService.icon}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">
                  {subService.name}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {subService.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
