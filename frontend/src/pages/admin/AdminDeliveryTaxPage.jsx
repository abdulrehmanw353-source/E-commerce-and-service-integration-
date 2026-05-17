import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Truck, Percent, CalendarDays, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';
import api from '../../lib/axios';
import { ChevronDown, Edit2 } from 'lucide-react';

const fetchSettings = () => adminApi.get('/delivery-tax-settings').then(r => r.data.data ?? r.data);
const updateSettings = (data) => adminApi.put('/delivery-tax-settings', data).then(r => r.data);

export default function AdminDeliveryTaxPage() {
  const qc = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ['delivery-tax-settings'],
    queryFn: fetchSettings,
  });

  const settingsMut = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      qc.invalidateQueries(['delivery-tax-settings']);
      toast.success('Settings updated successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    }
  });

  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [categoryRules, setCategoryRules] = useState([]);
  const [isInit, setIsInit] = useState(false);

  const { data: categoriesData } = useQuery({
    queryKey: ['available-categories'],
    queryFn: () => api.get('/products').then(r => r.data.data.availableCategories || []),
  });
  const availableCategories = categoriesData || [];

  // Initialize state once data loads
  if (data && !isInit) {
    setTaxEnabled(data.taxEnabled || false);
    setTaxPercentage(data.taxPercentage || 0);
    setCategoryRules(data.categoryRules?.map(r => ({ ...r, isEditing: false })) || []);
    setIsInit(true);
  }

  const handleSave = () => {
    // Basic validation
    if (taxEnabled && (taxPercentage < 0 || taxPercentage > 100)) {
      toast.error("Tax percentage must be between 0 and 100");
      return;
    }
    const hasEmptyCats = categoryRules.some(r => !r.category || r.category.trim() === '');
    if (hasEmptyCats) {
      toast.error("All category rules must have a category name");
      return;
    }

    settingsMut.mutate({
      taxEnabled,
      taxPercentage: Number(taxPercentage),
      categoryRules: categoryRules.map(r => ({
        category: r.category,
        deliveryCharge: Number(r.deliveryCharge),
        expectedDeliveryDays: Number(r.expectedDeliveryDays)
      }))
    });
    
    // Automatically lock all rules on save
    setCategoryRules(prev => prev.map(r => ({ ...r, isEditing: false })));
  };

  const addCategoryRule = () => {
    setCategoryRules([{ category: '', deliveryCharge: 0, expectedDeliveryDays: 3, isEditing: true }, ...categoryRules]);
  };

  const removeCategoryRule = (index) => {
    const updated = [...categoryRules];
    updated.splice(index, 1);
    setCategoryRules(updated);
  };

  const updateCategoryRule = (index, field, value) => {
    const updated = [...categoryRules];
    updated[index][field] = value;
    setCategoryRules(updated);
  };

  if (isLoading) {
    return <div className="p-6 text-white/50 animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-white tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#a994ff]" /> Delivery & Taxes
          </h1>
          <p className="text-[14px] text-white/45 mt-1">Configure global tax rates and category-based delivery rules.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={settingsMut.isPending}
          className="ds-btn-primary px-6 py-2.5 rounded-xl font-semibold text-[14px] flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {settingsMut.isPending ? 'Saving...' : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Taxes Configuration */}
        <div className="lg:col-span-1 bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-6 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Percent className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-white">Taxes</h2>
              <p className="text-[12px] text-white/45">Global store setting</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <span className="text-[14px] font-medium text-white/80">Enable Taxes</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={taxEnabled} onChange={e => setTaxEnabled(e.target.checked)} />
                <div className="w-11 h-6 bg-white/[0.1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8f74ff]"></div>
              </label>
            </div>

            <div className={`transition-all duration-300 ${taxEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <label className="block text-[12px] font-medium text-white/60 mb-2">Tax Percentage (%)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxPercentage}
                  onChange={e => setTaxPercentage(e.target.value)}
                  className="w-full bg-[#1C1C1E] border border-white/[0.1] focus:border-[#8f74ff] rounded-xl px-4 py-3 text-[14px] text-white outline-none transition-all pr-10"
                />
                <Percent className="w-4 h-4 text-white/30 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-white/30 mt-2">Applied automatically to subtotal at checkout.</p>
            </div>
          </div>
        </div>

        {/* Delivery & Expected Date Rules */}
        <div className="lg:col-span-2 bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-[16px] font-semibold text-white">Delivery Rules</h2>
                <p className="text-[12px] text-white/45">Charges & Dates per Category</p>
              </div>
            </div>
            <button
              onClick={addCategoryRule}
              className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-[13px] font-medium text-white/80 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Rule
            </button>
          </div>

          <div className="space-y-4">
            {categoryRules.length === 0 ? (
              <div className="text-center py-12 border border-white/[0.04] rounded-xl border-dashed">
                <Truck className="w-8 h-8 text-white/20 mx-auto mb-3" />
                <p className="text-[14px] text-white/50">No delivery rules defined.</p>
                <p className="text-[12px] text-white/30 mt-1">Default delivery charge is 0 and default time is 3 days.</p>
              </div>
            ) : (
              categoryRules.map((rule, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] relative group">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {!rule.isEditing && (
                      <button
                        onClick={() => updateCategoryRule(idx, 'isEditing', true)}
                        className="text-white/30 hover:text-[#8f74ff] transition-colors p-1"
                        title="Edit Rule"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => removeCategoryRule(idx)}
                      className="text-white/30 hover:text-red-400 transition-colors p-1"
                      title="Remove Rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-4 pr-16">
                    <div>
                      <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1.5">Category Name</label>
                      {rule.isEditing ? (
                        <div className="relative">
                          <select
                            value={rule.category}
                            onChange={e => updateCategoryRule(idx, 'category', e.target.value)}
                            className="w-full bg-[#1C1C1E] border border-white/[0.1] focus:border-blue-400/50 rounded-lg px-3 py-2 pr-8 appearance-none text-[13px] text-white outline-none transition-all cursor-pointer"
                          >
                            <option value="" disabled className="text-white/30">Select Category</option>
                            {availableCategories.map(cat => (
                              <option key={cat} value={cat} className="bg-[#1C1C1E] capitalize">{cat}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-white/50 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      ) : (
                        <div className="px-3 py-2 bg-white/[0.02] border border-transparent rounded-lg text-[13px] text-white font-semibold capitalize">
                          {rule.category || '—'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1.5">Delivery Fee (PKR)</label>
                      {rule.isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={rule.deliveryCharge}
                          onChange={e => updateCategoryRule(idx, 'deliveryCharge', e.target.value)}
                          className="w-full bg-[#1C1C1E] border border-white/[0.1] focus:border-blue-400/50 rounded-lg px-3 py-2 text-[13px] text-white outline-none transition-all"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-white/[0.02] border border-transparent rounded-lg text-[13px] text-white font-semibold">
                          {rule.deliveryCharge} PKR
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-white/50 uppercase tracking-wider mb-1.5">Expected Days</label>
                      {rule.isEditing ? (
                        <input
                          type="number"
                          min="1"
                          value={rule.expectedDeliveryDays}
                          onChange={e => updateCategoryRule(idx, 'expectedDeliveryDays', e.target.value)}
                          className="w-full bg-[#1C1C1E] border border-white/[0.1] focus:border-blue-400/50 rounded-lg px-3 py-2 text-[13px] text-white outline-none transition-all"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-white/[0.02] border border-transparent rounded-lg text-[13px] text-white font-semibold">
                          {rule.expectedDeliveryDays} Days
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {rule.isEditing && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          if (!rule.category) {
                            toast.error("Please select a category");
                            return;
                          }
                          updateCategoryRule(idx, 'isEditing', false);
                        }}
                        className="px-4 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-[12px] font-semibold transition-all border border-blue-500/20"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="mt-6 flex items-start gap-2.5 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-blue-400/90 leading-relaxed">
              If an order contains products from multiple categories, the system will automatically apply the highest delivery charge and longest expected delivery time among them.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
