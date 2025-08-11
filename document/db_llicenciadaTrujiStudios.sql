CREATE DATABASE licenciadaTrujiStudios;
use licenciadaTrujiStudios;

CREATE TABLE Store (
    store_id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    logo_url VARCHAR(500) NOT NULL,
    description VARCHAR(250) NOT NULL,
    state ENUM('activa','inactiva') NOT NULL,
    creation_date VARCHAR(250) NOT NULL
);

CREATE TABLE License (
    licence_id INT PRIMARY KEY,
    store_id INT UNIQUE,
    start_date VARCHAR(250) NOT NULL,
	end_date VARCHAR(250) NOT NULL,
    state ENUM('activa','vencida','suspendida') NOT NULL,
    FOREIGN KEY (store_id) REFERENCES Store(store_id)
);

CREATE TABLE MainCategory (
    category_id INT PRIMARY KEY,
    store_id INT,
    name VARCHAR(255) NOT NULL,
    icon_url VARCHAR(500) NOT NULL,
    orden VARCHAR(250) NOT NULL,
    FOREIGN KEY (store_id) REFERENCES Store(store_id) ON DELETE CASCADE      -- FOREIGN KEY (store_id) REFERENCES Store(store_id) ON DELETE CASCADE
);

CREATE TABLE SubCategory (
    subCategory_id INT PRIMARY KEY,
    category_id INT,
    name VARCHAR(250) NOT NULL,
    orden VARCHAR(250) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES MainCategory(category_id)   
);

CREATE TABLE Product (
    product_id INT PRIMARY KEY,
    SubCategory_id INT,
    name VARCHAR(250) NOT NULL,
    description VARCHAR(250) NOT NULL,
    price_cop DECIMAL NOT NULL,
    price_usd DECIMAL NOT NULL,
    imagen VARCHAR(500) NOT NULL,
    stock INT NOT NULL,
    state ENUM('activo','inactivo'),
    FOREIGN KEY (SubCategory_id) REFERENCES SubCategory(SubCategory_id)  
);

CREATE TABLE User (
    user_id INT PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    email VARCHAR(200) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    address VARCHAR(200) NOT NULL,
    registration_date DATETIME NOT NULL,
    state ENUM('activo','inactivo')
);

CREATE TABLE Pedido (
order_id INT PRIMARY KEY,
user_id INT,
store_id INT,
fecha DATETIME,
state ENUM('pendiante','confirmado','enviado','entregado','cancelado'),
payment_method ENUM('contraEntrega','pasarelaPago'),
FOREIGN KEY (user_id) REFERENCES User(user_id),
FOREIGN KEY (store_id) REFERENCES Store(store_id)
);

CREATE TABLE Item_Pedido (
item_id INT PRIMARY KEY,
order_id INT,
product_id INT,
amount VARCHAR(200) NOT NULL,
unit_price VARCHAR(200) NOT NULL,
FOREIGN KEY (order_id) REFERENCES Pedido(order_id),
FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

