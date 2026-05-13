import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../store/useStore";
import { Loader2, ShoppingBag } from "lucide-react";
import type { Product } from "../../models/types";
import { formatRs } from "../../utils/formatRs";

const getTierPrice = (product: Product, tier: "tier1" | "tier2" | "tier3") => {
  const tierData = product.packages?.[tier];
  const tierPrice = tierData?.[`${tier}Price`];
  return Number(tierPrice ?? product.price);
};

const getTierImage = (product: Product, tier: "tier1" | "tier2" | "tier3") => {
  const tierData = product.packages?.[tier];
  const tierImage = tierData?.[`${tier}ImageUrl`];
  return typeof tierImage === "string" ? tierImage : product.image;
};

const ProductGrid: React.FC = () => {
  const { products, fetchProducts, isLoading, error, addToCart } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  return (
    <section className="product-grid" id="occasions">
      <div className="product-grid__header">
        <div className="product-grid__intro">
          <span className="product-grid__eyebrow">Bestsellers</span>
          <h2 className="product-grid__title">
            Most <em className="product-grid__title-accent">loved</em> bouquets
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
                <Link
                  to={`/item/${product.id}`}
                  className="product-card__media-link"
                  aria-label={`View ${product.name}`}
                >
                  <img src={tier1Image} alt={product.name} />
                </Link>
                {product.badge && (
                  <span className="product-card__badge">{product.badge}</span>
                )}
                <div className="product-card__overlay">
                  <button
                    type="button"
                    className="product-card__add ambient-shadow press-effect"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const btn = e.currentTarget;
                      const originalHTML = btn.innerHTML;
                      btn.innerHTML = "<span>Added ✓</span>";
                      btn.classList.add("product-card__add--accent");
                      addToCart({
                        ...product,
                        price: tier1Price,
                        image: tier1Image,
                      });
                      setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.classList.remove("product-card__add--accent");
                      }, 1500);
                    }}
                  >
                    <ShoppingBag size={18} /> Add to Cart
                  </button>
                </div>
              </div>

              <Link
                to={`/item/${product.id}`}
                className="product-card__meta-link"
              >
                <h4 className="product-card__title" title={product.name}>
                  {product.name}
                </h4>
                <div className="product-card__price-row">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span className="product-card__price">
                      {formatRs(tier1Price)}
                    </span>
                    {product.oldPrice && (
                      <span className="product-card__old-price">
                        {formatRs(Number(product.oldPrice))}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductGrid;
