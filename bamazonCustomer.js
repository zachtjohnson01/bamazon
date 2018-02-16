// require mysql
var mysql = require('mysql');
// require inquirer
var inquirer = require('inquirer');
// create MySQL database called bamazon
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected!');
});

    // create a 'products' table that includes

        // item_id

        // product_name

        // department_name

        // price

        // stock_quantity

        // populate the database with 10 mock products

function displayProducts() {
    let query = 'SELECT * FROM product'
    connection.query(query, function(err, result) {
        if (err) throw err;
        console.log(result);
        connection.end();
    })
};

displayProducts();

purchaseProduct();

function purchaseProduct() {

    // create user interaction
    inquirer.prompt([
        {
            name: 'productId',
            type: 'input',
            message: 'What is the id number of the product that you would like to buy?'
        }, 
        {
            name: 'quantity',
            type: 'input',
            message: 'How many of this product would you like to buy?'
        }
    ]).then(function(answers){
        console.log(answers)
    })
    // display all items available for sale (id, name, price)

    // prompt user:
    
        // id of product they would like to buy
    
        // quantity of units they would like to buy
    
    // verify store has enough quantity of that product to meet customer's request
    
        // if not, display 'Out of stock', and prevent order completion
    
        // if so, fulfill customer order
    
            // update SQL database to reflect remaining quantity
    
            // once the update goes through, show customer the total cost of their purchase
}





