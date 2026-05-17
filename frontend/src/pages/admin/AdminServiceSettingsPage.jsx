import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Save, AlertCircle, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';

const fetchServiceSettings = () => adminApi.get('/service-settings').then(r => r.data.data ?? r.data);
const updateServiceSettings = (data) => adminApi.put('/service-settings', data).then(r => r.data.data ?? r.data);

export default function AdminServiceSettingsPage() {
  const qc = useQueryClient();
  const [formData, setFormData] = useState({
    isServiceActive: true,
    allowedCities: '',
    allowedStates: '',
    allowedCountries: '',
    defaultPaymentModeRule: 'pay_after_service_completion',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-service-settings'],
    queryFn: fetchServiceSettings,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        isServiceActive: data.isServiceActive ?? true,
        allowedCities: data.allowedCities?.join(', ') || '',
        allowedStates: data.allowedStates?.join(', ') || '',
        allowedCountries: data.allowedCountries?.join(', ') || '',
        defaultPaymentModeRule: data.defaultPaymentModeRule || 'pay_after_service_completion',
      });
    }
  }, [data]);

  const updateMut = useMutation({
    mutationFn: (payload) => updateServiceSettings(payload),
    onSuccess: () => {
      qc.invalidateQueries(['admin-service-settings']);
      toast.success('Service settings updated successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      isServiceActive: formData.isServiceActive,
      allowedCities: formData.allowedCities.split(',').map(s => s.trim()).filter(Boolean),
      allowedStates: formData.allowedStates.split(',').map(s => s.trim()).filter(Boolean),
      allowedCountries: formData.allowedCountries.split(',').map(s => s.trim()).filter(Boolean),
      defaultPaymentModeRule: formData.defaultPaymentModeRule,
    };
    updateMut.mutate(payload);
  };

  if (isLoading) {
    return <div className="p-6 text-white/50">Loading settings...</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#00f5d4]/20 flex items-center justify-center flex-shrink-0">
          <Settings className="w-5 h-5 text-[#00f5d4]" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-[-0.02em]">Service Area & Payments</h2>
          <p className="text-[13px] text-white/50">Manage booking rules, service locations, and default payment modes.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Global Toggle */}
        <div className="ds-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-semibold text-white">Enable Repair Service System</p>
              <p className="text-[12px] text-white/40 mt-1">If disabled, customers cannot book any repair services.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={formData.isServiceActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isServiceActive: e.target.checked }))} />
              <div className="w-11 h-6 bg-white/[0.08] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00f5d4]"></div>
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Location Restrict */}
          <div className="ds-card p-6 space-y-4">
            <h3 className="text-[14px] font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8f74ff]" /> Location Restrictions
            </h3>
            <p className="text-[12px] text-white/45">Only allow bookings from specific regions. Leave blank to allow any.</p>
            
            <div>
              <label className="block text-[12px] text-white/70 mb-1.5">Allowed Cities (comma separated)</label>
              <input type="text" placeholder="e.g. Sargodha, Lahore" value={formData.allowedCities}
                onChange={(e) => setFormData({ ...formData, allowedCities: e.target.value })}
                className="w-full bg-[#1a1f33] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white focus:border-[#8f74ff] outline-none" />
            </div>
            <div>
              <label className="block text-[12px] text-white/70 mb-1.5">Allowed States/Provinces</label>
              <input type="text" placeholder="e.g. Punjab, Sindh" value={formData.allowedStates}
                onChange={(e) => setFormData({ ...formData, allowedStates: e.target.value })}
                className="w-full bg-[#1a1f33] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white focus:border-[#8f74ff] outline-none" />
            </div>
            <div>
              <label className="block text-[12px] text-white/70 mb-1.5">Allowed Countries</label>
              <input type="text" placeholder="e.g. Pakistan" value={formData.allowedCountries}
                onChange={(e) => setFormData({ ...formData, allowedCountries: e.target.value })}
                className="w-full bg-[#1a1f33] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white focus:border-[#8f74ff] outline-none" />
            </div>
            <div className="flex items-start gap-2 bg-[#8f74ff]/10 border border-[#8f74ff]/20 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 text-[#8f74ff] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-white/70">
                Customers must enter an address that matches these constraints to place a repair booking. If all fields are blank, service is available globally.
              </p>
            </div>
          </div>

          {/* Payment Rules */}
          <div className="ds-card p-6 space-y-4">
            <h3 className="text-[14px] font-semibold text-white uppercase tracking-wider">Default Payment Flow</h3>
            <p className="text-[12px] text-white/45">Configure the expected payment workflow for repair services.</p>
            
            <div>
              <label className="block text-[12px] text-white/70 mb-1.5">Payment Rule</label>
              <select
                value={formData.defaultPaymentModeRule}
                onChange={(e) => setFormData({ ...formData, defaultPaymentModeRule: e.target.value })}
                className="w-full bg-[#1a1f33] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white focus:border-[#8f74ff] outline-none"
              >
                <option value="advance_required">Advance Payment Required</option>
                <option value="pay_after_inspection">Pay After Inspection</option>
                <option value="pay_after_service_completion">Pay on Completion (Default)</option>
                <option value="partial_advance">Partial Advance Required</option>
              </select>
            </div>
            <div className="mt-4 bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">
              <p className="text-[12px] text-white/60 leading-relaxed">
                <strong className="text-white/80">Advance Payment Required:</strong> Customer must pay before technician visits.<br/>
                <strong className="text-white/80">Pay After Inspection:</strong> Initial inspection is free/flat rate, final cost paid later.<br/>
                <strong className="text-white/80">Pay on Completion:</strong> All charges paid after successful repair.<br/>
                <strong className="text-white/80">Partial Advance:</strong> Collect a partial sum to confirm the booking.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={updateMut.isPending}
            className="ds-btn-primary px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 text-[14px]">
            <Save className="w-4 h-4" />
            {updateMut.isPending ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}
