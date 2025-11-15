'use client';

import { useState, useEffect } from 'react';
import { ApiKeyInput } from '@/components/dashboard/ApiKeyInput';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { apiClient } from '@/lib/api-client';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if API key exists in session storage
    const apiKey = apiClient.getApiKey();
    if (apiKey) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <ApiKeyInput onSuccess={handleLoginSuccess} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

