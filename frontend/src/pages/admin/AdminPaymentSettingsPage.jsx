import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Save, Loader2, CreditCard } from 'lucide-react';
import adminApi from '../../lib/adminAxios';

const fetchSettings = () => adminApi.get('/payment-settings').then(r => r.data.data ?? r.data);

export default function AdminPaymentSettingsPage() {
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ['payment-settings'],
    queryFn: fetchSettings,
  });

  const { register, handleSubmit, formState: { isDirty } } = useForm({
    defaultValues: async () => {
      const data = await fetchSettings();
      return data || {
        codEnabled: true,
        jazzcashEnabled: false,
        jazzcashAccountName: '',
        jazzcashAccountNumber: '',
        easypaisaEnabled: false,
        easypaisaAccountName: '',
        easypaisaAccountNumber: '',
        bankEnabled: false,
        bankName: '',
        bankAccountName: '',
        bankAccountNumber: '',
        bankIBAN: '',
        whatsappNumber: '',
        paymentInstructions: '',
      };
    },
  });

  const updateMut = useMutation({
    mutationFn: (data) => adminApi.put('/payment-settings', data),
    onSuccess: () => {
      toast.success('Payment settings updated');
      queryClient.invalidateQueries(['payment-settings']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    },
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#7a5cff] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 pb-20 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#7a5cff]/10 border border-[#7a5cff]/20 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-[#9a84ff]" />
        </div>
        <div>
          <h1 className="text-[22px] font-bold text-white tracking-[-0.02em] leading-tight">Payment Settings</h1>
          <p className="text-[13px] text-white/80">Manage dynamic payment methods for checkout</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => updateMut.mutate(d))} className="space-y-6">
        
        {/* COD Section */}
        <div className="ds-card p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <input type="checkbox" id="codEnabled" {...register('codEnabled')} className="w-4 h-4 rounded bg-[#1c2340] border-white/10 text-[#7a5cff] focus:ring-[#7a5cff]/30 cursor-pointer" />
            <label htmlFor="codEnabled" className="text-[15px] font-semibold text-white cursor-pointer">Enable Cash on Delivery (COD)</label>
          </div>
          <p className="text-[13px] text-white/80 pl-7">Allows customers to place an order and pay upon delivery.</p>
        </div>

        {/* WhatsApp & Instructions */}
        <div className="ds-card p-5 border border-white/5">
          <h2 className="text-[15px] font-semibold text-white mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-1.5">WhatsApp Number (For Payment Screenshots)</label>
              <input type="text" placeholder="e.g. 923001234567 (with country code, no +)" {...register('whatsappNumber')}
                className="w-full bg-[#1c2340] border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white outline-none focus:border-[#7a5cff]" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-1.5">Global Payment Instructions</label>
              <textarea placeholder="Any specific note for the user during manual payment?" rows="2" {...register('paymentInstructions')}
                className="w-full bg-[#1c2340] border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white outline-none focus:border-[#7a5cff] resize-none" />
            </div>
          </div>
        </div>

        {/* JazzCash Section */}
        <div className="ds-card p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
            <input type="checkbox" id="jazzcashEnabled" {...register('jazzcashEnabled')} className="w-4 h-4 rounded bg-[#1c2340] border-white/10 text-[#7a5cff] focus:ring-[#7a5cff]/30 cursor-pointer" />
            <label htmlFor="jazzcashEnabled" className="text-[15px] font-semibold text-white cursor-pointer">Enable JazzCash</label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-1.5">Account Name</label>
              <input type="text" placeholder="e.g. Muhammad Ali" {...register('jazzcashAccountName')}
                className="w-full bg-[#1c2340] border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white outline-none focus:border-[#7a5cff]" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-1.5">Account / Mobile Number</label>
              <input type="text" placeholder="e.g. 0300 1234567" {...register('jazzcashAccountNumber')}
                className="w-full bg-[#1c2340] border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white outline-none focus:border-[#7a5cff]" />
            </div>
          </div>
        </div>

        {/* EasyPaisa Section */}
        <div className="ds-card p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
            <input type="checkbox" id="easypaisaEnabled" {...register('easypaisaEnabled')} className="w-4 h-4 rounded bg-[#1c2340] border-white/10 text-[#7a5cff] focus:ring-[#7a5cff]/30 cursor-pointer" />
            <label htmlFor="easypaisaEnabled" className="text-[15px] font-semibold text-white cursor-pointer">Enable EasyPaisa</label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-1.5">Account Name</label>
              <input type="text" placeholder="e.g. Muhammad Ali" {...register('easypaisaAccountName')}
                className="w-full bg-[#1c2340] border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white outline-none focus:border-[#7a5cff]" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-1.5">Account / Mobile Number</label>
              <input type="text" placeholder="e.g. 0345 1234567" {...register('easypaisaAccountNumber')}
                className="w-full bg-[#1c2340] border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white outline-none focus:border-[#7a5cff]" />
            </div>
          </div>
        </div>

        {/* Bank Transfer Section */}
        <div className="ds-card p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
            <input type="checkbox" id="bankEnabled" {...register('bankEnabled')} className="w-4 h-4 rounded bg-[#1c2340] border-white/10 text-[#7a5cff] focus:ring-[#7a5cff]/30 cursor-pointer" />
            <label htmlFor="bankEnabled" className="text-[15px] font-semibold text-white cursor-pointer">Enable Bank Transfer</label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-1.5">Bank Name</label>
              <input type="text" placeholder="e.g. Meezan Bank" {...register('bankName')}
                className="w-full bg-[#1c2340] border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white outline-none focus:border-[#7a5cff]" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-1.5">Account Title</label>
              <input type="text" placeholder="e.g. DoorSetFix Tech" {...register('bankAccountName')}
                className="w-full bg-[#1c2340] border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white outline-none focus:border-[#7a5cff]" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-1.5">Account Number</label>
              <input type="text" placeholder="e.g. 0123456789" {...register('bankAccountNumber')}
                className="w-full bg-[#1c2340] border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white outline-none focus:border-[#7a5cff]" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-1.5">IBAN</label>
              <input type="text" placeholder="e.g. PK00MEZN0000..." {...register('bankIBAN')}
                className="w-full bg-[#1c2340] border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white outline-none focus:border-[#7a5cff]" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={updateMut.isPending || !isDirty}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#7a5cff] hover:bg-[#8c72ff] text-white rounded-xl text-[14px] font-semibold transition-all disabled:opacity-50 disabled:hover:bg-[#7a5cff]"
        >
          {updateMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" strokeWidth={2} />}
          Save Settings
        </button>
      </form>
    </div>
  );
}
