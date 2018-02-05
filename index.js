const fs = require('fs');

const get_name_from_line = (line) => {
	var regEx = new RegExp('(PM|AM)+\t+([^\t]*)+\t','g');
	return line.match(regEx).map(x => {
		return x.slice(3,x.length-1);
	});
}

const main = (filename) => {
	console.log(`Parsing file ${filename}`);
	var content = fs.readFileSync(String(filename));
	var names = get_name_from_line(String(content));
	var all = {};
	var joined = [];
	for(i=0; i<names.length; i++){
		if(names[i].indexOf(' invited')!== -1) continue;
		if(names[i].indexOf(' left')!== -1) continue;
		if(names[i].indexOf(' unsent')!== -1) continue;
		if(names[i].indexOf(' removed')!== -1) continue;
		if(names[i].indexOf(' changed')!== -1) continue;
		if(names[i].indexOf('Group call ended.\r')!== -1) continue;


		if(names[i].indexOf(' joined the group') !== -1){
			joined.push(names[i].slice(0,names[i].indexOf(' ')));
			continue;
		}

		if(all[names[i]] === undefined) all[names[i]] = 1;
		else all[names[i]]++;
	}

	var keysSorted = Object.keys(all).sort(function(a,b){return all[b]-all[a]})

	console.log(joined);
	for(i=0; i<keysSorted.length; i++){
		console.log(`#${i+1}:\t${keysSorted[i]}${keysSorted[i].length>=8?'\t':'\t\t'}, 發言數:${all[keysSorted[i]]}`);
	}
}

main(process.argv.slice(2));