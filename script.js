const inputField = document.getElementById("input-field");
const numbers = document.querySelectorAll("#number");
const operations = document.querySelectorAll("#operator");
const equalsButton = document.getElementById("evaluate");
const clearAll = document.getElementById("clear-input");
const decimal = document.getElementById("decimal");

let expression = [];
let checkDecimal = false;

const setExpression = (input)=>{
    expression.push(input);
    inputField.value = expression.join("");
}

numbers.forEach((number)=>{
    number.addEventListener('click', (e)=>{
        setExpression(e.target.innerText);
    })
})

decimal.addEventListener('click',(e)=>{
    //to convert "." to "0." in the begining 
    if ( expression.length === 0 ) {
        setExpression("0");
        setExpression(".");
        checkDecimal = true;
    }
    // to prevent two decimals in one number
    else if ( !(checkDecimal === true) ) {
        checkDecimal = true;
        setExpression(e.target.innerText);
    }
})

operations.forEach((operation)=>{
    operation.addEventListener('click', (e)=>{
        //edge cases of operators
            //check for two consecutive operator
        if (!( "+,*,/".includes(e.target.innerText) && "+,-,*,/".includes(expression[expression.length - 1])) &&

            //check for operator in begining
            !( expression.length === 0 && "+,*,/,".includes(e.target.innerText)) &&
            
            //to prevent two consicutive "-"
            !( e.target.innerText === "-" && expression[expression.length - 1] === "-") &&

            //to prevent "-" after "+"
            !( e.target.innerText === "-" && expression[expression.length - 1] === "+")

            ){
                //set checkdecimal for new number
                if ("+,-,*,/".includes(e.target.innerText)) {
                checkDecimal = false;
            }
            //it will work on normal button click when there is no edge case
            setExpression(e.target.innerText);
        }
    })
})

equalsButton.addEventListener("click", ()=>{
    evaluate();
})

clearAll.addEventListener('click',()=>{
    inputField.value = "";
    expression = [];
    checkDecimal = false;
})

const evaluate = () => {
    const inputArray = inputField.value;
    result = calculation(convertStringToArray(inputArray));

    if (result?.toString().includes(".")) {
        //limiting the result upto 2 decimal places
        result = result.toFixed(2);
        checkDecimal = true;
    }
    
    inputField.value = result;
    expression = [result];

    if (!result && result !== 0) {
        inputField.value = "NaN";
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
    const precedenceArray = [
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
    for (const operators of precedenceArray) {   
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