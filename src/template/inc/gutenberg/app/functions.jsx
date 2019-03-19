const functions = {
	isset: function()
	{
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

 	uniqid: function(len, prefix) 
 	{

		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		var string_length = len ? len : 10;
		var randomstring = '';

		for ( var x=0; x < string_length; x++ ) {

			var letterOrNumber = Math.floor(Math.random() * 2);

			if (letterOrNumber == 0) {
				var newNum = Math.floor(Math.random() * 9);
				randomstring += newNum;
			} else {
				var rnum = Math.floor(Math.random() * chars.length);
					randomstring += chars.substring(rnum,rnum+1);
			}

		}

		randomstring = prefix + randomstring;

		return randomstring;
	}
}

export default functions;