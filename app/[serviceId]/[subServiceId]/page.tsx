"use client";

import { services } from "@/store/servicesStore";
import { useParams } from "next/navigation";

export default function ServiceDetail() {
  const params = useParams();
  const serviceId = params.serviceId as string;
  const subServiceId = params.subServiceId as string;

  const selectedService = services[serviceId];
  const selectedSubService = selectedService?.subServices.find(
    (sub) => sub.id === subServiceId
  );

  if (!selectedService || !selectedSubService) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">Service not found</h2>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Sub-Service Header */}
        <div className="bg-white rounded-3xl p-10 shadow-lg border-2 border-slate-200">
          <div className="flex items-start gap-6 mb-8">
            <div className="p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <div className="text-white">{selectedSubService.icon}</div>
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-slate-900 mb-3">
                {selectedSubService.name}
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                {selectedSubService.description}
              </p>
            </div>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                Key Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedSubService.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                Getting Started
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-600">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      Authentication
                    </h4>
                    <p className="text-slate-600 text-sm">
                      Set up your API credentials and secure authentication
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-600">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">
                      Integration
                    </h4>
                    <p className="text-slate-600 text-sm">
                      Follow our SDK documentation for quick integration
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-600">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Testing</h4>
                    <p className="text-slate-600 text-sm">
                      Use our sandbox environment for thorough testing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-xl text-white">
              <h3 className="text-2xl font-bold mb-6">Benefits</h3>
              <div className="space-y-4">
                {selectedSubService.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Need Help?
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                Our support team is ready to assist you with integration and
                implementation.
              </p>
              <button className="w-full px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div> */}

        {/* Action Section */}
        {/* <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-12 text-white shadow-2xl">
          <div className="max-w-3xl">
            <h3 className="text-3xl font-bold mb-3">
              Ready to integrate {selectedSubService.name}?
            </h3>
            <p className="text-blue-200 text-lg mb-8 leading-relaxed">
              Start building with our comprehensive API documentation and
              developer resources
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                View Documentation
              </button>
              <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors border-2 border-blue-500">
                Try Sandbox
              </button>
              <button className="px-8 py-4 bg-transparent text-white font-bold rounded-xl hover:bg-white/10 transition-colors border-2 border-white/30">
                API Reference
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
