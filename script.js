
const empty_block = 0;
const black_block = 1;
const black_block_0 = 2;
const black_block_1 = 3;
const black_block_2 = 4;
const black_block_3 = 5;
const black_block_4 = 6;
const yellow_block = 7;
const light_bulb = 8;

const Youwin = document.querySelector("#youW");
const start = document.querySelector("#start");
const reset = document.querySelector("#reset");
const timerSpan = document.querySelector("#timer");
var nameSelector = null;
var pname = document.querySelector("#pname");


function createStateRecord(matrix){
    let state = [];
    for (let i = 0; i < matrix.length; i++){
        let row = []
        for (let j = 0; j < matrix[i].length; j++){
            row.push({col: false, row: false});
        }
        state.push(row);
}
    return state;}

var level_one = [[0,0,0,1,0,0,0]
                ,[0,2,0,0,0,4,0],
                [0,0,0,0,0,0,0],
                [1,0,0,1,0,0,1],
                [0,0,0,0,0,0,0],
                [0,1,0,0,0,4,0],
                [0,0,0,5,0,0,0]];

var level_two = [[0,0,2,0,1,0,0]
                ,[0,0,0,0,0,0,0],
                [1,0,1,0,5,0,1],
                [0,0,0,3,0,0,0],
                [4,0,1,0,1,0,1],
                [0,0,0,0,0,0,0],
                [0,0,1,0,4,0,0]];

var level_three = [[0,1,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,5,0,4,0,1],
                [0,2,1,0,0,0,0,1,0,0],
                [0,0,0,0,1,0,0,0,0,0],
                [0,2,0,0,1,3,1,0,0,0],
                [0,0,0,1,1,1,0,0,5,0],
                [0,0,0,0,0,1,0,0,0,0],
                [0,0,3,0,0,0,0,2,1,0],
                [5,0,1,0,2,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,2,0]];

let levelno = null;
let level = [];
var levels = [level_one, level_two, level_three];
let defaut = [...levels];
var table = null;
var state = null;
var table_body = null;
var startTime = null;
// function to create the table and fill it with the blocks

function create_table(level_no) {
    let lastplayed = localStorage.getItem("score");
    if (lastplayed != null){
        lastplayed = JSON.parse(lastplayed);
        document.querySelector("#Last_Played").innerText ="LAST TIME::: |Name: " + lastplayed.name + " |Time : " + lastplayed.time+ " |Level: " + lastplayed.level+1;
    }
    level = [];
    startTime = Date.now();
    table = document.querySelector("table");
    table.innerHTML = '';
    table_body = document.createElement("tbody");
    level = levels[level_no];
    state = createStateRecord(level);
    console.log(state);
    for (var i = 0; i < level.length; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < level[i].length; j++) {
            var cell = document.createElement("td");
            if (level[i][j] >= 1 && level[i][j] <= 6) {
                cell.style.backgroundColor = "black";
                if (level[i][j] >= 2) {
                    var txt = cell.innerText;
                    cell.innerText = level[i][j] - 2;
                    cell.style.color = "white";
                }
            }
            else{
                cell.style.backgroundColor = "white";
                level[i][j] = 0;
            }
            var cell_text = document.createTextNode(" ");
            cell.appendChild(cell_text);
            row.appendChild(cell);
        }
        table_body.appendChild(row);
    }
    table.appendChild(table_body);
    document.body.appendChild(table);
}

start.addEventListener("click", function () {
    levelno = document.querySelector("#levels").value;
    console.log(levelno);
    levelno = parseInt(levelno);
    nameSelector = document.querySelector("#name").value;
    pname.innerText = nameSelector;
    
    create_table(levelno);
});

reset.addEventListener("click", function () {
    levelno = null;
    level = [];
    levels = [...defaut];
    table = null;
    state = null;
    startTime = null;
    table_body = null;
    create_table(levelno);
});


function delegate(parent, type, selector, handler) {
    parent.addEventListener(type, function (event) {
        const targetElement = event.target.closest(selector)
        if (this.contains(targetElement)) handler.call(targetElement, event)
    })
}

//place light bulb in a cell on the table if the cell is white

delegate(document, 'click', 'td', function (event) {
    let k = this.innerHTML;
    if (this.style.backgroundColor != "black" && k.length <= 1) {
        this.innerHTML = "<img src='lightbulb.png' alt='lightbulb' width='20' height='20'>";
        this.style.backgroundColor = "yellow";
        level[this.parentNode.rowIndex][this.cellIndex] = light_bulb;
}
else if (this.style.backgroundColor != "black" && k.length > 1) {
    this.innerHTML = "";
    level[this.parentNode.rowIndex][this.cellIndex] = empty_block;
} 
editTable(level[this.parentNode.rowIndex],this.parentNode.rowIndex,"row",level);
console.log("column index" + this.cellIndex);
var col = getColumn(level, this.cellIndex);
editTable(col, this.cellIndex, "col",level);
setColumn(level, this.cellIndex, col);
colorFill();
if (checkWin()){
    Youwin.innerHTML = "<b>You win</b>";
    console.log("WIN");
    //if checkWin is true, store the name, level in local storage

    var endTime = timerSpan.innerText;

    var score = {
        name: nameSelector,
        level: levelno,
        time: endTime
    }
    if (localStorage.getItem("score") == null) {
        localStorage.setItem("score", JSON.stringify(score));
    }
    else {
        localStorage.remove("score");
        localStorage.setItem("score", JSON.stringify(score));
    }
}//Storing the level in session storage
else{
    if (sessionStorage.getItem("table") == null) {
        sessionStorage.setItem("table", JSON.stringify(level));
    }else{
        sessionStorage.remove("table");
        sessionStorage.setItem("table", JSON.stringify(level));
    }
}
//console.log(this.parentNode.rowIndex);
//console.log(this.cellIndex)
console.log(state);
});



 // change state of row in the table

 function editTable(arr, index,rorc,matrix) {
    let firstbulb = arr.indexOf(light_bulb);
    // find first occurence of black block
    let blackarr = [arr.indexOf(black_block), arr.indexOf(black_block_2), arr.indexOf(black_block_3), arr.indexOf(black_block_4), arr.indexOf(black_block_0), arr.indexOf(black_block_1)];
    // find smallest value in blackarr greater than -1 else return -1
    let blackmin = blackarr.filter(x => x > -1);
    let firstblack = 0;
    console.log(blackmin);
    if (blackmin.length == 0) { firstblack = arr.length;}else{firstblack = Math.min(...blackmin);}
    console.log(firstblack);
    // if first occurence of light bulb is less than first occurence of black block
    if(firstbulb < firstblack){
        //fill the array with yellow blocks until it reaches the black block
        
        for(let i = 0; i < firstblack; i++){
            if (arr[i] != light_bulb){    
                if (rorc == "row"){
                    state[index][i].row = true;
                    console.log("["+index+"]["+i+"]");
                    //console.log(i);
                }else {
                    state[i][index].col = true;
                }
                arr[i] = yellow_block;
            }
        }
    }
    if (firstbulb == -1){
        for(let i = 0; i < firstblack; i++){
            if (rorc == "row"){
                state[index][i].row = false;
                console.log(i + " " + index);
                console.log(state[i][index]);
                if (state[index][i].col === false && state[index][i].row === false){
                    arr[i] = empty_block;
                }else{
                    arr[i] = yellow_block;
                }
            }
            else{
                state[i][index].col = false;
                console.log(i + " " + index);
                console.log(state[i][index]);
                if (state[i][index].col === false && state[i][index].row === false){
                    arr[i] = empty_block;
                }else{
                    arr[i] = yellow_block;
                }
            }
        }
    }

    // if there are more black blocks, put them in an array
    let blackarr2 = [];
    for(let i = firstblack; i < arr.length; i++){
        if(arr[i] >= black_block && arr[i] <= black_block_4){
            blackarr2.push(i);
        }
    }
    console.log(blackarr2);
    // while there are more than 2 black blocks, check if there is a light bulb between them
    var sliced = null;
    while(blackarr2.length > 1){
        // if there is a light bulb between them, fill the array with yellow blocks until it reaches the next black block
        sliced = arr.slice(blackarr2[0], blackarr2[1]);
        if (sliced.includes(light_bulb)){
            for(let i = blackarr2[0] + 1; i < blackarr2[1]; i++){
                if (rorc == "row"){
                    state[index][i].row = true;
                }else if(rorc == "col") {
                    state[i][index].col = true;
                }
                if (arr[i] != light_bulb){
                    arr[i] = yellow_block;
                    console.log("yellowing:"+ i);
                }

            }
        }else{
            // if there is no light bulb between them, fill the array with white blocks until it reaches the next black block
            for(let i = blackarr2[0] + 1; i < blackarr2[1]; i++){
                if (rorc == "row"){
                    state[index][i].row = false;
                    if (state[index][i].col === false && state[index][i].row === false){
                        arr[i] = empty_block;
                    }else{
                        arr[i] = yellow_block;
                    }
                }
                else{
                    state[i][index].col = false;
                    if (state[i][index].col === false && state[i][index].row === false){
                        arr[i] = empty_block;
                    }else{
                        arr[i] = yellow_block;
                    }
                }
                console.log("whiting: "+ i);
            }
            
        }
        // remove the first black block from the array
        blackarr2.shift();
        console.log(blackarr2);
    }
    // if there is only one black block left, fill the array with yellow blocks until it reaches the end of the array
    if(blackarr2.length == 1){
        sliced = arr.slice(blackarr2[0], arr.length);
        if (sliced.includes(light_bulb)){
        for(let i = blackarr2[0] + 1; i < arr.length; i++){
            if (arr[i] != light_bulb){
                if (rorc == "row"){
                    state[index][i].row = true;
                }else {
                    state[i][index].col = true;
                }
                arr[i] = yellow_block;
                console.log("yellowing:"+ i);
            }
        }
    }else{
        for(let i = blackarr2[0] + 1; i < arr.length; i++){
            if (rorc == "row"){
                state[index][i].row = false;
                if (state[index][i].col == false && state[index][i].row == false){
                    arr[i] = empty_block;
                }else{
                    arr[i] = yellow_block;
                }
            }
            else{
                state[i][index].col = false;
                if (state[i][index].col == false && state[i][index].row == false){
                    arr[i] = empty_block;
                }else{
                    arr[i] = yellow_block;
                }
            }
        }
    }
}
}

// get column from 2d array

function getColumn(matrix, col){
    var column = [];
    for(var i=0; i<matrix.length; i++){
       column.push(matrix[i][col]);
    }
    return column;
 }

 // set column in 2d array

    function setColumn(matrix, col, arr){
        for(var i=0; i<matrix.length; i++){
            matrix[i][col] = arr[i];
         }
    }

// fill table with colors

function colorFill(){
    for (let i = 0; i < level.length; i++){
        for (let j = 0; j < level[i].length; j++){
            if (level[i][j] == yellow_block){
                table.rows[i].cells[j].style.backgroundColor = "yellow";
            }
            if (level[i][j] == empty_block){
                table.rows[i].cells[j].style.backgroundColor = "white";
            }
        }
    }
    console.log("colorfill");
}

//function to check if there is no more white blocks

function checkWin(){
    for (let i = 0; i < level.length; i++){
        for (let j = 0; j < level[i].length; j++){
            if (level[i][j] == empty_block){
                return false;
            }
        }
    }
    return true;
}

setInterval(function(){
    if (checkWin() != true){
        let dt = Math.floor((Date.now() - startTime) / 1000)
        let sec = String(dt % 60).padStart(2, '0')
        let min = ('0' + Math.floor(dt / 60)).slice(-2)
        timerSpan.innerText = `${min}:${sec}`
    }
}, 500)


