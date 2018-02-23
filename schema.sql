DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE product (

	item_id INT AUTO_INCREMENT,
    
    product_name VARCHAR(255) NOT NULL,
    
    price DECIMAL(13,4) NOT NULL,
    
    stock_quantity INT NOT NULL,
    
    department_id INT,
    
    primary key (item_id),
    
    foreign key (department_id) REFERENCES department(department_id)

);

INSERT INTO department(department_name, over_head_costs)
VALUES('electronics',300000);

INSERT INTO department(department_name, over_head_costs)
VALUES('home goods',410000);

INSERT INTO department(department_name, over_head_costs)
VALUES('personal products',240000);

INSERT INTO department(department_name, over_head_costs)
VALUES('clothing',100000);

CREATE TABLE department (

    department_id INT AUTO_INCREMENT,

    department_name VARCHAR(255) NOT NULL,

    over_head_costs DECIMAL(13,4) NOT NULL,
    
    primary key (department_id)
);

INSERT INTO product (product_name, department_id, price, stock_quantity)
VALUES ("phone", 1, 99.99, 50);

INSERT INTO product (product_name, department_id, price, stock_quantity)
VALUES ("water bottle", 2, 14.99, 80);

INSERT INTO product (product_name, department_id, price, stock_quantity)
VALUES ("glasses case", 3, 10.00, 77);

INSERT INTO product (product_name, department_id, price, stock_quantity)
VALUES ("lamp", 1, 20.15, 35);

INSERT INTO product (product_name, department_id, price, stock_quantity)
VALUES ("laptop", 1, 899.99, 20);

INSERT INTO product (product_name, department_id, price, stock_quantity)
VALUES ("desk", 2, 455.55, 50);

INSERT INTO product (product_name, department_id, price, stock_quantity)
VALUES ("socks", 4, 8.99, 85);

INSERT INTO product (product_name, department_id, price, stock_quantity)
VALUES ("shoes", 4, 87.55, 110);

INSERT INTO product (product_name, department_id, price, stock_quantity)
VALUES ("backpack", 3, 65.00, 25);


SELECT * FROM department;

SELECT * FROM product;