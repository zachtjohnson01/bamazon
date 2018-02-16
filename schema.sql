DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (

	item_id INT AUTO_INCREMENT,
    
    product_name VARCHAR(255) NOT NULL,
    
    department_name VARCHAR(255) NOT NULL,
    
    price DECIMAL(13,4) NOT NULL,
    
    stock_quantity INT NOT NULL,
    
    primary key (item_id)
    
);

SELECT * FROM products;