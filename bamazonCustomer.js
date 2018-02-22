// require mysql
const mysql = require('mysql');

// require inquirer
const inquirer = require('inquirer');

// require cli-table to display table
const Table = require('cli-table');

// require font.js for display
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
    start();
});

function start() {
    prettyFont('Bamazon','huge','red');
    prettyFont('Make a purchase?','chrome','red');
    inquirer.prompt([
        {
            name: 'purchase',
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
    ]).then(function(answer) {
        if (answer.purchase.toUpperCase() === 'Y') {
            makePurchase()
        } else {
            connection.end()
        }
    })
};

function makePurchase() {
    // retrieve table data from mySQL database
    connection.query('SELECT * FROM product', function(err, results) {
        if (err) throw err;
        displayProducts(results);
        inquirer.prompt([
            {
                name: 'productId',
                type: 'input',
                message: 'Please type the Id Number of the item that you would like to purchase?'
            }, 
            {
                name: 'quantity',
                type: 'input',
                message: 'How many of this product would you like?'
            }
        ]).then(function(answer){
            purchaseItem(answer,results);
        });
    });
};

function displayProducts(results) {
    // display received items in a table using cli-table
    var table = new Table({
        head: ['Id','Item','Department','Price','Quantity'],
        colWidths: [5,20,20,10,10]
    });
    for (let i = 0; i < results.length; i++) {
        table.push(
            [results[i].item_id, results[i].product_name, results[i].department_name, `$${results[i].price}`, results[i].stock_quantity]
        )
    }
    console.log(table.toString());
};

function makeAnotherPurchase() {
    prettyFont('Make another purchase?','chrome','blue');
    inquirer.prompt([
        {
            name: 'AnotherPurchase',
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
    ]).then(function(answer){
        if (answer.AnotherPurchase.toUpperCase() === 'Y') {
            makePurchase();
        } else {
            connection.end()
        }
    })
};

function purchaseItem(answer,results){
    let chosenItem;
    for (var i = 0; i < results.length; i++) {
        if (parseInt(results[i].item_id) === parseInt(answer.productId)) {
            chosenItem = results[i];
        }
    };
    if (chosenItem.stock_quantity < 1) {
        console.log('Out of Stock')
        makeAnotherPurchase();
    } else {
        // if so, fulfill customer order
        reduceStock(chosenItem,answer);
        increaseRevenue(chosenItem,answer);
    };
};

function reduceStock(chosenItem,answer) {
    let updatedQuantity = parseInt(chosenItem.stock_quantity) - parseInt(answer.quantity);
    // update mySQL database to reflect remaining quantity
    connection.query(
        "UPDATE product SET ? WHERE ?",
        [
            {
                stock_quantity: stock_quantity = updatedQuantity
            },
            {
                item_id: chosenItem.item_id
            }
        ], function(error) {
            if (error) throw err;

            prettyFont(`Thank you. Your total is $${answer.quantity * chosenItem.price}`,'chrome','green');
            makeAnotherPurchase();
        }
    );
};

function increaseRevenue(chosenItem,answer) {
    let updatedRevenue = parseInt(chosenItem.product_sales) + (parseInt(answer.quantity) * parseInt(chosenItem.price));
    // update mysQL database to reflect the updated product_sales
    connection.query(
        "UPDATE product SET ? WHERE ?",
        [
            {
                product_sales: product_sales = updatedRevenue
            },
            {
                item_id: chosenItem.item_id
            }
        ], function(error) {
            if (error) throw error;
        }
    );
}