import { Minus, Plus, X } from 'lucide-react';
import { useUpdateCartItem, useRemoveCartItem } from '../../hooks/useCart';
import toast from 'react-hot-toast';

export default function CartItem({ item }) {
  const updateMut = useUpdateCartItem();
  const removeMut = useRemoveCartItem();

  const product  = item.product ?? {};
  const image    = product.images?.[0] ?? item.image;
  const title    = product.title  ?? item.title  ?? 'Product';
  const price    = item.price ?? product.price ?? 0;
  const itemId   = item._id ?? item.productId;

  const handleQty = (delta) => {
    const next = (item.quantity || 1) + delta;
    if (next < 1) return;
    updateMut.mutate({ itemId, quantity: next }, {
      onError: () => toast.error('Could not update quantity.'),
    });
  };

  const handleRemove = () => {
    removeMut.mutate(itemId, {
      onError: () => toast.error('Could not remove item.'),
    });
  };

  return (
    <div className="flex items-start gap-3 py-4 border-b border-[#F5F5F7] last:border-0">
      {/* Image */}
      <div className="w-16 h-16 bg-[#F5F5F7] rounded-xl flex-shrink-0 overflow-hidden">
        {image
          ? <img src={image} alt={title} className="w-full h-full object-contain p-1" />
          : <div className="w-full h-full" />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-[#1D1D1F] line-clamp-2 leading-snug">{title}</p>
        <p className="text-[13px] font-semibold text-[#1D1D1F] mt-1">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)}
        </p>

        {/* Qty stepper */}
        <div className="flex items-center gap-2 mt-2.5">
          <button
            onClick={() => handleQty(-1)}
            disabled={updateMut.isPending || item.quantity <= 1}
            className="w-7 h-7 rounded-full border border-[#D2D2D7] flex items-center justify-center text-[#1D1D1F] hover:bg-[#F5F5F7] disabled:opacity-40 transition-all"
          >
            <Minus className="w-3 h-3" strokeWidth={2} />
          </button>
          <span className="text-[14px] font-semibold text-[#1D1D1F] w-5 text-center tabular-nums">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQty(+1)}
            disabled={updateMut.isPending}
            className="w-7 h-7 rounded-full border border-[#D2D2D7] flex items-center justify-center text-[#1D1D1F] hover:bg-[#F5F5F7] disabled:opacity-40 transition-all"
          >
            <Plus className="w-3 h-3" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Line total + remove */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <p className="text-[14px] font-bold text-[#1D1D1F]">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price * (item.quantity || 1))}
        </p>
        <button
          onClick={handleRemove}
          disabled={removeMut.isPending}
          className="w-6 h-6 rounded-full flex items-center justify-center text-[#86868B] hover:text-[#FF3B30] hover:bg-red-50 disabled:opacity-40 transition-all"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
