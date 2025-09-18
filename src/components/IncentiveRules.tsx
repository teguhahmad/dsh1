import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Target, 
  DollarSign, 
  Percent, 
  Settings,
  X,
  Save,
  AlertCircle,
  TrendingUp,
  Calculator
} from 'lucide-react';
import { IncentiveRule, IncentiveTier } from '../types';

const IncentiveRules: React.FC = () => {
  const [rules, setRules] = useState<IncentiveRule[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<IncentiveRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_commission_threshold: 50000,
    commission_rate_min: 5,
    commission_rate_max: 7.99,
    base_revenue_threshold: 80000000,
    is_active: true,
  });
  const [tiers, setTiers] = useState<Omit<IncentiveTier, 'id' | 'created_at'>[]>([
    { revenue_threshold: 80000000, incentive_rate: 0.4 },
    { revenue_threshold: 90000000, incentive_rate: 0.6 },
    { revenue_threshold: 100000000, incentive_rate: 0.8 },
    { revenue_threshold: 110000000, incentive_rate: 1.0 },
    { revenue_threshold: 120000000, incentive_rate: 1.2 },
    { revenue_threshold: 130000000, incentive_rate: 1.5 },
  ]);

  // Load sample data on initial load
  useEffect(() => {
    const sampleRules: IncentiveRule[] = [
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
      },
      {
        id: '2',
        name: 'High Commission (8%+)',
        description: 'Incentive rules for accounts with commission rates 8% and above',
        min_commission_threshold: 50000,
        commission_rate_min: 8,
        commission_rate_max: 100,
        base_revenue_threshold: 50000000,
        tiers: [
          { id: '2-1', revenue_threshold: 50000000, incentive_rate: 0.4, created_at: new Date().toISOString() },
          { id: '2-2', revenue_threshold: 60000000, incentive_rate: 0.6, created_at: new Date().toISOString() },
          { id: '2-3', revenue_threshold: 70000000, incentive_rate: 0.8, created_at: new Date().toISOString() },
          { id: '2-4', revenue_threshold: 80000000, incentive_rate: 1.0, created_at: new Date().toISOString() },
          { id: '2-5', revenue_threshold: 90000000, incentive_rate: 1.2, created_at: new Date().toISOString() },
          { id: '2-6', revenue_threshold: 100000000, incentive_rate: 1.5, created_at: new Date().toISOString() },
        ],
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ];
    setRules(sampleRules);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(0)}M`;
    }
    return num.toLocaleString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRule: IncentiveRule = {
      id: editingRule ? editingRule.id : Date.now().toString(),
      ...formData,
      tiers: tiers.map((tier, index) => ({
        ...tier,
        id: editingRule ? editingRule.tiers[index]?.id || `${Date.now()}-${index}` : `${Date.now()}-${index}`,
        created_at: editingRule ? editingRule.tiers[index]?.created_at || new Date().toISOString() : new Date().toISOString(),
      })),
      created_at: editingRule ? editingRule.created_at : new Date().toISOString(),
    };

    if (editingRule) {
      setRules(prev => prev.map(rule => rule.id === editingRule.id ? newRule : rule));
    } else {
      setRules(prev => [...prev, newRule]);
    }

    closeModal();
  };

  const handleEdit = (rule: IncentiveRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description,
      min_commission_threshold: rule.min_commission_threshold,
      commission_rate_min: rule.commission_rate_min,
      commission_rate_max: rule.commission_rate_max,
      base_revenue_threshold: rule.base_revenue_threshold,
      is_active: rule.is_active,
    });
    setTiers(rule.tiers.map(tier => ({
      revenue_threshold: tier.revenue_threshold,
      incentive_rate: tier.incentive_rate,
    })));
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingRule(null);
    setFormData({
      name: '',
      description: '',
      min_commission_threshold: 50000,
      commission_rate_min: 5,
      commission_rate_max: 7.99,
      base_revenue_threshold: 80000000,
      is_active: true,
    });
    setTiers([
      { revenue_threshold: 80000000, incentive_rate: 0.4 },
      { revenue_threshold: 90000000, incentive_rate: 0.6 },
      { revenue_threshold: 100000000, incentive_rate: 0.8 },
      { revenue_threshold: 110000000, incentive_rate: 1.0 },
      { revenue_threshold: 120000000, incentive_rate: 1.2 },
      { revenue_threshold: 130000000, incentive_rate: 1.5 },
    ]);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this incentive rule?')) {
      setRules(prev => prev.filter(rule => rule.id !== id));
    }
  };

  const toggleRuleStatus = (id: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, is_active: !rule.is_active } : rule
    ));
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRule(null);
    setFormData({
      name: '',
      description: '',
      min_commission_threshold: 50000,
      commission_rate_min: 5,
      commission_rate_max: 7.99,
      base_revenue_threshold: 80000000,
      is_active: true,
    });
    setTiers([]);
  };

  const addTier = () => {
    setTiers(prev => [...prev, { revenue_threshold: 0, incentive_rate: 0 }]);
  };

  const removeTier = (index: number) => {
    setTiers(prev => prev.filter((_, i) => i !== index));
  };

  const updateTier = (index: number, field: 'revenue_threshold' | 'incentive_rate', value: number) => {
    setTiers(prev => prev.map((tier, i) => 
      i === index ? { ...tier, [field]: value } : tier
    ));
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Incentive Rules</h1>
            <p className="text-gray-600">Manage incentive calculation rules for workers</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Rule</span>
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">How Incentive Rules Work</h3>
              <div className="text-blue-800 space-y-2">
                <p>• Only accounts with commission above the minimum threshold will be counted</p>
                <p>• Calculation is based on total revenue from qualifying accounts</p>
                <p>• Different commission rate ranges have different revenue thresholds</p>
                <p>• Incentive rates are applied progressively based on revenue tiers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rules List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rule.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{rule.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500">Min Commission</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(rule.min_commission_threshold)}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Percent className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500">Commission Rate</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {rule.commission_rate_min}% - {rule.commission_rate_max === 100 ? '∞' : `${rule.commission_rate_max}%`}
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">Base Threshold</span>
                      </div>
                      <div className="text-sm font-semibold text-purple-900">
                        {formatCurrency(rule.base_revenue_threshold)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => toggleRuleStatus(rule.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        rule.is_active 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={rule.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(rule)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tiers */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Incentive Tiers</span>
                  </h4>
                  <div className="space-y-2">
                    {rule.tiers.map((tier, index) => (
                      <div key={tier.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(tier.revenue_threshold)}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-purple-600">
                          {tier.incentive_rate}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {rules.length === 0 && (
          <div className="text-center py-12">
            <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No incentive rules yet</h3>
            <p className="text-gray-600 mb-4">Create your first incentive rule to get started</p>
            <button
              onClick={handleAdd}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create First Rule
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingRule ? 'Edit Incentive Rule' : 'Add New Incentive Rule'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rule Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter rule name"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter rule description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Commission Threshold (IDR) *
                    </label>
                    <input
                      type="number"
                      value={formData.min_commission_threshold}
                      onChange={(e) => setFormData({ ...formData, min_commission_threshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Revenue Threshold (IDR) *
                    </label>
                    <input
                      type="number"
                      value={formData.base_revenue_threshold}
                      onChange={(e) => setFormData({ ...formData, base_revenue_threshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate Min (%) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.commission_rate_min}
                      onChange={(e) => setFormData({ ...formData, commission_rate_min: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                      max="100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate Max (%) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.commission_rate_max}
                      onChange={(e) => setFormData({ ...formData, commission_rate_max: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                </div>

                {/* Incentive Tiers */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Incentive Tiers</h3>
                    <button
                      type="button"
                      onClick={addTier}
                      className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Tier</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {tiers.map((tier, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                        </div>
                        
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Revenue Threshold (IDR)
                            </label>
                            <input
                              type="number"
                              value={tier.revenue_threshold}
                              onChange={(e) => updateTier(index, 'revenue_threshold', Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              min="0"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Incentive Rate (%)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={tier.incentive_rate}
                              onChange={(e) => updateTier(index, 'incentive_rate', Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              min="0"
                              max="100"
                              required
                            />
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeTier(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Active Rule
                  </label>
                </div>
                
                <div className="flex space-x-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingRule ? 'Update' : 'Create'} Rule</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IncentiveRules;