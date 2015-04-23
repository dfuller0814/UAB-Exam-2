$(document).ready(function(){
/* <><><><><><> Event Handlers <><><><><><>><><><><><><><><><><>><><><><><><><><><><>><><> */

// ----- Show and hide sections selected in the dropdown list ------
    $("#sectionDropdown").change(function(){
	var selectedOption = $("#sectionDropdown option:selected").val();
	
	hideSections();
	
        if (selectedOption == "catList"){
            //Build table to store Category List data from server
            //Execute GET method to server to get Category List
            var serviceName = "getAllCategories";
            $("#retrieveMessage").fadeToggle();
            $.when(sendRequest("GET",true,serviceName,null)).done(function(){
                setTimeout(function(){
                    $("#retrieveMessage").hide();
                    $("#categoryListSection").fadeToggle();
                }, 2000);
            });
        }
	else{
            $("section[optionVal=" + selectedOption + "]").show();   
        }
    });
// ----------------------------------------------------------------------




// ------ User Clicks Submit in New Product Category Section ------------------------
    $("#submitNewCat").click(function(){
	    var catName = $("#catNameInput").val();
	    var catDesc = $("#catDescInput").val();
	    var serviceName = "CreateCategory";
            
            if (catName != "" && catDesc != "") {
                //Build request string from user input
                var requestString = '{"CName":"' + catName + '","CDescription":"' + catDesc + '"}';
                console.log("String submitted " + requestString);
                //Submit request to server
                sendRequest("POST",true,serviceName,requestString);
            }
    });
    


// ----------------------------------------------------------------------



// ------ User Clicks Submit in Update Category Info Section ------------------------
    $("#submitUpdateCat").click(function(){
	    var catId = $("#catIdInput").val();
	    var catDesc = $("#updateCatDescInput").val();
	    var serviceName = "updateCatDescription";
    
            if (catId != "" && catDesc != "") {
                //Build request string from user input
                var requestString = '{"CID":"' + catId + '","CDescription":"' + catDesc + '"}';
                console.log("String submitted " + requestString);
                //Submit request to server
                sendRequest("POST",true,serviceName,requestString);
            }	
	    
    });
    


// -----------------------------------------------------------------------------

// ------ User Clicks Submit in Delete Product Category Section ------------------------
    $("#submitBtnDelCust").click(function(){
        var catId = $("#catIdDelInput").val();
        var serviceName = "deleteCategory";
	
        if (catId != "") {
            //Submit request to server
            var confirmation = window.confirm("Once a Product Category is deleted, that product category cannot be recovered. Are you sure you want to delete this record?");
            if (confirmation == true) {
                sendRequest("GET",true,serviceName,catId);
            }
        }
        
    });


// ------------------------------------------------------------------------------

// ------ User Clicks the Clear Button ------------------------
    //Code for clicking the clear button
    $("button[customName='clear']").click(function(){
	
	//Clear the innerHTML text of all input fields and the error message div
	$("section[optionVal]:visible > table.inputTable > tbody > tr > td > input").each(function(){
	    $(this).val("");
	});
        
        //Clear the innerHTML text of all text area fields and the error message div
	$("section[optionVal]:visible > table.inputTable > tbody > tr > td > textarea").each(function(){
	    $(this).val("");
	});
	
	/* Clear Error Message Div */
	//Check if the Error Div is displayed
	$("section[optionVal]:visible > div.messageDiv").filter(":visible").each(function(){
	    $(this).slideToggle("fast");
	});
	    
	
    });
    


// ------------------------------------------------------------------------------



/* <><><<><><><><>><><><><><><><><><><><><><><><><><>><><>><><><><><><><><><><><><><><><>< */
    
    
});




// ************************* Functions to call *************************


// ---------------------- Hide all input sections --------------------------------------------------------------
function hideSections() {
	var allSections = document.querySelectorAll("section[optionVal]");
	$("section[optionVal]:visible > div.messageDiv").each(function(){
		$(this).hide();
	});
	$(allSections).each(function(){
	    $(this).hide();
	});
        
        //Remove Category List Table from the DOM when the user leaves the section
        var tableCheck = document.getElementById("catListTable");
        if (tableCheck != null) {
            console.log("Table exists..Removing");
            $("#catListTable").remove();
        }
        
}

// -------------------------------------------------------------------------------------------------------------

// ---------------------- Build Category List Table --------------------------------------------------------------
function createTable(jsonObj,webService) {
    var table;
    var tbody;
    var thead;
    var row;
    var cell;
    table = $("<table/>").append("<thead/>,<tbody/>").addClass("catListTable").prop("id", "catListTable");
    
    //Add table to the Table section
    $("#categoryListSection").append($(table));
    
    //Create Table Header
    thead = $("#catListTable > thead").prop("id","catListTableHeader").append("<tr><td>Category ID</td><td>Category Name</td><td>Category Description</td></tr>");
    
    //Table Body
    tbody = $("#catListTable > tbody").prop("id","catListTbody").addClass("catListTable_tbody");
    
    for(var i=0; i < jsonObj.GetAllCategoriesResult.length; i++){   
        //Create all table rows based on object length
        $(tbody).append("<tr><td>" +
                        jsonObj.GetAllCategoriesResult[i].CID +
                        "</td>" + "<td>" + jsonObj.GetAllCategoriesResult[i].CName +
                        "</td>" + "<td>" + jsonObj.GetAllCategoriesResult[i].CDescription + "</td>" + "</tr>");
    }
        
        
        
  

}

// -------------------------------------------------------------------------------------------------------------
    
    
    
// --------------------- AJAX Request function ------------------------------------------------------------------
function sendRequest(method,async,serviceName,reqString) {
    console.log("Request method begun");
    var request = new XMLHttpRequest();
    var url = "http://bus-pluto.ad.uab.edu/jsonwebservice/service1.svc/";
    console.log("Request Method is: " + method);
    console.log("Service Requested: " + serviceName);
    if (method == "GET") {
	
	if (serviceName == "deleteCustomer") {
	    url += serviceName + "/" + reqString;
	    request.open(method,url,async);
	    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    request.send();
	}
        else if(serviceName == "getAllCategories"){
            url += serviceName;
            request.open(method,url,async);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send();
        }
        
        else if (serviceName == "deleteCategory") {
	    url += serviceName + "/" + reqString;
	    request.open(method,url,async);
	    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    request.send();
	}
    }
    else if (method == "POST") {
	url += serviceName;
	request.open(method,url,async);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(reqString);
    }
    
    
    //Check Ready State for response
    request.onreadystatechange = function(){
	console.log("Ready State: " + request.readyState);
	console.log("Server Status: " + request.status);
	if (request.readyState == 4 && request.status == 200){
		console.log("Final Server Response: " + request.responseText);
		var reqResult = JSON.parse(request.responseText);
		checkResult(reqResult,serviceName);
	    }
    }
    
}

// -----------------------------------------------------------------------------------------------------------------


// ---------------------------- Function to Check Server Response --------------------------------------------------

function checkResult(jsonResult,serviceName) {
    
    // -------------------------All Categories Service Check ----------------------------------------------------
    
    if (serviceName == "getAllCategories") {
	if (typeof jsonResult.GetAllCategoriesResult != "undefined" && jsonResult.GetAllCategoriesResult != null){
            //Build Categories List Table
            createTable(jsonResult,serviceName);
        }
        
        else{
            //Can add error message if the list returns null if needed
        }
}
    
    
    // -------------------------Update Product Category Service Check -----------------------------------------------------
    
    else if (serviceName == "updateCatDescription") {
	if(jsonResult.WasSuccessful == 1){
	    $("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/successpic.png");
	    
	    //Remove the error class from all message boxes and add success class
	    $("section[optionVal]:visible > div.messageDiv").each(function(){
		if ($(this).hasClass("messageDiv_error")) {
		    $(this).removeClass("messageDiv_error").addClass("messageDiv_success");
		}
		else{
		    $(this).addClass("messageDiv_success");
		}
		
		//Populate message box with success message
		$("section[optionVal]:visible > div.messageDiv > p.resultMessage").each(function(){
		    $(this).text("Product Category Updated Successfully");
		});
		
		//Display message box
		$(this).show("fast");
	    });
	}
    
	else if(jsonResult.WasSuccessful == -2){
	    $("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/errorpic.png");
	    
	    //Remove the success class from message box and add success class
	    $("section[optionVal]:visible > div.messageDiv").each(function(){
		if ($(this).hasClass("messageDiv_success")) {
		    $(this).removeClass("messageDiv_success").addClass("messageDiv_error");
		}
		else{
		    $(this).addClass("messageDiv_error");
		}
		
		//Populate message box with error message
		$("section[optionVal]:visible > div.messageDiv > p.resultMessage").each(function(){
		    $(this).html("Update Failed: " + "<br/>" + "<br/>" + "Invalid Data String Sent to the Server");
		});
		
		//Display message box
		$(this).show("fast");
	    });
	}
    
	else if(jsonResult.WasSuccessful == -3){
	    $("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/errorpic.png");
	    
	    //Remove the success class from message box and add success class
	    $("section[optionVal]:visible > div.messageDiv").each(function(){
		if ($(this).hasClass("messageDiv_success")) {
		    $(this).removeClass("messageDiv_success").addClass("messageDiv_error");
		}
		else{
		    $(this).addClass("messageDiv_error");
		}
		
		//Populate message box with error message
		$("section[optionVal]:visible > div.messageDiv > p.resultMessage").each(function(){
		    $(this).html("Update Failed: " + "<br/>" + "<br/>" + "The Specified Order ID Could Not Be Found");
		});
		
		//Display message box
		$(this).show("fast");
	    });
	}
	
	else if(jsonResult.WasSuccessful == 0){
	    $("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/errorpic.png");
	    
	    //Remove the success class from message box and add success class
	    $("section[optionVal]:visible > div.messageDiv").each(function(){
		if ($(this).hasClass("messageDiv_success")) {
		    $(this).removeClass("messageDiv_success").addClass("messageDiv_error");
		}
		else{
		    $(this).addClass("messageDiv_error");
		}
		
		//Populate message box with error message
		$("section[optionVal]:visible > div.messageDiv > p.resultMessage").each(function(){
		    $(this).html("Update Failed: " + "<br/>" + "<br/>" + "Unspecified status code of 0 returned from the server");
		});
		
		//Display message box
		$(this).show("fast");
	    });
	}
    }
    
    //-------------------------------- DeleteCustomer Service Check --------------------------------------------------
    
    if (serviceName == "deleteCategory") {
	if (jsonResult.DeleteCategoryResult.WasSuccessful == 1) {
	    $("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/successpic.png");
	    
	    //Remove the error class from all message boxes and add success class
	    $("section[optionVal]:visible > div.messageDiv").each(function(){
		if ($(this).hasClass("messageDiv_error")) {
		    $(this).removeClass("messageDiv_error").addClass("messageDiv_success");
		}
		else{
		    $(this).addClass("messageDiv_success");
		}
		
		//Populate message box with success message
		$("section[optionVal]:visible > div.messageDiv > p.resultMessage").each(function(){
		    $(this).text("Product Category Deleted Successfully");
		});
		
		//Display message box
		$(this).show("fast");
	    });
	}
	
	else{
	    $("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/errorpic.png");
	    
	    //Remove the success class from message box and add success class
	    $("section[optionVal]:visible > div.messageDiv").each(function(){
		if ($(this).hasClass("messageDiv_success")) {
		    $(this).removeClass("messageDiv_success").addClass("messageDiv_error");
		}
		else{
		    $(this).addClass("messageDiv_error");
		}
		
		//Populate message box with error message
		$("section[optionVal]:visible > div.messageDiv > p.resultMessage").each(function(){
		    $(this).html("Delete Failed: " + "<br/>" + "<br/>" + jsonResult.DeleteCategoryResult.Exception);
		});
		
		//Display message box
		$(this).show("fast");
	    });
	}
    }
    
    
    // -------------------------New Product Category Service Check -------------------------------------------------------
    if (serviceName == "CreateCategory") {
	if (jsonResult.WasSuccessful == 1) {
	    $("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/successpic.png");
	    
	    //Remove the error class from all message boxes and add success class
	    $("section[optionVal]:visible > div.messageDiv").each(function(){
		if ($(this).hasClass("messageDiv_error")) {
		    $(this).removeClass("messageDiv_error").addClass("messageDiv_success");
		}
		else{
		    $(this).addClass("messageDiv_success");
		}
		
		//Populate message box with success message
		$("section[optionVal]:visible > div.messageDiv > p.resultMessage").each(function(){
		    $(this).text("New Product Category Created Successfully");
		});
		
		//Display message box
		$(this).show("fast");
	    });
	}
	
	else{
	    $("section[optionVal]:visible > div.messageDiv > img.resultIcon").attr("src", "Images/errorpic.png");
	    
	    //Remove the success class from message box and add success class
	    $("section[optionVal]:visible > div.messageDiv").each(function(){
		if ($(this).hasClass("messageDiv_success")) {
		    $(this).removeClass("messageDiv_success").addClass("messageDiv_error");
		}
		else{
		    $(this).addClass("messageDiv_error");
		}
		
		//Populate message box with error message
		$("section[optionVal]:visible > div.messageDiv > p.resultMessage").each(function(){
		    $(this).html("Create Operation Failed: " + "<br/>" + "<br/>" + jsonResult.Exception);
		});
		
		//Display message box
		$(this).show("fast");
	    });
	}
    }
    // -----------------------------------------------------------------------------------------------------------
}

// ************************************************************************

