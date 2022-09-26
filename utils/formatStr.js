export default function formatString(){
	```
	Форматирование строки для функции eval. Замена символов знаков умножения, деления и добавление знаков умножения,
	```

	str = input.value
	.replace(/×/g, "*")
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

		// Если в конце остался символ то отруби его.
		if(char === str.length - 1 && !str[char].match(/[\d\)]/g))
			allNumStr = allNumStr.slice(0, -1)

	}

	
	try{
		btnFt.sum = eval(str);
	}catch{
		if(btnFt.isSumBtnUsed)
			input.value = "Error"
		return;
	}
}