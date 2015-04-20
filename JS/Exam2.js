$(document).ready(function(){
    /* ------ Variables ------ */
    var col1 = "Month";
    var col2 = "Monthly Payment";
    var col3 = "Starting Balance";
    var col4 = "Paid to Principal";
    var col5 = "Paid to Interest";
    var col6 = "Remaining Balance";
    var columnNames = [col1,col2,col3,col4,col5,col6];
    /* ----------------------------------- */
    
    /* ------- Submit Events ----------- */
    
    $("#submitBtn").click(function(){
        var loanAmount = $("#amount").val();
        var loanIntRate = ($("#interestRate").val());
        var loanTerm = $("#term").val();
        $("#buttonWrap").toggle("slow");
        $("#inputTable").toggle("slow");
        $("#inputTabledWrap").fadeOut();
        createTable(columnNames);
        calcTable(loanTerm,loanAmount,loanIntRate,columnNames);
        setTimeout(function(){
            $("#loanTableWrap").fadeIn("slow");
        },600);
    })
});

/* --------- Create Table --------- */
function createTable(columnNames){
    var tbl = document.getElementById("loanTable");
    if (tbl == null) {
        
        /* --- Create table in DOM ---*/
        var newTbl = document.createElement("TABLE");
        newTbl.id = "loanTable";
        newTbl.classList.add("loanTable");
        /* -------------------------- */
        
        /* --- Table Body --- */
        var tblBody = document.createElement("TBODY");
        tblBody.id = "tableBody";
        tblBody.classList.add("loanTable_tbody");
        newTbl.appendChild(tblBody);
        /* ------------------- */
        
        /* --- Table Caption --- */
        var tableCaption = newTbl.createCaption();
        tableCaption.innerHTML = "Amortization Table";
        /* --------------------- */
        
        /* --- Table Header --- */
        var header = newTbl.createTHead();
        header.id = "tableHeader";
        header.classList.add(/*some class*/);
        var headerRow = header.insertRow(0);
        headerRow.id = "headerRow";
        for(var i=0; i < columnNames.length; i++){
            var headerCell = headerRow.insertCell(i);
            headerCell.classList.add("loanTable_header");
            $(headerCell).text(columnNames[i]).appendTo(headerRow);    
        }
        /* --- Display table --- */
        document.getElementById("loanTableWrap").appendChild(newTbl);
    }
}

function calcTable(term,amount,intRate,columnNames) {
    var rate = (intRate / 12) / 100;
    var step1 = (Math.pow((1+rate),term)) - 1;
    var step2 = rate / step1;
    var step3 = rate + step2;
    var principal = amount;
    var monthlyPayment = step3 * principal;

    var tableBody = document.getElementById("tableBody");
    for(var i=0; i < term; i++){
        var row = tableBody.insertRow(i);
        
        /* Term */
        var termCell = row.insertCell(0);
        $(termCell).text(i+1).appendTo(row);
        /* ---------- */
        
        /* Calculate Monthly Payment */
        var monthlyPaymentCell = row.insertCell(columnNames.indexOf("Monthly Payment"));
        var startBalCell = row.insertCell(columnNames.indexOf("Starting Balance"));
        var principalCell = row.insertCell(columnNames.indexOf("Paid to Principal"));
        var intCell = row.insertCell(columnNames.indexOf("Paid to Interest"));
        var remBalCell = row.insertCell(columnNames.indexOf("Remaining Balance"));
        $(monthlyPaymentCell).text("$" + monthlyPayment.toFixed(2));
        if (i==0) {
            var startingBalance = Number(principal);
            var intAccrued = Number(startingBalance * rate);
            var amtToPrincipal = Number(monthlyPayment - intAccrued);
            var remainingBalance = Number(startingBalance - amtToPrincipal);
            $(startBalCell).text("$" + startingBalance.toFixed(2));
            $(principalCell).text("$" + amtToPrincipal.toFixed(2));
            $(intCell).text("$" + intAccrued.toFixed(2));
            $(remBalCell).text("$" + remainingBalance.toFixed(2));
        }
        else{
            startingBalance = remainingBalance;
            intAccrued = Number(startingBalance * rate);
            amtToPrincipal = Number(monthlyPayment - intAccrued);
            remainingBalance = Number(startingBalance - amtToPrincipal);
            $(startBalCell).text("$" + startingBalance.toFixed(2));
            $(principalCell).text("$" + amtToPrincipal.toFixed(2));
            $(intCell).text("$" + intAccrued.toFixed(2));
            $(remBalCell).text("$" + remainingBalance.toFixed(2));  
        }
    }
}