-- Cosmos Edge auth schema (MySQL / Hostinger)
-- Run via `npm run migrate` (server/src/db/migrate.ts) or paste into phpMyAdmin.

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- If migrating an existing database that predates password_hash, run:
-- ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NOT NULL AFTER email;

-- Sessions are stateless JWTs; this table exists only so a session can be
-- revoked server-side (logout-everywhere, security incident) before expiry.
CREATE TABLE IF NOT EXISTS sessions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  token_id CHAR(36) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sessions_token (token_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS addresses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  label VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  line1 VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_addresses_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- === Admin role ===
-- If migrating an existing database that predates the role column, run:
-- ALTER TABLE users ADD COLUMN role ENUM('customer','admin') NOT NULL DEFAULT 'customer' AFTER password_hash;
-- Then promote yourself manually, e.g.:
-- UPDATE users SET role = 'admin' WHERE email = 'you@example.com';

-- === Catalog (categories / authors / books) ===
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(64) NOT NULL UNIQUE,
  image_path VARCHAR(255) NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS authors (
  id VARCHAR(128) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255) NULL,
  bio TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS books (
  id VARCHAR(16) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_id VARCHAR(128) NULL,
  category_id VARCHAR(64) NULL,
  cover_path VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) NULL,
  format ENUM('Hardcover','Paperback','eBook','Audiobook') NOT NULL DEFAULT 'Paperback',
  language VARCHAR(50) NOT NULL,
  publisher VARCHAR(255) NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  stock_count INT UNSIGNED NULL,
  is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  is_trending BOOLEAN NOT NULL DEFAULT FALSE,
  badge VARCHAR(50) NULL,
  description TEXT NOT NULL,
  pages INT UNSIGNED NOT NULL,
  published_year INT UNSIGNED NOT NULL,
  isbn VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_books_category (category_id),
  INDEX idx_books_author (author_id),
  INDEX idx_books_bestseller (is_bestseller),
  INDEX idx_books_trending (is_trending),
  INDEX idx_books_new (is_new),
  INDEX idx_books_in_stock (in_stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- === Orders ===
-- Delivery address is a denormalized snapshot (not a FK to addresses) so
-- editing/deleting a saved address later never rewrites what a past order
-- says was delivered where.
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(20) PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  status ENUM('Processing','Shipped','Out for Delivery','Delivered','Cancelled') NOT NULL DEFAULT 'Processing',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  razorpay_order_id VARCHAR(64) NOT NULL,
  razorpay_payment_id VARCHAR(64) NOT NULL,
  address_label VARCHAR(50) NOT NULL,
  address_name VARCHAR(255) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_city VARCHAR(100) NOT NULL,
  address_state VARCHAR(100) NOT NULL,
  address_zip VARCHAR(20) NOT NULL,
  address_phone VARCHAR(20) NOT NULL,
  eta VARCHAR(100) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_status (status),
  UNIQUE INDEX idx_orders_razorpay_payment (razorpay_payment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- book_id intentionally has no FK to books: order history must survive a
-- book being deleted from the catalog later. title/cover/price are
-- snapshotted here for the same reason.
CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(20) NOT NULL,
  book_id VARCHAR(16) NOT NULL,
  title VARCHAR(255) NOT NULL,
  cover_path VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_items_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
