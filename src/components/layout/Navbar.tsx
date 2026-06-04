import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "../../store/useStore";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { getCartCount, user, logout } = useStore();

  const shopActive =
    location.pathname === "/" || /^\/item\/\d+/.test(location.pathname);

  // const detailProductId = useMemo(() => {
  //   const m = location.pathname.match(/^\/item\/(\d+)/);
  //   return m ? Number(m[1]) : null;
  // }, [location.pathname]);

  // const onWishlistClick = () => {
  //   if (detailProductId != null) toggleWishlist(detailProductId);
  // };

  // const wishlisted =
  //   detailProductId != null && wishlist.includes(detailProductId);

  return (
    <nav className="site-nav">
      <div className="site-nav__inner">
        <Link to="/" className="site-nav__brand">
          Edens Bloom
        </Link>
        <div className="site-nav__links">
          <a
            href="#occasions"
            className={`site-nav__link${shopActive ? " site-nav__link--active" : ""}`}
          >
            Shop
          </a>

          <a href="#custom-design" className="site-nav__link">
            Custom
          </a>
          {user?.role === "admin" && (
            <Link
              to="/product"
              className="site-nav__link site-nav__link--danger"
            >
              Manage
            </Link>
          )}
        </div>

        {/* <div className="site-nav__search-wrap">
          <span
            className="material-symbols-outlined site-nav__search-icon"
            aria-hidden
          >
            search
          </span>
          <input
            type="search"
            className="site-nav__search-input"
            placeholder="Search flowers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search flowers"
          />
        </div> */}

        <div className="site-nav__actions">
          {/* <button
            type="button"
            className={`site-nav__icon-btn site-nav__icon-btn--search material-symbols-outlined press-effect sm-only-search`}
            aria-label="Search"
          >
            search
          </button> */}
          <Link
            to="/cart"
            className="site-nav__cart press-effect"
            aria-label="Cart"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {getCartCount() > 0 && (
              <span className="site-nav__cart-badge">{getCartCount()}</span>
            )}
          </Link>
          {/* <button
            type="button"
            className={`site-nav__wishlist material-symbols-outlined press-effect${wishlisted ? " site-nav__wishlist--active" : ""}`}
            onClick={onWishlistClick}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            title={
              detailProductId == null
                ? "Open a product to use wishlist"
                : undefined
            }
            disabled={detailProductId == null}
          >
            {wishlisted ? "favorite" : "favorite_border"}
          </button> */}
          {user && (
            <div className="site-nav__user">
              <span className="site-nav__username">{}</span>
              <button
                type="button"
                onClick={logout}
                className="site-nav__logout"
              >
                Logout
              </button>
            </div>
          )}
          {/* // (
          //   <Link
          //     to="/login"
          //     className="site-nav__icon-btn material-symbols-outlined press-effect"
          //     title="Admin Login"
          //   >
          //     person
          //   </Link>
          // ) */}
          {/* <button
            type="button"
            className="site-nav__icon-btn site-nav__icon-btn--menu material-symbols-outlined"
            aria-label="Open menu"
          >
            menu
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
