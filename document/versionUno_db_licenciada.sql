-- ============================================================
-- SCRIPT SQL - Sistema de Tienda por Licencia (Truji Studios)
-- ============================================================

-- 0. Eliminar la base de datos si existe
DROP DATABASE IF EXISTS licenciadaTrujiStudios;

-- 1. Crear la base de datos
CREATE DATABASE licenciadaTrujiStudios;

-- 2. Usar la base de datos
USE licenciadaTrujiStudios;

-- ============================================================
-- 1. Tabla Store (Tienda)
-- ============================================================
CREATE TABLE Store (
    store_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    logo_url VARCHAR(500) NOT NULL,
    description VARCHAR(250),
    state ENUM('activa', 'inactiva') NOT NULL,
    creation_date DATETIME NOT NULL
);

-- ============================================================
-- 2. Tabla License (Licencia) - Relación 1:1 con Store
-- ============================================================
CREATE TABLE License (
    license_id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    state ENUM('activa', 'vencida', 'suspendida') NOT NULL,
    plan ENUM('mensual', 'anual') NOT NULL,
    FOREIGN KEY (store_id) REFERENCES Store(store_id) ON DELETE CASCADE,
    CHECK (end_date > start_date)
);

-- ============================================================
-- 3. Tabla MainCategory (Categoría Principal)
-- ============================================================
CREATE TABLE MainCategory (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    icon_url VARCHAR(500) NOT NULL,
    orden INT NOT NULL,
    FOREIGN KEY (store_id) REFERENCES Store(store_id) ON DELETE CASCADE
);

CREATE INDEX idx_maincategory_store ON MainCategory(store_id);

-- ============================================================
-- 4. Tabla Subcategory (Subcategoría)
-- ============================================================
CREATE TABLE Subcategory (
    subcategory_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(250) NOT NULL,
    orden INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES MainCategory(category_id) ON DELETE CASCADE
);

CREATE INDEX idx_subcategory_category ON Subcategory(category_id);

-- ============================================================
-- 5. Tabla Product (Producto)
-- ============================================================
CREATE TABLE Product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    subcategory_id INT NOT NULL,
    name VARCHAR(250) NOT NULL,
    description VARCHAR(250),
    price_cop DECIMAL(10, 2) NOT NULL CHECK (price_cop >= 0),
    price_usd DECIMAL(10, 2) NULL CHECK (price_usd >= 0),
    image_url VARCHAR(500) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    state ENUM('activo', 'inactivo') NOT NULL,
    FOREIGN KEY (subcategory_id) REFERENCES Subcategory(subcategory_id) ON DELETE CASCADE
);

CREATE INDEX idx_product_subcategory ON Product(subcategory_id);

-- ============================================================
-- 6. Tabla User (Usuario Cliente)
-- ============================================================
CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    name VARCHAR(250) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    telephone VARCHAR(20),
    address VARCHAR(200),
    registration_date DATETIME NOT NULL,
    state ENUM('activo', 'inactivo') NOT NULL,
    FOREIGN KEY (store_id) REFERENCES Store(store_id) ON DELETE CASCADE
);

CREATE INDEX idx_user_store ON User(store_id);

-- ============================================================
-- 7. Tabla Order (Pedido)
-- ============================================================
CREATE TABLE `Order` (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    store_id INT NOT NULL,
    order_date DATETIME NOT NULL,
    state ENUM('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado') NOT NULL,
    payment_method ENUM('contraEntrega', 'pasarelaLocal') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE SET NULL,
    FOREIGN KEY (store_id) REFERENCES Store(store_id) ON DELETE CASCADE
);

CREATE INDEX idx_order_store ON `Order`(store_id);

-- ============================================================
-- 8. Tabla OrderItem (Ítem de Pedido)
-- ============================================================
CREATE TABLE OrderItem (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    FOREIGN KEY (order_id) REFERENCES `Order`(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
);

CREATE INDEX idx_orderitem_order ON OrderItem(order_id);
CREATE INDEX idx_orderitem_product ON OrderItem(product_id);

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
