function getElm(str, isArr=false){
    if (!isArr) return document.querySelector(str);
    else return document.querySelectorAll(str);
}

const   numbers     = getElm(".btn--number", true),
        ftBtns      = getElm(".btn--operator", true),
        // closePaBtn  = getElm("#btn--close-pa"),
        percentBtn  = getElm("#btn--percent"),
        // openPaBtn   = getElm("#btn--open-pa"),
        minusBtn    = getElm("#btn--minus"),
        multBtn     = getElm("#btn--mult"),
        plusBtn     = getElm("#btn--plus"),
        // ansBtn      = getElm("#btn--ans"),
        delBtn      = getElm("#btn--del"),
        divBtn      = getElm("#btn--div"),
        // powBtn      = getElm("#btn--pow"),
        dotBtn      = getElm("#btn--dot"),
        sumBtn      = getElm("#btn--sum"),
        acBtn       = getElm("#btn--ac"),
        history     = getElm(".calc__display__history"),
        input       = getElm(".calc__display__input input");

let sum = 0,
    lastNum = 0,
    previousSym = '';

const btnFt = {
    allClear : () => {
        
    }
}
function allClear()
{
    input.value = "";
    history.innerText = "";
    sum = 0;
    lastNum = 0;
    previousSym = 0;
}

function delLast()
{
    input.value = input.value.slice(0, input.value.length -1);
}

function addSymbol(sym)
{
    let hstyStr = history.innerText
    let hstyLstCh = hstyStr[hstyStr.length - 1] || "";

    if(hstyLstCh === "" && input.value === "")
        return;

    if(hstyLstCh.match(/[%÷×+-.]/g) && input.value === "")
    {
        if(sym !== "%" && hstyLstCh !== "%")
            history.innerText = hstyStr.slice(0, hstyStr.length - 2) + " " + sym;

        else if(sym !== "%" && hstyLstCh === "%")
            history.innerText = hstyStr.slice(0, hstyStr.length - 1) + " " + sym;

        else if (sym === "%" && hstyLstCh !== "%")
            history.innerText = hstyStr.slice(0, hstyStr.length - 2) + sym;

        else
            history.innerText[hstyStr.length - 1] += sym;
        

    }else
    {
        if(sym === "%")
            history.innerText += " " + input.value + sym;
        else
            history.innerText += " " + `${input.value} ${sym}`;
        input.value = '';

    }
    previousSym = sym;

}

function addSum(sym){

    let allNumStr = history.innerText
                    .replace(/×/g, "*")
                    .replace(/%/g, "/ 100")
                    .replace(/÷/g, "/")

    console.log("allNumStr: ", allNumStr[allNumStr.length - 1])
    if(allNumStr === "")
        return;
    else if(!allNumStr[allNumStr.length - 1].match(/\d/g))
        allNumStr = allNumStr.slice(0, -1)

    console.log(allNumStr)

    sum = eval(allNumStr);
}


numbers.forEach(element => {
    element.addEventListener("click", () => {
        input.value += element.innerText;
    })
});

ftBtns.forEach(element => {
    element.addEventListener("click", () => {

        
        addSymbol(element.innerText);
        addSum();
        console.log("Sum", sum);
    })
})

sumBtn.addEventListener("click", () => {
    if (input.value)
        history.innerText += " " + input.value
    addSum();
    history.innerText = "";
    input.value = sum;

})

acBtn.addEventListener("click", allClear);
delBtn.addEventListener("click", delLast);
// minusBtn.addEventListener("click", () => {
//     // console.log(history.innerText.length)
//     addSymbol(minusBtn.innerText);
// })
// input.addEventListener("input", delLast);


// });

// function numberCtrl()
// {
//     let inputVar = input.value;

//     if(input.value[input.value.length - 2] === " " && 
//     input.value[input.value.length - 1] === " "){
//         input.value = inputVar.slice(0, inputVar.length - 1);
//         console.log(1)
//     }

//     console.log(parseInt("4+5".replace(/\s/g, "")))

//     // input.value = inputVar
//     // .replace(/[^-.0-9]/g, '')
//     // .replace(/(.)-+/g, '$1')
//     // .replace(/\.(?=.*\.)/g, '');
// }

// input.addEventListener("input", numberCtrl);

// function addSum(sym){
    // if(input.value === "" || history.innerText === "")
    //     if(history.innerText === ""){
    //         sum += +input.value
    //         return;
    //     }

    // let allNumArr = history.innerText.split(/[%÷×+-.\s]/g);
    // let previousNum = +allNumArr[allNumArr.length - 3];
    // console.log("Array:", allNumArr)
    // console.log("Operated number: ", previousNum)
    
    // lastNum = +input.value
    // switch (sym){
    //     case "+":
    //         sum += lastNum;
    //         break;
    //     case "-":
    //         sum -= lastNum;
    //         break;
    //     case "×":
    //         sum += previousNum * (lastNum - 1);
    //         break;
    //     case "÷":
    //         sum /= lastNum;
    //         break;

    
    // }
// }