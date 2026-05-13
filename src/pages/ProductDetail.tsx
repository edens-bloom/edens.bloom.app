import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ShoppingBag, ChevronLeft } from "lucide-react";
import { useStore } from "../store/useStore";
import { formatRs } from "../utils/formatRs";
import type { Product } from "../models/types";
import "./ProductDetail.scss";

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

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, fetchProducts, addToCart, isLoading } = useStore();
  const [thumbIndex, setThumbIndex] = useState(0);
  const [bundle, setBundle] = useState<BundleKey>("single");
  const [packaging, setPackaging] = useState<PackKey>("none");
  const [quantity, setQuantity] = useState(1);
  const [addedFlash, setAddedFlash] = useState(false);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [products.length, fetchProducts]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const numId = useMemo(() => parseInt(String(id ?? ""), 10), [id]);

  const product = useMemo(() => {
    if (!Number.isFinite(numId) || numId < 1) return undefined;
    return products.find((p) => p.id === numId);
  }, [numId, products]);

  const images = useMemo(
    () => (product ? galleryImages(product) : []),
    [product],
  );
  const mainImage = images[thumbIndex] ?? "";

  useEffect(() => {
    setThumbIndex(0);
    setBundle("single");
    setPackaging("none");
    setQuantity(1);
  }, [id]);

  useEffect(() => {
    if (thumbIndex >= images.length) setThumbIndex(0);
  }, [images.length, thumbIndex]);

  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} | Edens Bloom`;
  }, [product]);

  if (
    !isLoading &&
    products.length > 0 &&
    (!Number.isFinite(numId) || numId < 1 || !product)
  ) {
    return <Navigate to="/" replace />;
  }

  if (!isLoading && products.length === 0) {
    return (
      <div className="product-detail">
        <div className="product-detail__missing page-container">
          <p>No products available.</p>
          <Link
            to="/"
            className="product-detail__back"
            style={{ marginTop: "1rem" }}
          >
            <ChevronLeft size={18} aria-hidden />
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="product-detail__loading page-container">Loading…</div>
      </div>
    );
  }

  const unit = getTierPrice(product, "tier1");
  const tier2 = product.packages?.tier2;
  const tier3 = product.packages?.tier3;
  const bundle5Total =
    tier2?.price != null ? Number(tier2.price) : unit * 5;
  const bundle10Total =
    tier3?.price != null ? Number(tier3.price) : unit * 10;
  const save5 = Math.max(0, unit * 6 - bundle5Total);
  const save10 = Math.max(0, unit * 13 - bundle10Total);

  const packFee =
    packaging === "plastic"
      ? Number(product.plasticBagPrice ?? 0)
      : packaging === "paper"
        ? Number(product.paperBagPrice ?? 0)
        : Number(product.noBagPrice ?? 0);

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
    const img = mainImage || product.image;
    addToCart(
      {
        ...product,
        price: lineUnitPrice,
        image: img,
      },
      quantity,
    );
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1600);
  };

  const fullStars = Math.round(Math.min(5, Math.max(0, product.rating)));

  return (
    <div className="product-detail">
      <div className="product-detail__grid">
        <div className="product-detail__gallery">
          <Link to="/" className="product-detail__back">
            <ChevronLeft size={18} aria-hidden />
            Back to shop
          </Link>
          <div className="product-detail__main-img-wrap ambient-shadow">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="product-detail__main-img"
              />
            ) : null}
          </div>
          {images.length > 1 && (
            <div
              className="product-detail__thumbs"
              role="tablist"
              aria-label="Product images"
            >
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  className={`product-detail__thumb${i === thumbIndex ? " product-detail__thumb--active" : ""}`}
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

        <div className="product-detail__info">
          <div className="product-detail__meta-row">
            {product.badge ? (
              <span className="product-detail__badge">{product.badge}</span>
            ) : null}
            <div
              className="product-detail__stars"
              aria-label={`${product.rating} out of 5 stars`}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={
                    i < fullStars
                      ? "product-detail__star"
                      : "product-detail__star product-detail__star--muted"
                  }
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <h1 className="product-detail__title">{product.name}</h1>
          <p className="product-detail__price">{formatRs(lineUnitPrice)}</p>
          <p className="product-detail__desc">{product.description}</p>

          <div>
            <p className="product-detail__section-label">Bundle &amp; save</p>
            <div className="product-detail__bundles">
              <button
                type="button"
                className={`product-detail__bundle${bundle === "single" ? " product-detail__bundle--active" : ""}`}
                onClick={() => setBundle("single")}
              >
                <div className="product-detail__bundle-title">Single stem</div>
                <div className="product-detail__bundle-sub">Pay per piece</div>
                <div className="product-detail__bundle-price">
                  {formatRs(unit + packFee)}
                </div>
              </button>
              <button
                type="button"
                className={`product-detail__bundle${bundle === "bundle5" ? " product-detail__bundle--active" : ""}`}
                onClick={() => setBundle("bundle5")}
              >
                {save5 > 0 ? (
                  <span className="product-detail__bundle-save">
                    Save {formatRs(save5)}
                  </span>
                ) : null}
                <div className="product-detail__bundle-title">
                  {bundleTitle5}
                </div>
                <div className="product-detail__bundle-sub">
                  Best for a full bouquet
                </div>
                <div className="product-detail__bundle-price">
                  {formatRs(bundle5Total + packFee)}
                </div>
              </button>
              <button
                type="button"
                className={`product-detail__bundle${bundle === "bundle10" ? " product-detail__bundle--active" : ""}`}
                onClick={() => setBundle("bundle10")}
              >
                {save10 > 0 ? (
                  <span className="product-detail__bundle-save">
                    Save {formatRs(save10)}
                  </span>
                ) : null}
                <div className="product-detail__bundle-title">
                  {bundleTitle10}
                </div>
                <div className="product-detail__bundle-sub">
                  The ultimate garden gift
                </div>
                <div className="product-detail__bundle-price">
                  {formatRs(bundle10Total + packFee)}
                </div>
              </button>
            </div>
          </div>

          <div>
            <p className="product-detail__section-label">Packaging selection</p>
            <div className="product-detail__packaging">
              <button
                type="button"
                className={`product-detail__pack${packaging === "none" ? " product-detail__pack--active" : ""}`}
                onClick={() => setPackaging("none")}
              >
                <div className="product-detail__pack-label">No bag</div>
                <div className="product-detail__pack-price">
                  {formatRs(Number(product.noBagPrice ?? 0))}
                </div>
              </button>
              <button
                type="button"
                className={`product-detail__pack${packaging === "plastic" ? " product-detail__pack--active" : ""}`}
                onClick={() => setPackaging("plastic")}
              >
                <div className="product-detail__pack-label">Plastic bag</div>
                <div className="product-detail__pack-price">
                  +{formatRs(Number(product.plasticBagPrice ?? 0))}
                </div>
              </button>
              <button
                type="button"
                className={`product-detail__pack${packaging === "paper" ? " product-detail__pack--active" : ""}`}
                onClick={() => setPackaging("paper")}
              >
                <div className="product-detail__pack-label">Paper bag</div>
                <div className="product-detail__pack-price">
                  +{formatRs(Number(product.paperBagPrice ?? 0))}
                </div>
              </button>
            </div>
          </div>

          <div className="product-detail__qty-row">
            <div className="product-detail__qty">
              <button
                type="button"
                className="product-detail__qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="product-detail__qty-val">{quantity}</span>
              <button
                type="button"
                className="product-detail__qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="product-detail__add-btn"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={20} aria-hidden />
              {addedFlash ? "Added to cart" : "Add to cart"}
            </button>
          </div>

          <div className="product-detail__trust">
            <div className="product-detail__trust-item">
              <span className="material-symbols-outlined" aria-hidden>
                eco
              </span>
              <div className="product-detail__trust-text">
                <strong>Sustainable craft</strong>
                <span>Eco-friendly materials used.</span>
              </div>
            </div>
            <div className="product-detail__trust-item">
              <span className="material-symbols-outlined" aria-hidden>
                local_shipping
              </span>
              <div className="product-detail__trust-text">
                <strong>Delicate shipping</strong>
                <span>Handled with floral wire care.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
