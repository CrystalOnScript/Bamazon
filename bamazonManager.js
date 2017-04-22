
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

    var departmentOptions = [];

    connection.query("SELECT * FROM departments", function(err, res){

      for(var i=0; i<res.length; i++){
        departmentOptions.push(res[i].department_name)
      }

    });

    var managerStart = function(){

      inquirer.prompt([
         {
              type: "list", 
              name: "whatDo",
              message: "What would you like to do?",
              choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
          },
          ]).then(function(result){


                switch(result.whatDo){
                    case "View Products for Sale":
                    viewProducts();
                    break;

                    case "View Low Inventory":
                    viewLow();
                    break;

                    case "Add to Inventory":
                    addInventory();
                    break;

                    case "Add New Product":
                    addProduct();
                    break;

                    case "Exit":
                    exit();
                    break;
                }


          });


     };

     var viewProducts = function(){

        connection.query("SELECT * FROM products", function(err, res){

        if(err) throw err;

     

        for(var i = 0; i< res.length; i++){

            console.log("Item ID: "+ res[i].item_id+" | Item Name: "+res[i].product_name+" | Price: $"+res[i].price +" | Quantity: "+res[i].stock_quantity+ "\n");
            
            };

                managerStart();

        });



     };

     var viewLow = function(){


        connection.query("SELECT * FROM products", function(err, res){

        if(err) throw err;

        console.log("\n\n The following items are low in stock:\n")
        for(var i = 0; i< res.length; i++){

          if(res[i].stock_quantity < 6){

            console.log("Item ID: "+ res[i].item_id+" | Item Name: "+res[i].product_name+" | Price: $"+res[i].price +" | Quantity: "+res[i].stock_quantity+ "\n");

          }

        }  
            
            managerStart();

        });    

     };

     var addInventory = function(){

      var itemToStock = [];

      connection.query("SELECT * FROM products", function(err, res){


        if(err) throw err;

        for(var i = 0; i< res.length; i++){

          itemToStock.push(res[i].product_name);
          
        };
        inquirer.prompt([
         {
              type: "list", 
              name: "addStockItem",
              message: "What item?",
              choices: itemToStock,
          },
          ]).then(function(result){

            var itemStock = result.addStockItem;

            console.log(itemStock);

            connection.query("SELECT * FROM products WHERE product_name = '" + itemStock + "'", function(err, res){
                    var howMany = res[0].stock_quantity
                    var whatItemStock = res[0].product_name

                    console.log(whatItemStock + " currently has "+ howMany)
                    inquirer.prompt([
                    {
                        type: "input",
                        name: "addItemStock",
                        message: "How many are you adding?"
                    }
                ]).then(function(result){
                  
                    var addStockNumber = parseFloat(result.addItemStock);
                    
                    console.log(addStockNumber);

                    var newQuantity = res[0].stock_quantity + addStockNumber;

                    connection.query("UPDATE products Set ? Where ?", [{stock_quantity: newQuantity}, {product_name: res[0].product_name}], function(err, res){

                        console.log("\n\nThanks! "+whatItemStock+" now has "+newQuantity+" in stock!\n\n");

                        managerStart();

                    });

                });

           });
        });

      });
     };     

     var addProduct = function(){
        console.log("Add New Product")

        inquirer.prompt([
        {
            type: "input", 
            name: "itemName",
            message: "What new item do you want to add?"
        },

        {
            type: "input",
            name: "price",
            message: "How much is each unit?"
        },

        {
            type: "list", 
            name: "whatDept",
            message: "What department does this item belong in?",
            choices: departmentOptions
        },

         {
            type: "input",
            name: "unitNumber",
            message: "How many are you adding?"
        }
          ]).then(function(result)
              {

                  connection.query("INSERT INTO products SET ?", {product_name: result.itemName, price: parseFloat(result.price), department_name: result.whatDept, stock_quantity: parseFloat(result.unitNumber)}, function(err, res){
                      if (err) throw err;
                      console.log("\n\n Your item has been added!\n\n");
                      managerStart();
                      }) 

               });   
               

     };
    	
    function exit()
    {
        console.log("\n **Enjoy the weekend!** \n");
        connection.end();
        process.exit();
        return;
    }	

module.exports = managerStart;

