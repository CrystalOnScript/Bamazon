var inquireStart = function(){

	inquirer.prompt([
	   {
	        type: "list", 
	        name: "whatDo",
	        message: "What would you like to do?",
	        choices: "View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product",
	    },
	    ]).then(function(result){


            switch(result){
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
            }


	    });


 };

 var viewProducts = function(){

    connection.query("SELECT * FROM products", function(err, res){

    if(err) throw err;

 

    for(var i = 0; i< res.length; i++){

        console.log("Item ID: "+ res[i].item_id+" | Item Name: "+res[i].product_name+" | Price: $"+res[i].price +" | Quantity: "+res[i].stock_quantity+ "\n");

        itemIDs.push(res[i].product_name);
        
        };



    });

 };

 var viewLow = function(){
    console.log("View Low Inventory")
 };

 var addInventory = function(){
    console.log("Add to Inventory")
 };

 var addProduct = function(){
    console.log("Add New Product")
 }