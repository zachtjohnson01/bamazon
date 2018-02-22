DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE product (

	item_id INT AUTO_INCREMENT,
    
    product_name VARCHAR(255) NOT NULL,
    
    department_name VARCHAR(255) NOT NULL,
    
    price DECIMAL(13,4) NOT NULL,
    
    stock_quantity INT NOT NULL,
    
    primary key (item_id)
    
);

SELECT * FROM products;


CREATE TABLE department (

    department_id INT AUTO_INCREMENT,

    department_name VARCHAR(255) NOT NULL,

    over_head_costs DECIMAL(13,4) NOT NULL,

    primary key (department_id)
);


ALTER TABLE product

ADD product_sales DECIMAL(13,4) NOT NULL;