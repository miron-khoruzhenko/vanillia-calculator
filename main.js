function getElm(str, isArr=false){
    if (!isArr) return document.querySelector(str);
    else return document.querySelectorAll(str);
}

const   numberBtns  = getElm(".btn--number", true),
        historyBl   = getElm(".calc__display__history"),
        parenBtn    = getElm("#btn--paren"),

        minusBtn    = getElm("#btn--minus"),
        multBtn     = getElm("#btn--mult"),
        plusBtn     = getElm("#btn--plus"),
        
        ftBtns      = getElm(".btn--operator", true),
        delBtn      = getElm("#btn--del"),
        divBtn      = getElm("#btn--div"),

        dotBtn      = getElm("#btn--dot"),
        sumBtn      = getElm("#btn--sum"),
        acBtn       = getElm("#btn--ac"),

        input       = getElm(".calc__display__input input");

const btnFt = {
    sum             : 0,
    isParenOpen     : false,
    isSumBtnUsed    : false,
    isParenDeleted  : false,

    allClear : () => {
        input.value         = " ";
        historyBl.innerText = "";
        btnFt.sum           = 0;
        btnFt.isSumBtnUsed  = false;
        btnFt.isParenOpen   = false;
        btnFt.isParenDeleted= false;
        parenBtn.style.background = "#d3d3d3";
    },

    repairStr: () =>{
        //* Восстановление строки после использования кнопки del. Убирает лишние пробелы и добавляет нужные

        str = input.value
        .replace(/\s/g, "") //Убрать возможные неправильные пробелы
        .replace(/[÷×+-]/g, " $& ") //Добавить пробелы вокруг операторов
        .replace(/\(\s\-\s/, "(-") //Убрать пробелы у минуса рядом со скобкой

        // Убрать пробелы у минуса вначале уравнения. Дальше уже пробелы будут уместны 
        if(str.slice(0,3).match(/\s\-\s/))
            str = "-" + str.slice(3);
        
        input.value = str;
    },
    
    formatString : () => {
        //* Форматирование строки для функции eval. Замена символов знаков умножения, деления и добавление знаков умножения,


        str = input.value
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
    
        for(let charIndex = 0; charIndex < str.length; charIndex++){
            if (str[charIndex] === "(" && charIndex !== 0){
                if(str[charIndex - 1].match(/\d/))
                    str = str.slice(0, charIndex) + " * " + str.slice(charIndex, )
            }
            
            else if (str[charIndex] === ")"){
                if(str[charIndex + 1]){
                    if(str[charIndex + 1].match(/[\d\(]/))
                            str = str.slice(0, charIndex + 1) + " * " + str.slice(charIndex + 1, )
                    }
                    
                    if(str[charIndex - 1].match(/[\s÷×+-.]/)){
                        str = str.slice(0, charIndex - 2) + ")"
                }
            }
    
            // Если в конце остался символ то отруби его.
            if(charIndex === str.length - 1 && !str[charIndex].match(/[\d\)]/g))
                str = str.slice(0, -1)
    
        }

        // if()
    
        
        try{
            btnFt.sum = eval(str);
        }catch{
            if(btnFt.isSumBtnUsed)
                input.value = "Error"
            return;
        }
    },

    delLastElem : () =>{
        if(input.value[input.value.length - 1] === ")"){
            btnFt.isParenOpen       = true;
            btnFt.isParenDeleted    = true;
            parenBtn.style.background = "#b5b4b4";
        }
        else if (input.value[input.value.length - 1] === "("){
            btnFt.isParenOpen       = false;
            btnFt.isParenDeleted    = false;
            parenBtn.style.background = "#d3d3d3";
        }
        if(input.value != " ")
            input.value = input.value.slice(0, input.value.length -1);
    },
    
    switchParen : () => {
        if(!btnFt.isParenOpen){
            btnFt.isParenOpen = true;

            // input.value += "(";
            parenBtn.style.background = "#b5b4b4";

        }else{
            // if(input.value[input.value.length - 2].match(/[÷×+-.\(]/))
            //     return;
            btnFt.isParenOpen = false;
            parenBtn.style.background = "#d3d3d3";
        }
        
        return btnFt.isParenOpen;
    },

    putParen : (func = null, arg = null) => {
        if (!btnFt.isParenOpen)
            input.value += "("
        
        for(let i = input.value.length - 1; i > 0 && !input.value[i].match(/\(/); i--){
            if (input.value[i].match(/\)/))
                input.value = input.value.slice(0,i) + input.value.slice(i + 1);
        }
            
        if(func === "( )"){
            console.log(1)
            if(input.value[input.value.length - 1] !== "(" || !btnFt.isParenOpen)
                btnFt.switchParen()
        }

        else if(func !== null)
            func(arg);

        input.value += ")"
    },

    isThereDot : (inputStr) => {
        for(let i = inputStr.length - 1; !inputStr[i].match(/[\s\-+÷×\)\(]/) && i > 0; i--){
            if(inputStr[i] === ".")
                return true;
            console.log(inputStr[i])                
        }
        return false;
    },

    operateDot : () => {
        let inputStr = input.value;

        inputStr = inputStr.replace(/\s/g, "");
        if (inputStr.match(/[÷×+\-\)\(]$/) || inputStr === ""){
            input.value += "0."
            return;
        }

        else if (btnFt.isThereDot(inputStr)){
            return;
        }
    
        input.value += ".";
        btnFt.repairStr()
    },


    sumAndDisplay : () => {
        //* Проверка, подсчет и вывод суммированного числа.

        inputVar = input.value
        btnFt.isSumBtnUsed = true;

        if(btnFt.isParenOpen)
            btnFt.switchParen()

        // Добавь всю проведенную операцию в историю но перед этим ...
        // Если в конце остались символы то удали их и прилегающий к ним пробел.
        if(inputVar.slice(-2).match(/[÷×+-.]\s/g))
            historyBl.innerText = input.value = inputVar.slice(0, inputVar.length - 2);
            
        // Если в конце стоит символ со скобкой то удали символ прилегающий к нему пробел но оставь скобку.
        else if(inputVar.slice(-2).match(/[\s÷×+-.]\)/))
            historyBl.innerText = inputVar.slice(0, -3) + ")"
        
        // Если ничего нет то просто перениси операцию
        else
            historyBl.innerText = inputVar;

        
        if(btnFt.isParenDeleted)
            input.value += ")"
        
        
        btnFt.repairStr()
        btnFt.formatString()

        // Если форматирование прошло успешно то покажи результат
        if(input.value !== "Error" && btnFt.sum !== undefined)
            input.value = btnFt.sum; 
    },

    ctrlDisplayNumBtn : (numBtn) => {
        //* Проверяет есть ли какие символы что бы отступить или нет и позже добавить число.

        let inputLastChar = input.value[input.value.length - 1] || " ";

        const addNum = () => {
            // Если нет никаких символов то просто добавь число к цифре
            if (!inputLastChar.match(/[\s÷×+-.]/g)){
                if(inputLastChar === '0' && !btnFt.isThereDot(input.value))
                    return;
                input.value += numBtn.innerText;
            }
            
            // Иначе создай уже новую цифру через пробел после знака
            else
                input.value += " " + numBtn.innerText;
        }

        // Если до этого уже было использованно равно то сначала все обнули.
        if(btnFt.isSumBtnUsed === true)
            btnFt.allClear();

        // Если скобка открыта, то добавь закрывающую скобку и добавь перед ней результат функции
        btnFt.isParenOpen ? btnFt.putParen(addNum) : addNum ()
        btnFt.repairStr()
    },




    ctrlAddSymbol : (sym) => {
        let inputStr    = input.value;

        // Если до этого уже было использованно равно то сначала все обнули.
        if(btnFt.isSumBtnUsed === true){
            btnFt.allClear();
            input.value = inputStr;
        }


        if(sym === "( )"){
            btnFt.putParen(sym)
            return;
        }

        if(inputStr === " " || inputStr === "" || inputStr.match(/\($/)){
            if(sym === "-")
                input.value += "-"

            else if(sym === "."){
                btnFt.operateDot()
            }
            return;
        }
        

        btnFt.repairStr()

        if(inputStr.match(/[\s\.]$/)){
            // if(inputStr.match(/\.$/)){
            //     input.value = inputStr.replace(/\d\.$/, "");
            // }
            
            // По любому остается пробел. Либо он был либо отрезание "0." создало его.
            // По этому его проверка излишне
            if(sym === ".")
            {
                console.log(input.value)
                btnFt.operateDot()
            }
            
            else{
                input.value = input.value.replace(/[÷×+-.]\s$/, `${sym} `);
            }
        }
        else if(sym === '.'){
            btnFt.operateDot()
        }

        else if(inputStr.match(/[\d\)]$/)){
            input.value += ` ${sym} `;
        }
        
    },
}

btnFt.allClear();

numberBtns.forEach(numBtn => {
    numBtn.addEventListener("click", () => btnFt.ctrlDisplayNumBtn(numBtn))
});

ftBtns.forEach(ftBtn => {
    //* При нажатии на функциональную кнопку, проверь символ, добавь его
    //* и выполни предыдущую операцию.

    ftBtn.addEventListener("click", () => {
        if(btnFt.isParenOpen && ftBtn.innerText !== "( )") 
            btnFt.putParen(btnFt.ctrlAddSymbol, ftBtn.innerText) 
            // btnFt.putParen(btnFt.ctrlAddSymbol(ftBtn.innerText)) 
            
        else
            btnFt.ctrlAddSymbol(ftBtn.innerText);

        btnFt.formatString();
    })
})


sumBtn.addEventListener("click", btnFt.sumAndDisplay)
acBtn.addEventListener("click", btnFt.allClear);
delBtn.addEventListener("click", btnFt.delLastElem);
