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
    isParenOpen : false,
    sum         : 0,
    isSumBtnUsed: 0,
    isParenDel  : false,

    allClear : () => {
        input.value         = " ";
        historyBl.innerText = "";
        btnFt.sum           = 0;
        btnFt.isSumBtnUsed  = 0;
        btnFt.isParenOpen   = false;
        btnFt.isParenDel    = false;
        parenBtn.style.background = "#d3d3d3";
    },
    
    delLastElem : () =>{
        if(input.value[input.value.length - 1] === ")"){
            btnFt.isParenOpen   = true;
            btnFt.isParenDel    = true;
            parenBtn.style.background = "#b5b4b4";
        }
        else if (input.value[input.value.length - 1] === "("){
            btnFt.isParenOpen   = false;
            btnFt.isParenDel    = false;
            parenBtn.style.background = "#d3d3d3";
        }
        if(input.value != " ")
            input.value = input.value.slice(0, input.value.length -1);
    },
    
    ctrlAddSymbol : (sym) => {
        let inputStr    = input.value,
            inputLstCh  = inputStr[inputStr.length - 1] || "";

        if(btnFt.isSumBtnUsed === 1){
            btnFt.allClear();
            input.value = inputStr;
        }

        // TODO: (3 +) + del + () = (3) -> dark
        // TODO: (3 + 3) + del + "+" = (3 + +)
        if(btnFt.isParenOpen){
            inputLstCh = inputStr[inputStr.length - 2] || "";

            if(inputLstCh.match(/[\s÷×+-.\(\)]/g))
            {
                if (sym === "( )" && !btnFt.isParenDel){
                    input.value = `${inputStr.slice(0, inputStr.length - 3)}`;
                    btnFt.ctrlParen();
                }
                else if(!btnFt.isParenDel && inputLstCh === "(" && sym.match(/[×÷+]/))
                    input.value = `${inputStr.slice(0, inputStr.length - 1)}`;
                else
                {
                    if (btnFt.isParenDel && sym === "( )")
                        btnFt.ctrlParen();

                    else if(btnFt.isParenDel && inputLstCh.match(/[\s\d\(]/))
                    {
                        if(input.value.slice(-2).match(/\s\d/) || 
                        input.value.slice(-2).match(/\(\d/))
                            input.value += ` ${sym}`;

                        else
                            input.value = `${input.value.slice(0,-1)}${sym}`;
                    }

                    else{
                        input.value = `${inputStr.slice(0, inputStr.length - 3)} ${sym}`;
                    }
                    
                    btnFt.isParenDel = false;   
                }
            }

            else
            {
                if (sym === "( )")
                {
                    btnFt.ctrlParen();
                    return;
                }

                else if(!btnFt.isParenDel)
                {
                    if(inputLstCh === "(")
                    {
                        if(sym !== "×" && sym !== "÷" && sym !== "+")
                            input.value = `${inputStr.slice(0, inputStr.length - 1)}${sym}`;

                        else
                            input.value = `${inputStr.slice(0, inputStr.length - 1)}`;                          
                    }
                    else
                        input.value = `${inputStr.slice(0, inputStr.length - 1)} ${sym}`;
                }
                    
                else if(btnFt.isParenDel)
                {
                    if(inputLstCh.match(/[\s÷×+-.)]/))
                    {
                        input.value += ` ${sym}`;
                        return;                        
                    }
                    else if(inputLstCh.match(/\d/))
                        input.value += ` ${sym}`;

                    else
                        input.value += `${sym}`;

                    btnFt.isParenDel = false;
                }
            }

            input.value += ')';
        }

        else
        {
            if(inputLstCh.match(/[÷×+-.]/g)){
                if (sym === "( )")
                {
                    input.value = `${inputStr.slice(0, inputStr.length - 2)}`;
                    btnFt.ctrlParen();
                    input.value += ')';
                }
                
                else
                    input.value = `${inputStr.slice(0, inputStr.length - 2)} ${sym}`;
            }
            else
            {
                if (sym === "( )")
                {
                    btnFt.ctrlParen();
                    input.value += ')';
                }

                else if(inputLstCh == " " && (sym === "×" || sym === "÷" || sym === "+"))
                    return;

                else
                    input.value += ` ${sym}`;
            }
        }
    },

    formatStr : (str) => {
        str = str
        .replace(/×/g, "*")
        .replace(/%/g, "/ 100")
        .replace(/÷/g, "/")

        for(let char = 0; char < str.length; char++){
            if (str[char] === "(" && char !== 0){
                if(str[char - 1].match(/\d/))
                    str = str.slice(0, char) + " * " + str.slice(char, )
            }
            
            else if (str[char] === ")"){
                if(str[char + 1]){
                    if(str[char + 1].match(/[\d\(]/))
                            str = str.slice(0, char + 1) + " * " + str.slice(char + 1, )
                    }
                    
                    if(str[char - 1].match(/[\s÷×+-.]/)){
                        str = str.slice(0, char - 2) + ")"
                }
            }
        }

        return str;
    },

    ctrlAddToSum : () => {

        let allNumStr = btnFt.formatStr(input.value);

        if(allNumStr === "")
            return;

        else if(!allNumStr[allNumStr.length - 1].match(/[\d\)]/g))
            allNumStr = allNumStr.slice(0, -1)

        try{
            btnFt.sum = eval(allNumStr);
        }catch{
            if(btnFt.isSumBtnUsed)
                input.value = "Error"
            return;
        }
    },

    sumAndDisplay : () => {
        //Проверка, подсчет и вывод суммированного числа. 
        inputVar = input.value
        btnFt.isSumBtnUsed = 1;

        if(inputVar[inputVar.length - 1].match(/[\s÷×+-.]/g))
            historyBl.innerText = inputVar.slice(0, inputVar.length - 2);
        else if(inputVar.slice(-2).match(/[\s÷×+-.]\)/))
            historyBl.innerText = inputVar.slice(0, -3) + ")"
        else
            historyBl.innerText = inputVar;


        btnFt.ctrlAddToSum();
        if(input.value !== "Error")
            input.value = btnFt.sum;
    },

    ctrlDisplayNumBtn : (numBtn) => {
        const addNum = () => {
            if (!input.value[input.value.length - 1].match(/[\s÷×+-.]/g))
                input.value += numBtn.innerText;
            else
                input.value += " " + numBtn.innerText;
        }
        if(btnFt.isSumBtnUsed === 1)
            btnFt.allClear();
        if(btnFt.isParenOpen){
            if(!btnFt.isParenDel || 
                (btnFt.isParenDel && input.value[input.value.length - 1].match(/\s/)))
                input.value = input.value.slice(0, -1);

            btnFt.isParenDel = false
            addNum();
            input.value += ")";

            // btnFt.isParenDel = false
            // if(input.value[input.value.length - 1].match(/\s/))
            //     input.value = input.value.slice(0, -1);
            // addNum();
            // input.value += ")";
        }else
            addNum()
    },

    ctrlParen : () => {
        if(!btnFt.isParenOpen){
            btnFt.isParenOpen = true;
            input.value += "(";
            parenBtn.style.background = "#b5b4b4";
        }else{
            if(input.value[input.value.length - 2].match(/[÷×+-.\(]/))
                return;
            btnFt.isParenOpen = false;
            parenBtn.style.background = "#d3d3d3";

        }
    }
}

btnFt.allClear();

numberBtns.forEach(numBtn => {
    numBtn.addEventListener("click", () => btnFt.ctrlDisplayNumBtn(numBtn))
});

ftBtns.forEach(ftBtn => {
    //* При нажатии на функциональную кнопку, проверь символ, добавь его
    //* и выполни предыдущую операцию.

    ftBtn.addEventListener("click", () => {        
        btnFt.ctrlAddSymbol(ftBtn.innerText);
        btnFt.ctrlAddToSum();
    })
})


sumBtn.addEventListener("click", btnFt.sumAndDisplay)
acBtn.addEventListener("click", btnFt.allClear);
delBtn.addEventListener("click", btnFt.delLastElem);
