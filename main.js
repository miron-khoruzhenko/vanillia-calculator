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
        sumBtn      = getElm("#btn--btnFt.sum"),
        acBtn       = getElm("#btn--ac"),
        input       = getElm(".calc__display__input input");

// let btnFt.sum = 0;

const btnFt = {
    isParenOpen : false,
    sum : 0,

    allClear : () => {
        input.value = "";
        historyBl.innerText = "";
        btnFt.sum = 0;
        previousSym = 0;
    },
    delLastElem : () =>{
        input.value = input.value.slice(0, input.value.length -1);
    },
    ctrlAddSymbol : (sym) => {
        let hstyStr = historyBl.innerText
        let hstyLstCh = hstyStr[hstyStr.length - 1] || "";
    
        if(hstyLstCh === "" && input.value === "")
            return;
    
        if(hstyLstCh.match(/[%÷×+-.]/g) && input.value === "")
        {
            if(sym !== "%" && hstyLstCh !== "%")
                historyBl.innerText = hstyStr.slice(0, hstyStr.length - 2) + " " + sym;
    
            else if(sym !== "%" && hstyLstCh === "%")
                historyBl.innerText = hstyStr.slice(0, hstyStr.length - 1) + " " + sym;
    
            else if (sym === "%" && hstyLstCh !== "%")
                historyBl.innerText = hstyStr.slice(0, hstyStr.length - 2) + sym;
    
            else
                historyBl.innerText[hstyStr.length - 1] += sym;
            
    
        }else
        {
            if(sym === "%")
                historyBl.innerText += " " + input.value + sym;
            else
                historyBl.innerText += " " + `${input.value} ${sym}`;
            input.value = '';
    
        }
    },

    formatHistoryStr : (str) => {
        str = str
        .replace(/×/g, "*")
        .replace(/%/g, "/ 100")
        .replace(/÷/g, "/")

        return str;
    },

    ctrlAddToSum : () => {

        let allNumStr = btnFt.formatHistoryStr(historyBl.innerText);

        if(allNumStr === "")
            return;

        else if(!allNumStr[allNumStr.length - 1].match(/\d/g))
            allNumStr = allNumStr.slice(0, -1)

        btnFt.sum = eval(allNumStr);
    },

    sumAndDisplay : () => {
        //Проверка, подсчет и вывод суммированного числа. 
        if (input.value)
            historyBl.innerText += " " + input.value
    
        btnFt.ctrlAddToSum();
        historyBl.innerText = "";
        
        input.value = btnFt.sum;
    },
    ctrlParen : () => {

    }
}

btnFt.allClear();

numberBtns.forEach(numBtn => {
    numBtn.addEventListener("click", () => {
        input.value += numBtn.innerText;
    })
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
