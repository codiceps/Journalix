import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen m-0 p-0 font-body-md bg-surface relative">
      <img
        alt="Trading Background"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        src="/images/1.png"
      />
      <div className="relative z-10 flex min-h-screen w-full">
        {/* Left Side: Hero Image & Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="relative z-10 w-full p-12 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div>
                  <img
                    alt="Journalix Logo"
                    className="w-auto h-25 object-contain"
                    src="/images/Journalix1.png"
                  />
                </div>
              </div>
              <div className="max-w-xl">
                <h1 className="text-display text-on-surface font-bold mb-6">
                  Selamat Datang di Journalix
                </h1>
                <p className="text-body-lg text-on-surface-variant leading-relaxed">
                  Platform trading terpadu untuk komunitas. Kelola portofolio, analisis
                  pergerakan pasar, dan tingkatkan performa trading dengan aman dan efisien.
                </p>
              </div>
            </div>
            <p className="text-body-sm text-on-surface-variant/70">
              © 2024 Journalix Trading Community. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
          {children}
        </div>
      </div>
    </div>
  );
}
