import type { SelectedProduct } from "../models/types";

/**
 * Calculates the unit price for a selected product based on whether an add-on is selected.
 * If an add-on is selected, it returns the add-on price. Otherwise, it returns the base product price.
 */
const calculatePrice = (product: SelectedProduct): SelectedProduct => {
  const price = product.selectedAddOnId
    ? Number(product.selectedAddOnPrice)
    : Number(product.price || 0);
  const subTotal = price * product.quantity;
  return { ...product, subTotal };
};

export default calculatePrice;
