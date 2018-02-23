// require mySQL for database
const mysql = require('mysql');

// require inquirer for user interaction
const inquirer = require('inquirer');

// require cli-tabl to display table
const Table = require('cli-table');

// require font.js for display
const prettyFont = require('./font.js');

// create mySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
});

// establish connection with mySQL database

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start() {
    prettyFont('Bamazon','huge','red');
    prettyFont('Please select one of the following','chrome','red');
    inquirer.prompt([
        {
            name: 'action',
            type: 'list',
            message: 'Please select one of the following:',
            choices: ['View Product Sales by Department','Create New Department']
        }
    ]).then(function(answer) {
        switch(answer.action) {
            case 'View Product Sales by Department':
                departmentSales();
                break;
            case 'Create New Department':
                createDepartment();
                break;
        }
    })
};

function departmentSales() {
    // display items in table using cli-table
    let table = new Table({
        head: ['department_id','department_name','over_head_costs','product_sales','total_profit'],
        colWidths: [25,25,25,25,25]
    });
    connection.query(
        `SELECT department.department_id, department.department_name, department.over_head_costs, SUM(product.product_sales) as product_sales, SUM(product.product_sales) - department.over_head_costs  AS total_profit
        FROM department
        LEFT JOIN product 
        ON department.department_id = product.department_id
        GROUP BY department.department_id;`
        , function(err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            table.push(
                [results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].product_sales, results[i].total_profit]
            )
        };
        console.log(table.toString());
    });
};

function createDepartment() {

};


