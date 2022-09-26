const input = {
	value : "   - 3 - (4- 6   )"
}

// export default function repairStr()
function repairStr()
{
	str = input.value
	.replace(/\s/g, "")
	.replace(/[÷×+-.]/g, " $& ")

	if(str.slice(0,3).match(/\s\-\s/))
		str = str[1] + str.slice(3);
}

//? 3()

