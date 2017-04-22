var mysql = require("mysql");
var inquirer = require("inquirer");
var configs = require("./password.js");
require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: configs.Password.password,
  database: "Bamazon"
});



var supeStart = function(){

  inquirer.prompt([
     {
          type: "list", 
          name: "supeWhatDo",
          message: "What would you like to do?",
          choices: ["View Product Sales by Department", "Create New Department", "Exit"]
      },
      ]).then(function(result){

        switch(result.supeWhatDo){
            case "View Product Sales by Department":
            viewSales();
            break;

            case "Create New Department":
            addDept();
            break;

            case "Exit":
            exit();
            break;
        }

      })
  }


function viewSales(){

  connection.query("SELECT * FROM departments", function(err, res){
      var departmentSelect = [];

        for(var i=0; i<res.length; i++){
          departmentSelect.push(res[i].department_name);
        }
    inquirer.prompt([
     {
          type: "list", 
          name: "whatDept",
          message: "Which department?",
          choices: departmentSelect
      },
      ]).then(function(result){

        var departName = result.whatDept;

        console.log(departName);

        connection.query("SELECT * FROM departments WHERE department_name = '" + departName + "'", function(err, res){

            var overHead = res[0].over_head_costs;
            var salesToDate = res[0].total_sales;
            var profit = salesToDate - overHead;
            console.log("\n\n")
            console.table([
            {
              Department: departName,
              Over_Head_Costs: overHead,
              Sales_to_Date: salesToDate,
              Total_Profit: profit
            }, 
          ]);
          inquirer.prompt([
            {
                type: "list", 
                name: "anythingElse",
                message: "Would you like to do something else?",
                choices: ["yes","no"]
          },
            ]).then(function(result){

            switch(result.anythingElse){
            case "yes":
            inquireStart();
            break;

            case "no":
            exit();
            break;
            }

         })

        })
  

      })


  })

}

function addDept(){

  connection.query("SELECT * FROM departments", function(err, res){

    inquirer.prompt([
        {
            type: "input", 
            name: "departName",
            message: "What department do you want to add?"
        },

        {
            type: "input",
            name: "overCost",
            message: "What is the over head cost?"
        },
          ]).then(function(result){

          connection.query("INSERT INTO departments SET ?", {department_name: result.departName, over_head_costs: parseFloat(result.overCost)}, function(err, res){
                if (err) throw err;
                console.log("\n\n Your department has been added!\n\n");
                inquirer.prompt([
                    {
                      type: "list", 
                      name: "anythingElse",
                      message: "Would you like to do something else?",
                      choices: ["yes","no"]
                    },
                  ]).then(function(result){

                  switch(result.anythingElse){
                  case "yes":
                  inquireStart();
                  break;

                  case "no":
                  exit();
                  break;
                   }

                  }) 
                }) 

          })


  })

}

function exit()
{
  console.log("\n **Enjoy the weekend!** \n");
  connection.end();
  process.exit()
  return;
}     

module.exports = supeStart;