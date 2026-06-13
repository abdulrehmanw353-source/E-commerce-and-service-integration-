import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ImageIcon, Upload, X, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';
import { appendFormValues } from '../../utils/formData';

const schema = yup.object({
  title:       yup.string().min(3, 'Min 3 characters').required('Title is required'),
  price:       yup.number().positive('Must be positive').required('Price is required'),
  category:    yup.string().required('Category is required'),
  stock:       yup.number().integer().min(0, 'Min 0').required('Stock is required'),
  description: yup.string().min(10, 'Min 10 characters').optional(),
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

export default function AdminProductCreatePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [imageFiles, setImageFiles] = useState([]);
  const imagePreviews = useMemo(
    () => imageFiles.map((file) => URL.createObjectURL(file)),
    [imageFiles],
  );

  useEffect(
    () => () => imagePreviews.forEach((url) => URL.revokeObjectURL(url)),
    [imagePreviews],
  );

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { stock: 0, price: '' },
  });

  const createMut = useMutation({
    mutationFn: (body) => adminApi.post('/admin/products/create', body).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries(['admin-products']);
      toast.success('Product created successfully!');
      navigate('/admin/products');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create product.'),
  });

  const onSubmit = (data) => {
    if (!imageFiles.length) {
      toast.error('Select at least one product image.');
      return;
    }

    const formData = appendFormValues(new FormData(), data);
    imageFiles.forEach((file) => formData.append('images', file));
    createMut.mutate(formData);
  };

  const selectImages = (event) => {
    const selected = Array.from(event.target.files || []);
    setImageFiles((current) => [...current, ...selected].slice(0, 10));
    event.target.value = '';
  };

  const removeImage = (index) => {
    setImageFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="p-4 sm:p-6 w-full">
      {/* ─── Header ─── */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/products')}
          className="p-2 rounded-xl text-white hover:bg-white/[0.06] transition-all">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
        </button>
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-[-0.02em]">Add Product</h1>
          <p className="text-[13px] text-white/35 mt-0.5">Fill in the details to create a new product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid xl:grid-cols-3 gap-5">

          {/* ─── Left Column (main info) ─── */}
          <div className="xl:col-span-2 space-y-5">
            {/* Basic Info */}
            <FormSection title="Product Info">
              <Field label="Title" required error={errors.title?.message}>
                <input {...register('title')} placeholder="e.g. Apple MacBook Pro 14-inch M3" className={INPUT} />
              </Field>
              <Field label="Description" error={errors.description?.message}>
                <textarea {...register('description')} rows={5}
                  placeholder="Describe the product features, specs, and what's in the box..."
                  className={`${INPUT} resize-none`} />
              </Field>
            </FormSection>

            {/* Images */}
            <FormSection title="Images">
              <p className="text-[12px] text-white/35 -mt-2">Select up to 10 JPG, PNG, or WebP images. The first image is the primary display image.</p>
              <label className="flex items-center justify-center gap-2 w-full px-4 py-4 border border-dashed border-[#7a5cff]/40 rounded-xl text-[13px] text-[#c8bcff] bg-[#7a5cff]/5 hover:bg-[#7a5cff]/10 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" strokeWidth={2} />
                Select Images
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  multiple
                  onChange={selectImages}
                  className="sr-only"
                />
              </label>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imagePreviews.map((url, index) => (
                    <div key={url} className="relative aspect-square rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
                      <img src={url} alt={`Selected product ${index + 1}`} className="w-full h-full object-contain p-2" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-black/70 text-white/70 hover:text-red-300"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-white/30">{imageFiles.length}/10 images selected, 5MB maximum each.</p>
            </FormSection>
          </div>

          {/* ─── Right Column (meta) ─── */}
          <div className="space-y-5">
            {/* Pricing */}
            <FormSection title="Pricing">
              <Field label="Price (RS)" required error={errors.price?.message}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-[14px]">$</span>
                  <input type="number" step="0.01" {...register('price')} placeholder="0.00"
                    className={`${INPUT} pl-8`} />
                </div>
              </Field>
            </FormSection>

            {/* Inventory */}
            <FormSection title="Inventory">
              <Field label="Stock Quantity" required error={errors.stock?.message}>
                <input type="number" {...register('stock')} placeholder="0" className={INPUT} />
              </Field>
            </FormSection>

            {/* Category */}
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

            {/* Image preview card */}
            <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-4">
              <p className="text-[11px] font-semibold text-white/35 uppercase tracking-wider mb-3">Preview</p>
              <div className="aspect-square bg-white/[0.03] rounded-xl flex items-center justify-center overflow-hidden">
                {imagePreviews[0]
                  ? <img src={imagePreviews[0]} alt="preview" className="w-full h-full object-contain p-2" />
                  : <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="w-8 h-8 text-white/15" strokeWidth={1.5} />
                      <p className="text-[11px] text-white/20">Select an image above</p>
                    </div>
                }
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button type="submit" disabled={createMut.isPending}
                className="w-full py-3.5 ds-btn-primary disabled:opacity-60 text-white rounded-xl text-[14px] font-semibold transition-all active:scale-[0.98]">
                {createMut.isPending ? 'Creating…' : 'Create Product'}
              </button>
              <button type="button" onClick={() => navigate('/admin/products')}
                className="w-full py-3.5 border border-[#6fe7ff]/30 bg-[#141a2f] hover:bg-[#6fe7ff]/10 hover:border-[#6fe7ff]/45 text-[#bff6ff] hover:text-white rounded-xl text-[14px] font-semibold transition-all active:scale-[0.98]">
                Discard
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
