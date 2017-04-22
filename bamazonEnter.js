var mysql = require("mysql");
var inquirer = require("inquirer");
var configs = require("./password.js");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: configs.Password.password,
  database: "Bamazon"
});


var managerStart = require("./bamazonManager.js");
var customerStart = require("./bamazonCustomer.js");
var supeStart = require("./bamazonSupervisor.js");


var start = function(){

 	inquirer.prompt([
     {
          type: "list", 
          name: "whoAreYou",
          message: "Who are you?",
          choices: ["Customer", "Manager", "Supervisor", "Oops, I'm in the wrong palce!"]
      },
      ]).then(function(result){

      	switch(result.whoAreYou){
                case "Customer":
                customerStart();
                break;

                case "Manager":
                managerStart();
                break;

                case "Supervisor":
                supeStart();
                break;

                case "Oops, I'm in the wrong palce!":
                exitSupe();
                break;
            }

      })

};

function exitSupe(){
    console.log("\n **Hey! Thanks okay! Thanks for stopping by!** \n");
    connection.end();
    process.exit()
    return;
}	


start();
