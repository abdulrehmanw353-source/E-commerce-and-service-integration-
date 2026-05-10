import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, User, Mail, Shield, ShieldCheck, UserCheck, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';
import { useAdminAuthStore } from '../../store/adminAuthStore';

// ─── API Calls ────────────────────────────────────────────────
const fetchCustomer = (id) => adminApi.get(`/admin/users/${id}`).then(r => r.data.data ?? r.data);
const updateRole = ({ id, role }) => adminApi.patch(`/admin/users/${id}/role`, { role }).then(r => r.data);

export default function AdminCustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const currentAdminId = useAdminAuthStore(s => s.user?._id);

  const { data: customer, isLoading, isError } = useQuery({
    queryKey: ['admin-customer', id],
    queryFn: () => fetchCustomer(id),
    enabled: !!id,
  });

  const roleMut = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      qc.invalidateQueries(['admin-customer', id]);
      qc.invalidateQueries(['admin-users']);
      toast.success('User role updated successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  });

  if (isLoading) {
    return (
      <div className="p-6 sm:p-10 flex justify-center items-center h-full">
        <div className="w-8 h-8 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="p-6 sm:p-10">
        <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-8 text-center max-w-md mx-auto">
          <User className="w-12 h-12 text-white/20 mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-[20px] font-semibold text-white mb-2">Customer Not Found</h2>
          <p className="text-[14px] text-white/50 mb-6">This customer may have been deleted or does not exist.</p>
          <button
            onClick={() => navigate('/admin/customers')}
            className="px-6 py-2.5 bg-[#0071E3] text-white text-[14px] font-medium rounded-full hover:bg-[#0077ED] transition-all"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  const isSelf = currentAdminId === customer._id;

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-6">
      
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/customers')}
            className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-[13px] text-white/40 mt-1">Customer ID: {customer._id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <a
            href={`mailto:${customer.email}`}
            className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-white text-[13px] font-medium rounded-xl transition-all flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Email Customer
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ─── Left Col: Profile ─── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111111] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.08]">
              <h2 className="text-[16px] font-semibold text-white">Customer Overview</h2>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-8">
              <div>
                <p className="text-[12px] font-semibold text-white/40 uppercase tracking-wider mb-2">Contact Info</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0071E3]/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-[#0071E3]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[14px] text-white font-medium">{customer.firstName} {customer.lastName}</p>
                      <p className="text-[12px] text-white/40">Full Name</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0071E3]/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#0071E3]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[14px] text-white font-medium">{customer.email}</p>
                      <p className="text-[12px] text-white/40">Email Address</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[12px] font-semibold text-white/40 uppercase tracking-wider mb-2">Account Status</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white/60" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[14px] text-white font-medium">
                        {new Date(customer.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                      <p className="text-[12px] text-white/40">Customer Since</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      customer.role === 'admin' ? 'bg-purple-500/20' : 'bg-green-500/20'
                    }`}>
                      {customer.role === 'admin' 
                        ? <ShieldCheck className="w-5 h-5 text-purple-400" strokeWidth={1.5} />
                        : <UserCheck className="w-5 h-5 text-green-400" strokeWidth={1.5} />
                      }
                    </div>
                    <div>
                      <p className="text-[14px] text-white font-medium capitalize">{customer.role}</p>
                      <p className="text-[12px] text-white/40">Role</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Right Col: Actions ─── */}
        <div className="space-y-6">
          <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-white/60" strokeWidth={1.5} />
              <h2 className="text-[16px] font-semibold text-white">Permissions</h2>
            </div>
            
            <p className="text-[13px] text-white/50 mb-6 leading-relaxed">
              Admins have full access to the dashboard, orders, and products. Customers only have access to the storefront.
            </p>

            {isSelf ? (
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[13px]">
                You cannot change your own role.
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => roleMut.mutate({ id: customer._id, role: 'admin' })}
                  disabled={roleMut.isPending || customer.role === 'admin'}
                  className={`w-full py-3 rounded-xl text-[13px] font-semibold transition-all ${
                    customer.role === 'admin'
                      ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400 cursor-default'
                      : 'bg-[#2C2C2E] border border-white/[0.08] text-white hover:border-[#0071E3] hover:bg-[#0071E3]/10'
                  }`}
                >
                  {customer.role === 'admin' ? 'Current Role: Admin' : 'Make Admin'}
                </button>
                <button
                  onClick={() => roleMut.mutate({ id: customer._id, role: 'customer' })}
                  disabled={roleMut.isPending || customer.role === 'customer'}
                  className={`w-full py-3 rounded-xl text-[13px] font-semibold transition-all ${
                    customer.role === 'customer'
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400 cursor-default'
                      : 'bg-[#2C2C2E] border border-white/[0.08] text-white hover:border-white/[0.2] hover:bg-white/[0.05]'
                  }`}
                >
                  {customer.role === 'customer' ? 'Current Role: Customer' : 'Make Customer'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
