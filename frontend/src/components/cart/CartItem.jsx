import { Minus, Plus, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCartStore();

  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex items-start gap-3 py-4 border-b border-white/[0.06] last:border-0">
      {/* Image */}
      <div className="w-16 h-16 bg-white/[0.04] border border-white/[0.06] rounded-xl flex-shrink-0 overflow-hidden">
        {item.image
          ? <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1" />
          : <div className="w-full h-full" />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-white line-clamp-2 leading-snug">{item.title}</p>
        <p className="text-[12px] text-white/45 mt-0.5">
          {((val) => `RS ${new Intl.NumberFormat("en-US").format(val)}`)(item.price)} each
        </p>

        {/* Qty stepper */}
        <div className="flex items-center gap-2 mt-2.5">
          <button
            onClick={() => updateQty(item.productId, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/[0.06] disabled:opacity-40 transition-all"
          >
            <Minus className="w-3 h-3" strokeWidth={2} />
          </button>
          <span className="text-[13px] font-bold text-white w-5 text-center tabular-nums">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQty(item.productId, item.quantity + 1)}
            disabled={item.stock && item.quantity >= item.stock}
            className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/[0.06] disabled:opacity-40 transition-all"
          >
            <Plus className="w-3 h-3" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Line total + remove */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <p className="text-[13px] font-bold text-white">
          {((val) => `RS ${new Intl.NumberFormat("en-US").format(val)}`)(lineTotal)}
        </p>
        <button
          onClick={() => removeItem(item.productId)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-[#ff9aad] hover:bg-[#ff5e7d]/10 transition-all"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
