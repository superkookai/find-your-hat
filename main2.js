//Import Libraries
const prompt = require('prompt-sync')({sigint: true});
const clear = require('clear-screen');

//Characters use in the Game
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

//Create class FieldGame
class FieldGame {
    //Constructor
    constructor(plan){
        this._plan = plan;
        this._resultMessage = "";
        this._rowPos = 0;
        this._columnPos = 0;
    }
    //Getter/Setter
    get resultMessage(){ return this._resultMessage; }

    //Instance methods - print plan (map)
    print(){
        for(let i=0; i<this._plan.length; i++){
            let row = "";
            for(let j=0; j<this._plan[i].length; j++){
                row += this._plan[i][j] + " ";
            }
            console.log(row);
        }
    }

    //Instance methods - move
    move(direction){
        switch(direction){
            case 'u':
                this._rowPos -= 1;
                break;
            case 'd':
                this._rowPos += 1;
                break;
            case 'r':
                this._columnPos += 1;
                break;
            case 'l':
                this._columnPos -= 1;
                break;
            default:
                console.log("Invalid move!");
                break;
        }

        if (this._rowPos < 0 || this._columnPos < 0 || this._rowPos > this._plan.length - 1 || this._columnPos > this._plan[0].length - 1){
            this._resultMessage = "Lose! Outside Field!";
            return true;
        }
        
        const value = this._plan[this._rowPos][this._columnPos];
        if (value === fieldCharacter){
            this._plan[this._rowPos][this._columnPos] = pathCharacter;
            this._resultMessage = "You can move next!";
            return false;
        }else if (value === hole){
            this._resultMessage = "You Lose! On the hole!";
            return true;
        }else if (value === hat){
            this._resultMessage = "You win! Found hat!";
            return true;
        }

        
    }

    //Static method - generateField (generate plan(map))
    static generateField(row,column,percentOfHole){
        let plan = new Array(row);
        for (let i = 0; i < row; i++) {
            plan[i] = new Array(column);
            for (let j = 0; j < column; j++) {
                plan[i][j] = fieldCharacter;
            }
        }
        
        //Position of player
        plan[0][0] = pathCharacter;

        //Position of hat
        let rowOfHat = Math.floor(Math.random()*row);
        let columnOfHat = Math.floor(Math.random()*column);
        while(rowOfHat === 0 && columnOfHat === 0){
            rowOfHat = Math.floor(Math.random()*row);
            columnOfHat = Math.floor(Math.random()*column);
        }
        plan[rowOfHat][columnOfHat] = hat;

        //Position of holes
        let numberOfHole = Math.floor(row * column * percentOfHole / 100);
        while(numberOfHole > 0){
            let rowOfHole = Math.floor(Math.random()*row);
            let columnOfHole = Math.floor(Math.random()*column);
            while((rowOfHole === 0 && columnOfHole ===0) || (rowOfHole === rowOfHat && columnOfHole == columnOfHat)){
              rowOfHole = Math.floor(Math.random()*row);
              columnOfHole = Math.floor(Math.random()*column);
            }
            
            plan[rowOfHole][columnOfHole] = hole;
            numberOfHole -= 1;
        }

        return plan;
    }

}

// const myFieldGame = new FieldGame(
//     [
//         ['*', '░', 'O'],
//         ['░', 'O', '░'],
//         ['░', '^', '░'],
//     ]
// );

//Generate Plan (Map)
const myPlan = FieldGame.generateField(5,3,50);
//Create Object of FieldGame
const myFieldGame = new FieldGame(myPlan);

//Game Logic
myFieldGame.print();

let endCondition = false;
while(!endCondition){
    const direction = prompt("Which way? Please type [u,d,r,l]: ");
    endCondition = myFieldGame.move(direction);
    clear();
    console.log(myFieldGame.resultMessage);
    myFieldGame.print();
}
