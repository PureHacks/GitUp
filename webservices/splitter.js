exports.formValues = function(data){
	var splits = data.split('&');
	var hash = [];
	console.log(splits.length);
	for (i = 0; i < splits.length; i++)
	{
		var iSplit = splits[i].split('=');
		hash[iSplit[0]] = iSplit[1];
	}
	return hash;
}