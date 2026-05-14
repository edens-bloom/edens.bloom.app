import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useStore } from "../../store/useStore";
import { Loader2, ShoppingBag, X } from "lucide-react";
import type { Product } from "../../models/types";
import { formatRs } from "../../utils/formatRs";
import Badge, { type BadgeType } from "./Badge";
import "./ProductGrid.scss";

const getTierPrice = (product: Product, tier: "tier1" | "tier2" | "tier3") => {
  const tierData = product.packages?.[tier];
  const tierPrice = tierData?.price;
  return Number(tierPrice ?? product.price);
};

const getTierImage = (product: Product, tier: "tier1" | "tier2" | "tier3") => {
  const tierData = product.packages?.[tier];
  const tierImage = tierData?.image;
  return typeof tierImage === "string" ? tierImage : product.image;
};

function galleryImages(p: Product): string[] {
  const urls = [
    getTierImage(p, "tier1"),
    getTierImage(p, "tier2"),
    getTierImage(p, "tier3"),
    p.image,
    p.plasticBagImage,
    p.paperBagImage,
    p.noBagImage,
  ].filter((u): u is string => typeof u === "string" && u.length > 0);
  return [...new Set(urls)];
}

type BundleKey = "single" | "bundle5" | "bundle10";
type PackKey = "none" | "plastic" | "paper";

const ProductGrid: React.FC = () => {
  const { products, fetchProducts, isLoading, error, addToCart } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [thumbIndex, setThumbIndex] = useState(0);
  const [bundle, setBundle] = useState<BundleKey>("single");
  const [packaging, setPackaging] = useState<PackKey>("none");
  const [quantity, setQuantity] = useState(1);
  const [addedFlash, setAddedFlash] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Ensure body scroll lock is always reset
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProduct]);

  const images = useMemo(
    () => (selectedProduct ? galleryImages(selectedProduct) : []),
    [selectedProduct],
  );

  const mainImage = images[thumbIndex] ?? "";

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setThumbIndex(0);
    setBundle("single");
    setPackaging("none");
    setQuantity(1);
    // body scroll lock now handled in useEffect
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    // body scroll lock now handled in useEffect
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };
    if (selectedProduct) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [selectedProduct]);

  if (isLoading) {
    return (
      <div className="page-container product-grid__state product-grid__state--loading">
        <Loader2 className="product-grid__spinner" size={48} />
        <p className="type-label-md">Loading our beautiful collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container product-grid__state product-grid__state--error">
        <p className="type-label-md">Oops! {error}</p>
        <button
          type="button"
          onClick={() => fetchProducts()}
          className="product-grid__retry"
        >
          Try Again
        </button>
      </div>
    );
  }

  const unit = selectedProduct ? getTierPrice(selectedProduct, "tier1") : 0;
  const tier2 = selectedProduct?.packages?.tier2;
  const tier3 = selectedProduct?.packages?.tier3;
  const bundle5Total = tier2?.price != null ? Number(tier2.price) : unit * 5;
  const bundle10Total = tier3?.price != null ? Number(tier3.price) : unit * 10;
  const save5 = Math.max(0, unit * 6 - bundle5Total);
  const save10 = Math.max(0, unit * 13 - bundle10Total);

  const packFee = selectedProduct
    ? packaging === "plastic"
      ? Number(selectedProduct.plasticBagPrice ?? 0)
      : packaging === "paper"
        ? Number(selectedProduct.paperBagPrice ?? 0)
        : Number(selectedProduct.noBagPrice ?? 0)
    : 0;

  const bundleTitle5 =
    typeof tier2?.label === "string" && tier2.label.trim()
      ? String(tier2.label)
      : "Buy 5 Get 1 Free";
  const bundleTitle10 =
    typeof tier3?.label === "string" && tier3.label.trim()
      ? String(tier3.label)
      : "Buy 10 Get 3 Free";

  const lineUnitPrice =
    bundle === "single"
      ? unit + packFee
      : bundle === "bundle5"
        ? bundle5Total + packFee
        : bundle10Total + packFee;

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const img = mainImage || selectedProduct.image;
    addToCart(
      {
        ...selectedProduct,
        price: lineUnitPrice,
        image: img,
      },
      quantity,
    );
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1600);
  };

  const fullStars = selectedProduct
    ? Math.round(Math.min(5, Math.max(0, selectedProduct.rating)))
    : 0;

  return (
    <>
      <section className="product-grid" id="occasions">
        <div className="product-grid__header">
          <div className="product-grid__intro">
            <h2 className="product-grid__title">
              Most <em className="product-grid__title-accent">loved</em>{" "}
              bouquets
            </h2>
          </div>
          <a href="#occasions" className="product-grid__cta">
            View All Products
          </a>
        </div>
        <div className="product-grid__cards">
          {products.map((product) => {
            const tier1Price = getTierPrice(product, "tier1");
            const tier1Image = getTierImage(product, "tier1");

            return (
              <div key={product.id} className="product-card fade-up visible">
                <div className="product-card__media ambient-shadow felt-texture">
                  <button
                    type="button"
                    className="product-card__media-link"
                    aria-label={`View ${product.name}`}
                    onClick={() => handleProductClick(product)}
                  >
                    <img src={tier1Image} alt={product.name} />
                  </button>
                  {product.badge && <Badge type={product.badge as BadgeType} />}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div className="product-card__info">
                    <h4 className="product-card__title" title={product.name}>
                      {product.name}
                    </h4>
                  </div>
                  <div className="product-card__price-row">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {product.oldPrice && (
                        <span className="product-card__old-price">
                          {formatRs(Number(product.oldPrice))}
                        </span>
                      )}
                      <span className="product-card__price">
                        {formatRs(tier1Price)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="product-card__meta-link"
                    onClick={() => handleProductClick(product)}
                  >
                    <span className="product-card__view-btn">View Detail</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedProduct &&
        createPortal(
          <div className="product-modal-overlay" onClick={handleCloseModal}>
            <div className="product-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="product-modal__close"
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              <div className="product-modal__scroll">
                <div className="product-modal__grid">
                  <div className="product-modal__gallery">
                    <div className="product-modal__main-img-wrap ambient-shadow">
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt={selectedProduct.name}
                          className="product-modal__main-img"
                        />
                      ) : null}
                    </div>
                    {images.length > 1 && (
                      <div
                        className="product-modal__thumbs"
                        role="tablist"
                        aria-label="Product images"
                      >
                        {images.map((src, i) => (
                          <button
                            key={`${src}-${i}`}
                            type="button"
                            className={`product-modal__thumb${i === thumbIndex ? " product-modal__thumb--active" : ""}`}
                            onClick={() => setThumbIndex(i)}
                            aria-label={`View image ${i + 1}`}
                            aria-selected={i === thumbIndex}
                          >
                            <img src={src} alt="" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="product-modal__info">
                    <div className="product-modal__meta-row">
                      {selectedProduct.badge ? (
                        <span className="product-modal__badge">
                          {selectedProduct.badge}
                        </span>
                      ) : null}
                      <div
                        className="product-modal__stars"
                        aria-label={`${selectedProduct.rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={
                              i < fullStars
                                ? "product-modal__star"
                                : "product-modal__star product-modal__star--muted"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <h1 className="product-modal__title">
                      {selectedProduct.name}
                    </h1>
                    <p className="product-modal__price">
                      {formatRs(lineUnitPrice)}
                    </p>
                    <p className="product-modal__desc">
                      {selectedProduct.description}
                    </p>
                    <div>
                      <p className="product-modal__section-label">
                        Bundle &amp; save
                      </p>
                      <div className="product-modal__bundles">
                        <button
                          type="button"
                          className={`product-modal__bundle${bundle === "single" ? " product-modal__bundle--active" : ""}`}
                          onClick={() => setBundle("single")}
                        >
                          <div className="product-modal__bundle-title">
                            Single stem
                          </div>
                          <div className="product-modal__bundle-sub">
                            Pay per piece
                          </div>
                          <div className="product-modal__bundle-price">
                            {formatRs(unit + packFee)}
                          </div>
                        </button>
                        <button
                          type="button"
                          className={`product-modal__bundle${bundle === "bundle5" ? " product-modal__bundle--active" : ""}`}
                          onClick={() => setBundle("bundle5")}
                        >
                          {save5 > 0 ? (
                            <span className="product-modal__bundle-save">
                              Save {formatRs(save5)}
                            </span>
                          ) : null}
                          <div className="product-modal__bundle-title">
                            {bundleTitle5}
                          </div>
                          <div className="product-modal__bundle-sub">
                            Best for a full bouquet
                          </div>
                          <div className="product-modal__bundle-price">
                            {formatRs(bundle5Total + packFee)}
                          </div>
                        </button>
                        <button
                          type="button"
                          className={`product-modal__bundle${bundle === "bundle10" ? " product-modal__bundle--active" : ""}`}
                          onClick={() => setBundle("bundle10")}
                        >
                          {save10 > 0 ? (
                            <span className="product-modal__bundle-save">
                              Save {formatRs(save10)}
                            </span>
                          ) : null}
                          <div className="product-modal__bundle-title">
                            {bundleTitle10}
                          </div>
                          <div className="product-modal__bundle-sub">
                            The ultimate garden gift
                          </div>
                          <div className="product-modal__bundle-price">
                            {formatRs(bundle10Total + packFee)}
                          </div>
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="product-modal__section-label">
                        Packaging selection
                      </p>
                      <div className="product-modal__packaging">
                        <button
                          type="button"
                          className={`product-modal__pack${packaging === "none" ? " product-modal__pack--active" : ""}`}
                          onClick={() => setPackaging("none")}
                        >
                          <div className="product-modal__pack-label">
                            No bag
                          </div>
                          <div className="product-modal__pack-price">
                            {formatRs(Number(selectedProduct.noBagPrice ?? 0))}
                          </div>
                        </button>
                        <button
                          type="button"
                          className={`product-modal__pack${packaging === "plastic" ? " product-modal__pack--active" : ""}`}
                          onClick={() => setPackaging("plastic")}
                        >
                          <div className="product-modal__pack-label">
                            Plastic bag
                          </div>
                          <div className="product-modal__pack-price">
                            +
                            {formatRs(
                              Number(selectedProduct.plasticBagPrice ?? 0),
                            )}
                          </div>
                        </button>
                        <button
                          type="button"
                          className={`product-modal__pack${packaging === "paper" ? " product-modal__pack--active" : ""}`}
                          onClick={() => setPackaging("paper")}
                        >
                          <div className="product-modal__pack-label">
                            Paper bag
                          </div>
                          <div className="product-modal__pack-price">
                            +
                            {formatRs(
                              Number(selectedProduct.paperBagPrice ?? 0),
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="product-modal__qty-row">
                      <div className="product-modal__qty">
                        <button
                          type="button"
                          className="product-modal__qty-btn"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="product-modal__qty-val">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="product-modal__qty-btn"
                          onClick={() => setQuantity((q) => q + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="product-modal__add-btn"
                        onClick={handleAddToCart}
                      >
                        <ShoppingBag size={20} aria-hidden />
                        {addedFlash ? "Added to cart" : "Add to cart"}
                      </button>
                    </div>
                    <div className="product-modal__trust">
                      <div className="product-modal__trust-item">
                        <span className="material-symbols-outlined" aria-hidden>
                          eco
                        </span>
                        <div className="product-modal__trust-text">
                          <strong>Sustainable craft</strong>
                          <span>Eco-friendly materials used.</span>
                        </div>
                      </div>
                      <div className="product-modal__trust-item">
                        <span className="material-symbols-outlined" aria-hidden>
                          local_shipping
                        </span>
                        <div className="product-modal__trust-text">
                          <strong>Delicate shipping</strong>
                          <span>Handled with floral wire care.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ProductGrid;
