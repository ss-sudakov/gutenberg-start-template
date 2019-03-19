const functions = {
	isset: function(){
		var a = arguments
		var l = a.length
		var i = 0
		var undef
		

		if (l === 0) {
			throw new Error('Empty isset')
		}
		
		while (i !== l) {
			if (a[i] === undef || a[i] === null || Object.keys(a[i]).length === 0) {
				return false
			}
			i++
		}

		return true
	},
}

export default functions;