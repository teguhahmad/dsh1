import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AccountManagement from './components/AccountManagement';
import DataUpload from './components/DataUpload';
import Reports from './components/Reports';
import IncentiveRules from './components/IncentiveRules';
import IncentiveGameMap from './components/IncentiveGameMap';
import IncentiveOverview from './components/IncentiveOverview';
import TeamManagement from './components/TeamManagement';
import Profile from './components/Profile';
import { signOut } from './lib/supabase';
import { Account, Category, SalesData, IncentiveRule } from './types';

interface DateFilter {
  startDate: string;
  endDate: string;
  preset: string;
}

function App() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: '',
    endDate: '',
    preset: '30'
  });

  // Sample data - in real app this would come from Supabase
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      username: 'john_affiliate',
      email: 'john@example.com',
      phone: '+62 812-3456-7890',
      status: 'active',
      payment_data: 'disetujui',
      account_code: 'JA001',
      category_id: '1',
      created_at: '2024-01-15T00:00:00Z',
    },
    {
      id: '2',
      username: 'jane_marketer',
      email: 'jane@example.com',
      phone: '+62 813-4567-8901',
      status: 'active',
      payment_data: 'utamakan',
      account_code: 'JM002',
      category_id: '2',
      created_at: '2024-02-01T00:00:00Z',
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Fashion',
      description: 'Clothing and accessories',
      created_at: '2024-01-01T00:00:00Z',
    }
  ]);

  const [salesData, setSalesData] = useState<SalesData[]>([
    {
      id: '1',
      account_id: '1',
      date: '2024-12-01',
      clicks: 1250,
      orders: 45,
      gross_commission: 2500000,
      products_sold: 67,
      total_purchases: 45000000,
      new_buyers: 23,
      created_at: '2024-12-01T00:00:00Z',
    },
    {
      id: '2',
      account_id: '1',
      date: '2024-12-02',
      clicks: 1180,
      orders: 38,
      gross_commission: 2100000,
      products_sold: 52,
      total_purchases: 38500000,
      new_buyers: 19,
      created_at: '2024-12-02T00:00:00Z',
    }
  ]);

  const [incentiveRules, setIncentiveRules] = useState<IncentiveRule[]>([
    {
      id: '1',
      name: 'Standard Commission (5% - 7.99%)',
      description: 'Incentive rules for accounts with commission rates between 5% and 7.99%',
      min_commission_threshold: 50000,
      commission_rate_min: 5,
      commission_rate_max: 7.99,
      base_revenue_threshold: 80000000,
      tiers: [
        { id: '1-1', revenue_threshold: 80000000, incentive_rate: 0.4, created_at: new Date().toISOString() },
        { id: '1-2', revenue_threshold: 90000000, incentive_rate: 0.6, created_at: new Date().toISOString() },
        { id: '1-3', revenue_threshold: 100000000, incentive_rate: 0.8, created_at: new Date().toISOString() },
        { id: '1-4', revenue_threshold: 110000000, incentive_rate: 1.0, created_at: new Date().toISOString() },
        { id: '1-5', revenue_threshold: 120000000, incentive_rate: 1.2, created_at: new Date().toISOString() },
        { id: '1-6', revenue_threshold: 130000000, incentive_rate: 1.5, created_at: new Date().toISOString() },
      ],
      is_active: true,
      created_at: new Date().toISOString(),
    }
  ]);

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    setActiveTab('dashboard');
  };

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    if (tab === 'logout') {
      handleLogout();
      return;
    }
    setActiveTab(tab);
  };

  // Account management functions
  const handleAddAccount = (accountData: Omit<Account, 'id' | 'created_at' | 'account_code'>) => {
    const newAccount: Account = {
      ...accountData,
      id: Date.now().toString(),
      account_code: `AC${String(accounts.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
    };
    setAccounts(prev => [...prev, newAccount]);
  };

  const handleUpdateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(prev => prev.map(account => 
      account.id === id ? { ...account, ...updates } : account
    ));
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      setAccounts(prev => prev.filter(account => account.id !== id));
      setSalesData(prev => prev.filter(data => data.account_id !== id));
    }
  };

  // Category management functions
  const handleAddCategory = (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleUpdateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(category => category.id !== id));
    }
  };

  // Sales data functions
  const handleUploadData = async (accountId: string, data: Omit<SalesData, 'id' | 'account_id' | 'created_at'>[]) => {
    const newSalesData = data.map(item => ({
      ...item,
      id: `${accountId}-${item.date}-${Date.now()}`,
      account_id: accountId,
      created_at: new Date().toISOString(),
    }));
    
    setSalesData(prev => [...prev, ...newSalesData]);
  };

  const handleDeleteSalesData = (accountId: string, dateRange?: { start: string; end: string }) => {
    setSalesData(prev => {
      if (dateRange) {
        return prev.filter(data => {
          if (data.account_id !== accountId) return true;
          const dataDate = new Date(data.date);
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);
          return dataDate < startDate || dataDate > endDate;
        });
      } else {
        return prev.filter(data => data.account_id !== accountId);
      }
    });
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat aplikasi...</p>
          <p className="text-sm text-gray-500 mt-2">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated || !user) {
    return <Login />;
  }

  // Render main dashboard
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            accounts={accounts}
            salesData={salesData}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            currentUser={user}
          />
        );
      case 'accounts':
        return (
          <AccountManagement
            accounts={accounts}
            categories={categories}
            onAddAccount={handleAddAccount}
            onUpdateAccount={handleUpdateAccount}
            onDeleteAccount={handleDeleteAccount}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );
      case 'upload':
        return (
          <DataUpload
            accounts={accounts}
            salesData={salesData}
            categories={categories}
            onUploadData={handleUploadData}
            onDeleteSalesData={handleDeleteSalesData}
          />
        );
      case 'reports':
        return (
          <Reports
            accounts={accounts}
            salesData={salesData}
            categories={categories}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
          />
        );
      case 'incentives':
        return <IncentiveRules />;
      case 'incentive-game':
        return (
          <IncentiveGameMap
            accounts={accounts}
            salesData={salesData}
            incentiveRules={incentiveRules}
            currentUser={user}
          />
        );
      case 'incentive-overview':
        return (
          <IncentiveOverview
            accounts={accounts}
            salesData={salesData}
            incentiveRules={incentiveRules}
            currentUser={user}
          />
        );
      case 'team':
        return (
          <TeamManagement
            accounts={accounts}
            currentUser={user}
          />
        );
      case 'profile':
        return <Profile currentUser={user} />;
      default:
        return (
          <Dashboard
            accounts={accounts}
            salesData={salesData}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            currentUser={user}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        currentUser={user}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;