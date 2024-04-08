const input = document.querySelector(".input-field");
const numbers = document.querySelectorAll(".number");
const operations = document.querySelectorAll(".operation");
const equalsButton = document.querySelector(".evaluate");
const clearAll = document.querySelector(".clear-input");
const decimal = document.querySelector(".decimal");

let expression = [];
let checkDecimal = [];

numbers.forEach((number)=>{
    number.addEventListener('click', (e)=>{
        expression.push(e.target.innerText);
        checkDecimal.push(e.target.innerText);
        input.value = expression.join("");
    })
})

decimal.addEventListener('click',(e)=>{
    //to convert "." to "0." in the begining 
    if ( expression.length === 0 ) {
        expression.push("0", ".");
        input.value = expression.join("");
        checkDecimal = ["0", "."];
    }
    // to prevent two decimals in one number
    else if ( !(checkDecimal.includes(".")) ) {
        checkDecimal.push(e.target.innerHTML);
        expression.push(e.target.innerHTML);
        input.value = expression.join("");
    }
})

operations.forEach((operation)=>{
    operation.addEventListener('click', (e)=>{
        //edge cases of operators
        if (//check for two consecutive operator
            !( "+,*,/".includes(e.target.innerHTML) && "+,-,*,/".includes(expression[expression.length - 1])) &&

            //check for operator in begining
            !( expression.length === 0 && "+,*,/,".includes(e.target.innerHTML)) &&
            
            //to prevent two consicutive "-"
            !( e.target.innerHTML === "-" && expression[expression.length - 1] === "-")

            ){
                //clear checkdecimal for new number
                if ("+,-,*,/".includes(e.target.innerHTML)) {
                checkDecimal = [];
            }
            //it will work on normal button click when there is no edge case
            
            expression.push(e.target.innerText);
            input.value = expression.join("");
        }
    })
})

equalsButton.addEventListener("click", ()=>{
    evaluate();
})

clearAll.addEventListener('click',()=>{
    input.value = "";
    expression = [];
    checkDecimal = [];
})

const evaluate = () => {
    const inputArray = input.value;
    result = calculation(convertStringToArray(inputArray));

    if (result?.toString().includes(".")) {
        //limiting the result upto 2 decimal places
        result = result.toFixed(2);
        checkDecimal = ["."];
    }
    
    input.value = result;
    expression = [result];

    if (!result && result !== 0) {
        input.value = "NaN";
        expression = [];
    }
};
  
function convertStringToArray(inputArray) {
    const result = [];
    let number = "";
    for (const character of inputArray) {
        if ("*/+-".includes(character)) {
            if (number === "" && character === "-") {
                number = "-";
            } 
            else {
                result.push(parseFloat(number), character);
                number = "";
            }
        } 
        else {
            number += character;
        }
    }
    if (number !== "") {
        result.push(parseFloat(number));
    }
    return result;
}
  
function calculation(array) {
    const PrecedenceArray = [
      {
        "/": (a, b) => a / b,
      },
      { 
        "*": (a, b) => a * b 
      },
      { 
        "+": (a, b) => a + b, "-": (a, b) => a - b 
      },
    ];
    //this will store operator function according to the key
    let operatorFunction;
    //operation according to the precedenceArray
    for (const operators of PrecedenceArray) {   
        const ansArray = [];
        for (const element of array) {  
            if (element in operators) {
                operatorFunction = operators[element];
            } 
            else if (operatorFunction) {
                ansArray[ansArray.length - 1] = operatorFunction(ansArray[ansArray.length - 1],element);
                operatorFunction = null;
            } 
            else {
                ansArray.push(element);
            }
        }
        array = ansArray;
    }
    return array[0]
}