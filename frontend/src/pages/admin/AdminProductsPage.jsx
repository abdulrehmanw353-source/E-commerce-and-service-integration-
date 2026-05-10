import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2, Package, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';
import StatusBadge from '../../components/admin/StatusBadge';

const fetchProducts = (params) =>
  adminApi.get('/admin/products/', { params }).then(r => r.data.data ?? r.data);
const deleteProduct = (id) => adminApi.delete(`/admin/products/${id}`).then(r => r.data);

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => fetchProducts({ page, limit: 15, keyword: search || undefined }),
    keepPreviousData: true,
    staleTime: 30_000,
  });

  const products = Array.isArray(data) ? data : (data?.products || []);
  const totalPages = data?.totalPages || 1;
  const totalProducts = data?.totalProducts || products.length;

  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries(['admin-products']);
      toast.success('Product deleted.');
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete.'),
  });

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-semibold text-white">Products</h2>
          <p className="text-[13px] text-white/35 mt-0.5">{totalProducts} total</p>
        </div>
        <Link
          to="/admin/products/create"
          id="admin-create-product"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-semibold rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" strokeWidth={2} /> Add Product
        </Link>
      </div>

      {/* ─── Search ─── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" strokeWidth={1.75} />
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full bg-[#1C1C1E] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-[#0071E3] transition-all"
        />
      </div>

      {/* ─── Table ─── */}
      <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Product', 'Category', 'Price', 'Stock', 'Rating', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-[11px] font-semibold text-white/35 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-4 bg-white/[0.06] rounded-full animate-pulse w-full" /></td>
                  ))}</tr>
                ))
                : products.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center">
                        <Package className="w-10 h-10 text-white/15 mx-auto mb-3" strokeWidth={1.5} />
                        <p className="text-[14px] font-medium text-white/30">No products found</p>
                        <Link to="/admin/products/create"
                          className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-[#0071E3] hover:opacity-80">
                          <Plus className="w-3.5 h-3.5" strokeWidth={2} /> Add your first product
                        </Link>
                      </td>
                    </tr>
                  )
                  : products.map(p => (
                    <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {p.images?.[0]
                            ? <img src={p.images[0]} alt={p.title} className="w-10 h-10 object-contain rounded-xl bg-white/[0.04] flex-shrink-0" />
                            : <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                                <ImageIcon className="w-4 h-4 text-white/20" strokeWidth={1.5} />
                              </div>
                          }
                          <div className="min-w-0">
                            <p className="font-medium text-white line-clamp-1 max-w-[200px]">{p.title}</p>
                            <p className="text-[11px] text-white/30 mt-0.5 font-mono">{p._id?.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-white/50 capitalize">{p.category}</td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.price)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`font-semibold tabular-nums ${p.stock === 0 ? 'text-red-400' : p.stock < 5 ? 'text-yellow-400' : 'text-white/70'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/40 tabular-nums">
                        ★ {p.ratings?.toFixed(1) ?? '—'} ({p.numReviews ?? 0})
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/admin/products/${p._id}/edit`}
                            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </Link>
                          <button
                            onClick={() => setDeleteId(p._id)}
                            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* ─── Pagination ─── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
            <p className="text-[12px] text-white/35">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-white/50 bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-30 transition-all">Prev</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-white/50 bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-30 transition-all">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Delete Confirm Modal ─── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-[#1C1C1E] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5 text-red-400" strokeWidth={1.75} />
            </div>
            <h3 className="text-[16px] font-semibold text-white mb-1">Delete Product?</h3>
            <p className="text-[13px] text-white/45 mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl text-[14px] font-medium text-white/60 bg-white/[0.06] hover:bg-white/[0.1] transition-all">
                Cancel
              </button>
              <button onClick={() => deleteMut.mutate(deleteId)} disabled={deleteMut.isPending}
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
