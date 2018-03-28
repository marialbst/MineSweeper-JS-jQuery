
$(document).ready(function(){
    var temp = "";
    var mines_count = 10;
    var rows = 8;
    var cols = 8;
    var count;
    var mines_field;
    var mines_index;
    var flags_field;
    var flags_index;
    var totalTime;
    var interval;

    $("#button").on("click", function(){
        //зануляваме позициите, защото при всяко кликване добавя нови 64	
        mines_field = [];
        mines_index =[];
        flags_field = [];
        flags_index = [];

        totalTime = 0;
        interval = setInterval(countSeconds, 1000);
        var colVal = $("#rows").val();
        var rowVal = $("#cols").val();
        var minesCount = $("#mines").val();

        cols = $.isNumeric(colVal) ? Number(colVal) : cols;
        rows = $.isNumeric(rowVal) ? Number(rowVal) : rows;
        mines_count = $.isNumeric(minesCount) ? Number(minesCount) : mines_count;
        count = rows*cols;
        unrevealed = count;

        generateIndex();
        
        generateEmptyField();
        $("#timer").html("Total time: ");
        $("#flag-badge").text(mines_count);
        $("#flags").text(" flags left");
        $("#result").html(temp);
        $("#container").css("display","inline-block");
    });
    
    $('body').on("contextmenu",".mine", function(){
        var x = $(this).data("row");
        var y = $(this).data("col");
        
        if($(this).hasClass("flag")){
            flags_index.splice($.inArray(x*cols+y, flags_index), 1);
            $(this).removeClass("flag");
            unrevealed++;
        }
        else if(flags_index.length < mines_count && !$(this).hasClass("clicked")){
            flags_index.push(x*cols+y);
            $(this).addClass("flag");
            checkForWin();
            unrevealed--;
        }
        $("#flag-badge").text(mines_count - flags_index.length);
        
        //hides context menu
        return false;
    })

    $('body').on("click", ".mine", function () {
        
        var x = $(this).data("row");
        var y = $(this).data("col");

        if(!$(this).hasClass("flag")){
            if (mines_index.includes(x*cols+y)){
                unrevealed--;
                generateBombField(x, y);
                alert("LOSER!");
            }
            else {
                clearField(x, y);
            }
        }
    });	

    //some sort of recursive
    function clearField(x,y){
        var currentElement = $("#mine_"+x+"_"+y+"").addClass("clicked");
        var minesAround = 0;
        if(y > 0){
            if (mines_index.includes((x-1)*cols+(y-1))){
                minesAround++;
            }

            if (mines_index.includes(x*cols+(y-1))){
                minesAround++;
            }

            if (mines_index.includes((x+1)*cols+(y-1))){
                minesAround++;
            }
        }

        if(y < cols-1){
            if (mines_index.includes((x-1)*cols+(y+1))){
                minesAround++;
            }

            if (mines_index.includes(x*cols+(y+1))){
                minesAround++;
            }

            if (mines_index.includes((x+1)*cols+(y+1))){
                minesAround++;
            }
        }

        if (mines_index.includes((x-1)*cols+y)){
            minesAround++;
        }

        if (mines_index.includes((x+1)*cols+y)){
            minesAround++;
        }	

        if (minesAround > 0){
            $("#mine_"+x+"_"+y+"").text(minesAround);
        }
        else{						
            if(y > 0 && y < cols-1 && x > 0 && x < rows-1){
                check(x,y-1);
                check(x,y+1);
                check(x-1,y-1);
                check(x-1,y+1);
                check(x+1,y+1);
                check(x+1,y-1);
                check(x+1,y);
                check(x-1,y);
            }
            else if(y==0){
                if(x!=rows-1){
                    check(x+1,y);
                    check(x+1,y+1);	
                }
                if(x!=0){
                    check(x-1,y);
                    check(x-1,y+1);
                }
                check(x,y+1);
            }
            else if(y==cols-1){
                if(x!=rows-1){
                    check(x+1,y);
                    check(x+1,y-1)
                }
                if(x!=0){
                    check(x-1,y);
                    check(x-1,y-1);
                }
                check(x,y-1);
            }
            else if(x==0){
                check(x, y-1);
                check(x,y+1);
                check(x+1,y-1);
                check(x+1,y);
                check(x+1,y+1);
            }
            else{
                check(x, y-1);
                check(x,y+1);
                check(x-1,y-1);
                check(x-1,y);
                check(x-1,y+1);
            }

        }
        unrevealed--;
        checkForWin();
    }

    function check(x,y){
        if(!$("#mine_"+x+"_"+y+"").hasClass("clicked") 
        && !$("#mine_"+x+"_"+y+"").hasClass("flag")){
            clearField(x,y);
        }
    }

    function checkForWin(){
        
        if(flags_index.length + unrevealed == mines_count){
            var matched_flags = 0;

            for(var i=0; i<flags_index.length;i++){
                if(mines_index.includes(flags_index[i])){
                    matched_flags++;
                }
            }

            if(matched_flags + unrevealed==mines_count){
                generateBombField();
                alert("YOU WIN!");
            }
        }
    }

    function countSeconds(){
        $("#time-badge").text(++totalTime);
    }

    function generateIndex(){
        while (mines_index.length < mines_count)
        {
            var index = Math.floor(Math.random()* count);
            
            if(!mines_index.includes(index))
            {
                mines_index.push(index);
            }	
        }
    };

    function generatePositions(indexes, field){
        for (var k = 0; k < count; k++ ) {
            if (indexes.includes(k)){
                field.push(1);
            }
            else{
                field.push(0);								
            }
        }
    };
            
    function generateBombField(coordX=-1, coordY=-1){
        var currentIndex = 0;
        
        clearInterval(interval);
        generatePositions(flags_index, flags_field);

        for (var i = 0; i < rows; i++){

            for (var j = 0; j < cols; j++){

                if (mines_field[currentIndex] == 1){

                    if(flags_field[currentIndex] == 1){

                        $("#mine_"+i+"_"+j+"").removeClass("flag");
                        $("#mine_"+i+"_"+j+"").addClass("match");
                    }
                    else{
                        if(i==coordX && j==coordY){
                            $("#mine_"+i+"_"+j+"").addClass("kaboom");
                        }
                        else{
                            $("#mine_"+i+"_"+j+"").addClass("picture");
                        }
                    }
                }
                $("#mine_"+i+"_"+j+"").css("pointer-events","none");
                currentIndex++;
            }
        }
    };

    function generateEmptyField(){
        generatePositions(mines_index, mines_field);
        temp="";
    
        for (var i = 0; i < rows; i++) 
        {
            temp += "<div >";
        
            for (var j = 0; j < cols; j++){
                temp += "<div class='mine' id='mine_"+ i +"_"+ j+"' data-row="+i+" data-col="+j+"></div>";							
            }
            temp += "</div>";
        }
    };
});