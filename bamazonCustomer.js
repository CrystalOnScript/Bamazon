   
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

    var itemIDs = [];

var customerStart = function(){

  inquirer.prompt([
         {
              type: "list", 
              name: "welcomeToStore",
              message: "Welcome! Would you like to buy stuff?",
              choices: ["Yes!", "No!"]
          },
          ]).then(function(result){

            switch(result.welcomeToStore){
                    case "Yes!":
                    buyItem();
                    break;
                    case "No!":
                    exit();
                    break;
            }

          })

}


var buyItem = function(){
    connection.query("SELECT * FROM products", function(err, res){

     	if(err) throw err;

      console.log("\n\n");
     	for(var i = 0; i< res.length; i++){

     		itemIDs.push(res[i].product_name);
        console.table([
            {
              Product: res[i].product_name,
              Price: res[i].price
            }, 
          ]);

     		
     		};

     			customerStart();	

     });

    var customerStart = function(){

    	inquirer.prompt([
    	   {
    	        type: "list", 
    	        name: "pickItem",
    	        message: "What item?",
    	        choices: itemIDs
    	    },
    	    ]).then(function(result){
    	    	var itemBuy = result.pickItem;

    	    	console.log(itemBuy);

    			connection.query("SELECT * FROM products WHERE product_name = '" + itemBuy + "'", function(err, res){
               			var howMany = res[0].stock_quantity;
                    var department = res[0].department_name;
                inquirer.prompt([
                    {
                        type: "input",
                        name: "buyRequest",
                        message: "How many would you like?"
                    }
                ]).then(function(result)
                {
                    if (parseFloat(result.buyRequest) <= howMany)
                    {
                    	var custRequest = parseFloat(result.buyRequest);
                    	var newQuantity = res[0].stock_quantity - custRequest;
                    	var itemPrice = res[0].price
                                        //console.log(result);
                        connection.query("UPDATE products Set ? Where ?", [{stock_quantity: newQuantity}, {product_name: res[0].product_name}], function(err, res)
                        {
                        	var totalPrice = custRequest * itemPrice;
                            if (err) throw err;
                            console.log('Thank you for your purchase. Your total is $'+totalPrice);

                            connection.query("SELECT * FROM departments WHERE department_name = '" + department + "'", function(err, res){

                              var oldSales = res[0].total_sales;

                              var newSales = totalPrice + oldSales;

                              connection.query("UPDATE departments Set ? Where ?", [{total_sales: newSales}, {department_name: department}])

                          })  

                            inquirer.prompt([
    	  						{
    						        type: "list", 
    						        name: "buyMore",
    						        message: "Would you like to buy another item?",
    						        choices: ["yes","no"]
    							},
    						    ]).then(function(result){

    						    	if(result.buyMore === "yes"){
    						    		customerStart();
    						    	}else{

    						    		exit();
    						    	}

    						    })
                      
                        })
                    }
                    else
                    {
                        console.log('Sorry, we currently only have '+res[0].stock_quantity+' left in stock.');

                        customerStart();
                       
                    }
                })
            });

    	    });


     };
}    	
    function exit()
    {
        console.log("\n\n **Thank you valued customer!**\n\n");
        connection.end();
        process.exit();
        return;
    }	

module.exports = customerStart;
