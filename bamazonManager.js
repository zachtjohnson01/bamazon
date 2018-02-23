// require inquirer for user interaction
const inquirer = require('inquirer');

// require cli-table to display table
const Table = require('cli-table');

// require mysql to connect to database
const mysql = require('mysql');

//require font.js for display
const prettyFont = require('./font.js');

// create MySQL database called bamazon
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
});

// establish connection with MySQL database
connection.connect(function(err) {
    if (err) throw err;
    prettyFont('Bamazon','huge','red');
    prettyFont('Manager Portal','chrome','red');
    start();
});

function start() {
    inquirer.prompt([
            {
                name: 'manager',
                message: 'Please select one of the following:',
                type: 'list',
                choices: ['View Products for Sale','View Low Inventory','Add Inventory','Add New Product']
            }
    ]).then(function(answers){
        // retrieve table data from mySQL database
        switch(answers.manager) {
            case 'View Products for Sale':
                viewProductsAlone();
                break;
            case 'View Low Inventory':
                lowInventory();
                break;
            case 'Add Inventory':
                addInventory();
                break;
            case 'Add New Product':
                connection.query(
                    'SELECT * FROM product'
                    , function(err, results) {
                    if (err) throw err;
                    newProduct(results);
                });
                break;
        } 
    })
};

// View Products for Sale
function viewProductsCombo() {
    var table = new Table({
        head: ['Id','Item','Department Id','Price','Quantity'],
        colWidths: [5,20,20,10,10]
    });
    connection.query(
        `SELECT product.item_id, product.product_name, department.department_name, product.price, product.stock_quantity
        FROM product
        LEFT JOIN department
        ON product.department_id = department.department_id
        ORDER BY item_id;`
        , function(err, results) {
        if (err) {
            throw err;
        } else {
            // display received items in a table using cli-table
            for (var i = 0; i < results.length; i++) {
                table.push(
                    [results[i].item_id, results[i].product_name, results[i].department_name, `$${results[i].price}`, results[i].stock_quantity]
                )
            }
        }
        console.log(table.toString());
    })
};
// View Products for Sale
function viewProductsAlone() {
    var table = new Table({
        head: ['Id','Item','Department Id','Price','Quantity'],
        colWidths: [5,20,20,10,10]
    });
    connection.query(
        `SELECT product.item_id, product.product_name, department.department_name, product.price, product.stock_quantity
        FROM product
        LEFT JOIN department
        ON product.department_id = department.department_id
        ORDER BY item_id;`
        , function(err, results) {
        if (err) {
            throw err;
        } else {
            // display received items in a table using cli-table
            for (var i = 0; i < results.length; i++) {
                table.push(
                    [results[i].item_id, results[i].product_name, results[i].department_name, `$${results[i].price}`, results[i].stock_quantity]
                )
            }
        }
        console.log(table.toString());
        anotherAction();
    })
};

// View low inventory
function lowInventory() {
    connection.query(
        `SELECT product.item_id, product.product_name, department.department_name, product.price, product.stock_quantity
        FROM product
        INNER JOIN department
        ON product.department_id = department.department_id AND product.stock_quantity < 5
        ORDER BY item_id;`
        , function(err, results) {
        if (err) {
            throw err;
        } else {
            // display received items in a table using cli-table
            var table = new Table({
                head: ['Id','Item','Department','Price','Quantity'],
                colWidths: [5,20,20,10,10]
            });
            for (var i = 0; i < results.length; i++) {
                table.push(
                    [results[i].item_id, results[i].product_name, results[i].department_name, `$${results[i].price}`, results[i].stock_quantity]
                )
            }
            console.log(table.toString());
            anotherAction();
        }
    });
};

// Add to Inventory
function addInventory() {
    viewProductsCombo();
    connection.query(
        'SELECT * FROM product'
        , function(err, results) {
        if (err) {
            throw err;
        } else {
            inquirer.prompt([
                {
                    name: 'productId',
                    type: 'input',
                    message: 'Please type the item id that you would like to add invetory to.'
                },
                {
                    name: 'quantity',
                    type: 'input',
                    message: 'How many of this product would you like to add?'
                }
            ]).then(function(answers) {
                matchItem(results,answers);
            })
        }
    });
};

function matchItem(results,answers) {
    let chosenItem;
    for (let i = 0; i < results.length; i++) {
        if (parseInt(results[i].item_id) === parseInt(answers.productId)) {
            chosenItem = results[i];
        }
    };
    increaseStock(chosenItem, answers);
};

function increaseStock(chosenItem, answers) {
    let updatedQuantity = parseInt(chosenItem.stock_quantity) + parseInt(answers.quantity);
    let oldQuantity = parseInt(chosenItem.stock_quantity);
    // update mySQL database to reflect new quantity
    connection.query(`UPDATE product SET ? WHERE ?`,
        [
            {
                stock_quantity: stock_quantity = updatedQuantity
            },
            {
                item_id: chosenItem.item_id
            }
        ], function(error) {
            if (error) throw error;
            prettyFont(`${chosenItem.product_name}: Increased from ${oldQuantity} to ${updatedQuantity}`,'chrome','green')
            anotherAction();
        }
    );
};

function anotherAction() {
    prettyFont('Execute another action?','chrome','blue');
    inquirer.prompt([
        {
            name: 'makeAnotherAction',
            type: 'input',
            message: 'Type (Y) for yes or (N) for no -->',
            validate: function(value) {
                if (value === 'y' || value === 'Y' || value === 'n' || value === 'N') {
                    return true
                } else {
                    return 'Must type (Y) or (N)'
                }
            }
        }
    ]).then(function(answers) {
        if (answers.makeAnotherAction.toUpperCase() === 'Y') {
            start();
        } else {
            connection.end()
        }
    })
};

// Add New Product
function newProduct(results) {
    viewDepartments();
    connection.query(
        `SELECT * FROM department;`
        ,function(err,result) {
            if (err) {
                throw err;
            } else {
                inquirer.prompt([
                    {
                        name: 'newItem',
                        type: 'input',
                        message: 'Name of the item you would like to add?'
                    },
                    {
                        name: 'newQuantity',
                        type: 'input',
                        message: 'Quantity of the item?'
                    },
                    {
                        name: 'newPrice',
                        type: 'input',
                        message: 'Price of the this item?'
                    },
                    {
                        name: 'newDepartment',
                        type: 'input',
                        message: 'Department id of this item?',
                    }
                ]).then(function(answers) {
                    let newItem = answers.newItem;
                    let newPrice = answers.newPrice;
                    let newQuantity = answers.newQuantity;
                    let newDepartment = answers.newDepartment;
                    connection.query(
                        `INSERT INTO product (product_name,price,stock_quantity,department_id)
                        VALUES ("${newItem}","${parseFloat(newPrice)}",${parseInt(newQuantity)},${newDepartment});`
                    ,function(error) {
                        if (error) throw error
                        prettyFont(`Successfully added ${newItem} to inventory`,'chrome','green');
                        anotherAction();
                    })
                })

            }
        }
    )
};

function viewDepartments() {
    var table = new Table({
        head: ['Department Id','Deparment Name','Over Head'],
        colWidths: [20,20,20]
    });
    connection.query(
        `SELECT *
        FROM department;`
        , function(err, results) {
        if (err) {
            throw err;
        } else {
            // display received items in a table using cli-table
            for (var i = 0; i < results.length; i++) {
                table.push(
                    [results[i].department_id, results[i].department_name, results[i].over_head_costs]
                )
            }
        }
        console.log(table.toString());
    })
};



