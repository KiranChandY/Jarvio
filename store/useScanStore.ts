import { create } from 'zustand';

import type { ProductData } from '@/types/product';

interface ScanStore {
  products: Record<string, ProductData>;
  setProduct: (product: ProductData) => void;
  getProduct: (barcode: string) => ProductData | undefined;
}

export const useScanStore = create<ScanStore>((set, get) => ({
  products: {},
  setProduct: (product) =>
    set((state) => ({
      products: {
        ...state.products,
        [product.barcode]: product,
      },
    })),
  getProduct: (barcode) => get().products[barcode],
}));
