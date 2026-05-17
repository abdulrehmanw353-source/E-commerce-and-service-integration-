import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ImageIcon, Plus, X, Trash2, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';

const schema = yup.object({
  title:       yup.string().min(3, 'Min 3 characters').required('Title is required'),
  price:       yup.number().positive('Must be positive').required('Price is required'),
  category:    yup.string().required('Category is required'),
  stock:       yup.number().integer().min(0, 'Min 0').required('Stock is required'),
  description: yup.string().optional(),
});

const CATEGORIES = ['Laptops', 'Desktops', 'Mobiles', 'Tablets', 'Audio', 'Gaming', 'Accessories', 'Other'];

function FormSection({ title, children }) {
  return (
    <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-5 space-y-4">
      <h3 className="text-[13px] font-semibold text-white/80 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-white/70 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[12px] text-red-400 mt-1">{error}</p>}
    </div>
  );
}

const INPUT = "w-full bg-[#1c2340] border border-[#7a5cff]/30 hover:border-[#9a84ff]/50 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/35 outline-none focus:border-[#a894ff] focus:bg-[#242c4b] focus:ring-4 focus:ring-[#8f74ff]/20 transition-all shadow-inner";

export default function AdminProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [imageUrls, setImageUrls] = useState(['']);
  const [deleteModal, setDeleteModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => adminApi.get(`/admin/products/${id}`).then(r => r.data.data?.product ?? r.data.data ?? r.data),
    enabled: !!id,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  // Populate form when data loads
  useEffect(() => {
    if (data) {
      reset({
        title: data.title || '',
        price: data.price || '',
        category: data.category || '',
        stock: data.stock ?? 0,
        description: data.description || '',
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImageUrls(data.images?.length ? data.images : ['']);
    }
  }, [data, reset]);

  const updateMut = useMutation({
    mutationFn: (body) => adminApi.patch(`/admin/products/${id}`, body).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries(['admin-products']);
      qc.invalidateQueries(['admin-product', id]);
      toast.success('Product updated!');
      navigate('/admin/products');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update.'),
  });

  const deleteMut = useMutation({
    mutationFn: () => adminApi.delete(`/admin/products/${id}`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries(['admin-products']);
      toast.success('Product deleted.');
      navigate('/admin/products');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete.'),
  });

  const onSubmit = (formData) => {
    const images = imageUrls.filter(u => u.trim());
    updateMut.mutate({ ...formData, images });
  };

  const addImageField = () => setImageUrls(prev => [...prev, '']);
  const removeImageField = (i) => setImageUrls(prev => prev.filter((_, idx) => idx !== i));
  const updateImageUrl = (i, val) => setImageUrls(prev => prev.map((u, idx) => idx === i ? val : u));

  if (isLoading) return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-white/[0.06] rounded-xl" />
      <div className="h-64 bg-white/[0.06] rounded-2xl" />
    </div>
  );

  return (
    <div className="p-4 sm:p-6 w-full">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/products')}
            className="p-2 rounded-xl text-white hover:bg-white/[0.06] transition-all">
            <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <div>
            <h1 className="text-[20px] font-bold text-white tracking-[-0.02em]">Edit Product</h1>
            <p className="text-[13px] text-white/35 font-mono mt-0.5">{id?.slice(-12)?.toUpperCase()}</p>
          </div>
        </div>
        <button onClick={() => setDeleteModal(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-white bg-[#ff3b57] border border-[#ff3b57]/60 hover:bg-[#ff5e7d] text-[13px] font-semibold transition-all shadow-[0_0_16px_rgba(255,59,87,0.25)]">
          <Trash2 className="w-4 h-4" strokeWidth={1.75} /> Delete
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid xl:grid-cols-3 gap-5">

          {/* ─── Left ─── */}
          <div className="xl:col-span-2 space-y-5">
            <FormSection title="Product Info">
              <Field label="Title" required error={errors.title?.message}>
                <input {...register('title')} placeholder="Product name" className={INPUT} />
              </Field>
              <Field label="Description" error={errors.description?.message}>
                <textarea {...register('description')} rows={5}
                  placeholder="Product description..."
                  className={`${INPUT} resize-none`} />
              </Field>
            </FormSection>

            <FormSection title="Images">
              <p className="text-[12px] text-white/35 -mt-2">First image is the primary display image.</p>
              <div className="space-y-2.5">
                {imageUrls.map((url, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input type="url" value={url} onChange={e => updateImageUrl(i, e.target.value)}
                      placeholder={`Image URL ${i + 1}`} className={`${INPUT} flex-1`} />
                    {url.trim() && (
                      <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex-shrink-0 overflow-hidden">
                        <img src={url} alt="" onError={e => e.target.style.display='none'}
                          className="w-full h-full object-contain" />
                      </div>
                    )}
                    {imageUrls.length > 1 && (
                      <button type="button" onClick={() => removeImageField(i)}
                        className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0">
                        <X className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addImageField}
                className="flex items-center gap-2 text-[13px] text-[#0071E3] hover:opacity-80 transition-opacity mt-1">
                <Plus className="w-4 h-4" strokeWidth={2} /> Add image URL
              </button>
            </FormSection>
          </div>

          {/* ─── Right ─── */}
          <div className="space-y-5">
            <FormSection title="Pricing">
              <Field label="Price (RS)" required error={errors.price?.message}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-[14px]">$</span>
                  <input type="number" step="0.01" {...register('price')} placeholder="0.00"
                    className={`${INPUT} pl-8`} />
                </div>
              </Field>
            </FormSection>

            <FormSection title="Inventory">
              <Field label="Stock Quantity" required error={errors.stock?.message}>
                <input type="number" {...register('stock')} placeholder="0" className={INPUT} />
              </Field>
            </FormSection>

            <FormSection title="Organization">
              <Field label="Category" required error={errors.category?.message}>
                <div className="relative">
                  <select {...register('category')} className={`${INPUT} cursor-pointer appearance-none pr-10`}>
                    <option value="" className="bg-[#1C1C1E]">Select category</option>
                    {CATEGORIES.map(c => (
                      <option key={c} value={c.toLowerCase()} className="bg-[#1C1C1E]">{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-white/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </Field>
            </FormSection>

            {/* Preview */}
            <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-4">
              <p className="text-[11px] font-semibold text-white/35 uppercase tracking-wider mb-3">Preview</p>
              <div className="aspect-square bg-white/[0.03] rounded-xl flex items-center justify-center overflow-hidden">
                {imageUrls[0]?.trim()
                  ? <img src={imageUrls[0]} alt="preview" className="w-full h-full object-contain p-2" />
                  : <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="w-8 h-8 text-white/15" strokeWidth={1.5} />
                      <p className="text-[11px] text-white/20">No image URL</p>
                    </div>
                }
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button type="submit" disabled={updateMut.isPending}
                className="w-full py-3.5 ds-btn-primary disabled:opacity-60 text-white rounded-xl text-[14px] font-semibold transition-all active:scale-[0.98]">
                {updateMut.isPending ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => navigate('/admin/products')}
                className="w-full py-3.5 border border-[#6fe7ff]/30 bg-[#141a2f] hover:bg-[#6fe7ff]/10 hover:border-[#6fe7ff]/45 text-[#bff6ff] hover:text-white rounded-xl text-[14px] font-semibold transition-all active:scale-[0.98]">
                Discard
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* ─── Delete Confirm ─── */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteModal(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-[#1C1C1E] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5 text-red-400" strokeWidth={1.75} />
            </div>
            <h3 className="text-[16px] font-semibold text-white mb-1">Delete this product?</h3>
            <p className="text-[13px] text-white/45 mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl text-[14px] font-medium text-white/60 bg-white/[0.06] hover:bg-white/[0.1] transition-all">Cancel</button>
              <button onClick={() => deleteMut.mutate()} disabled={deleteMut.isPending}
                className="flex-1 py-2.5 rounded-xl text-[14px] font-medium text-white bg-red-500 hover:bg-red-400 disabled:opacity-60 transition-all">
                {deleteMut.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
