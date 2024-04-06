const inputField = document.querySelector(".input-field");
const keys = document.querySelectorAll(".key");

let inputText = [];
const keysArray = Array.from(keys);
inputField.value = 0;

let number = [];

for (let i = 0; i < keysArray.length; i++) {
    keysArray[i].addEventListener("click", () => {
        switch (keysArray[i].innerHTML) {
            case "=": {
                evaluation();
                break;
            }
            case "C": {
                inputText = [];
                number = [];
                inputField.value = "";
                break;
            }
            default: {
                if("+,-,*,/".includes(keysArray[i].innerHTML)) {
                number = [];
                }
                number.push(keysArray[i].innerHTML);
                inputText.push(keysArray[i].innerHTML);
                inputField.value = inputText.join("");
                console.log(inputText)
                console.log(number)
            }
        }
    });
}

const evaluation = () => {
    const inputString = inputField.value;
    let result = calculation(convertStringToArray(inputString));
    inputField.value = result;
    console.log(result)
};
  
function convertStringToArray(inputString) {
    const result = [];
    let number = "";
    for (const character of inputString) {
        if ("*/+-".includes(character)) {
            if (number === "" && character === "-") {
                number = "-";
            } 
            else {
                result.push(parseFloat(number), character);
                number = "";
            }
        }else {
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
            "+": (a, b) => a + b, 
            "-": (a, b) => a - b 
        },
    ];
    
    let operator;
    
    for (const operators of precedenceArray) {   
        const newarray = [];
        for (const element of array) {  
            if (element in operators) {
                operator = operators[element];
            } 
            else if (operator) {
                newarray[newarray.length - 1] = operator(newarray[newarray.length - 1], element);
                operator = null;
            } 
            else{
                newarray.push(element);
            }
        }
        array = newarray;
    }
    return array[0]                               
} 