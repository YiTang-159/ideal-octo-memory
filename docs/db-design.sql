-- ============================================================
-- DATABASE: c09_ecommerce
-- Description: E-commerce system with inventory management
-- Generated: 2026-03-29
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS c09_ecommerce;
CREATE DATABASE c09_ecommerce
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE c09_ecommerce;

-- ------------------------------------------------------------
-- 1. users — Tài khoản người dùng
-- ------------------------------------------------------------
CREATE TABLE users (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    username    VARCHAR(50)     NOT NULL,
    password    VARCHAR(255)    NOT NULL,
    full_name   VARCHAR(100)    NOT NULL,
    email       VARCHAR(100)    NOT NULL,
    phone       VARCHAR(20)     NOT NULL,
    address     VARCHAR(255)    NOT NULL,
    ward        VARCHAR(100)    NOT NULL,
    role        ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    is_active   TINYINT(1)      NOT NULL DEFAULT 1,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX ix_users_role ON users (role);

-- ------------------------------------------------------------
-- 2. categories — Danh mục sản phẩm
-- ------------------------------------------------------------
CREATE TABLE categories (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100)    NOT NULL,
    is_deleted  TINYINT(1)      NOT NULL DEFAULT 0,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_categories PRIMARY KEY (id),
    CONSTRAINT uq_categories_name UNIQUE (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. products — Sản phẩm
-- ------------------------------------------------------------
CREATE TABLE products (
    id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id         BIGINT UNSIGNED NOT NULL,
    sku                 VARCHAR(50)     NOT NULL,
    name                VARCHAR(200)    NOT NULL,
    description         TEXT            NULL,
    image               VARCHAR(500)    NULL,
    supplier            VARCHAR(200)    NULL,
    base_price          DECIMAL(15, 2)  NOT NULL DEFAULT 0.00,
    profit_margin       DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
    sell_price          DECIMAL(15, 2)  NOT NULL DEFAULT 0.00,
    stock_quantity      INT             NOT NULL DEFAULT 0,
    low_stock_threshold INT             NOT NULL DEFAULT 10,
    is_deleted          TINYINT(1)      NOT NULL DEFAULT 0,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_products PRIMARY KEY (id),
    CONSTRAINT uq_products_sku UNIQUE (sku),
    CONSTRAINT fk_products_categories
        FOREIGN KEY (category_id) REFERENCES categories (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX ix_products_category_id ON products (category_id);
CREATE INDEX ix_products_is_deleted ON products (is_deleted);
CREATE INDEX ix_products_sell_price ON products (sell_price);

-- ------------------------------------------------------------
-- 4. carts — Giỏ hàng (1 user : 1 active cart)
-- ------------------------------------------------------------
CREATE TABLE carts (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id     BIGINT UNSIGNED NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_carts PRIMARY KEY (id),
    CONSTRAINT uq_carts_user_id UNIQUE (user_id),
    CONSTRAINT fk_carts_users
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. cart_items — Chi tiết giỏ hàng
-- ------------------------------------------------------------
CREATE TABLE cart_items (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    cart_id     BIGINT UNSIGNED NOT NULL,
    product_id  BIGINT UNSIGNED NOT NULL,
    quantity    INT UNSIGNED    NOT NULL DEFAULT 1,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_cart_items PRIMARY KEY (id),
    CONSTRAINT uq_cart_items_cart_product UNIQUE (cart_id, product_id),
    CONSTRAINT fk_cart_items_carts
        FOREIGN KEY (cart_id) REFERENCES carts (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_products
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. orders — Đơn đặt hàng
-- ------------------------------------------------------------
CREATE TABLE orders (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id           BIGINT UNSIGNED NOT NULL,
    receiver_name     VARCHAR(100)    NOT NULL,
    receiver_phone    VARCHAR(20)     NOT NULL,
    shipping_address  VARCHAR(255)    NOT NULL,
    shipping_ward     VARCHAR(100)    NOT NULL,
    payment_method    ENUM('cod', 'bank_transfer', 'online') NOT NULL,
    status            ENUM('pending', 'confirmed', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    total_amount      DECIMAL(15, 2)  NOT NULL,
    note              TEXT            NULL,
    created_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_orders PRIMARY KEY (id),
    CONSTRAINT fk_orders_users
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX ix_orders_user_id ON orders (user_id);
CREATE INDEX ix_orders_status ON orders (status);
CREATE INDEX ix_orders_created_at ON orders (created_at);
CREATE INDEX ix_orders_shipping_ward ON orders (shipping_ward);

-- ------------------------------------------------------------
-- 7. order_details — Chi tiết đơn hàng (snapshot giá)
-- ------------------------------------------------------------
CREATE TABLE order_details (
    id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id      BIGINT UNSIGNED NOT NULL,
    product_id    BIGINT UNSIGNED NOT NULL,
    product_name  VARCHAR(200)    NOT NULL,
    unit_price    DECIMAL(15, 2)  NOT NULL,
    quantity      INT UNSIGNED    NOT NULL,
    subtotal      DECIMAL(15, 2)  NOT NULL,
    created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_order_details PRIMARY KEY (id),
    CONSTRAINT fk_order_details_orders
        FOREIGN KEY (order_id) REFERENCES orders (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_order_details_products
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX ix_order_details_order_id ON order_details (order_id);
CREATE INDEX ix_order_details_product_id ON order_details (product_id);

-- ------------------------------------------------------------
-- 8. goods_receipts — Phiếu nhập hàng
-- ------------------------------------------------------------
CREATE TABLE goods_receipts (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    created_by  BIGINT UNSIGNED NOT NULL,
    status      ENUM('draft', 'completed') NOT NULL DEFAULT 'draft',
    note        TEXT            NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_goods_receipts PRIMARY KEY (id),
    CONSTRAINT fk_goods_receipts_users
        FOREIGN KEY (created_by) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX ix_goods_receipts_created_by ON goods_receipts (created_by);
CREATE INDEX ix_goods_receipts_status ON goods_receipts (status);
CREATE INDEX ix_goods_receipts_created_at ON goods_receipts (created_at);

-- ------------------------------------------------------------
-- 9. goods_receipt_details — Chi tiết phiếu nhập (snapshot giá nhập lô)
-- ------------------------------------------------------------
CREATE TABLE goods_receipt_details (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    goods_receipt_id  BIGINT UNSIGNED NOT NULL,
    product_id        BIGINT UNSIGNED NOT NULL,
    quantity          INT UNSIGNED    NOT NULL,
    import_price      DECIMAL(15, 2)  NOT NULL,
    created_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_goods_receipt_details PRIMARY KEY (id),
    CONSTRAINT fk_goods_receipt_details_receipts
        FOREIGN KEY (goods_receipt_id) REFERENCES goods_receipts (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_goods_receipt_details_products
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX ix_goods_receipt_details_receipt_id ON goods_receipt_details (goods_receipt_id);
CREATE INDEX ix_goods_receipt_details_product_id ON goods_receipt_details (product_id);

-- ------------------------------------------------------------
-- 10. inventory_logs — Sổ cái tồn kho (Inventory Ledger)
-- ------------------------------------------------------------
CREATE TABLE inventory_logs (
    id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    product_id      BIGINT UNSIGNED NOT NULL,
    change_amount   INT             NOT NULL,
    reference_type  ENUM('product_init', 'goods_receipt', 'order_placed', 'order_cancelled') NOT NULL,
    reference_id    BIGINT UNSIGNED NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_inventory_logs PRIMARY KEY (id),
    CONSTRAINT fk_inventory_logs_products
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX ix_inventory_logs_product_id ON inventory_logs (product_id);
CREATE INDEX ix_inventory_logs_reference ON inventory_logs (reference_type, reference_id);
CREATE INDEX ix_inventory_logs_created_at ON inventory_logs (created_at);

-- ============================================================
-- Re-enable foreign key checks
-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;
