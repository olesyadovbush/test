const http = require('http');
const queryString = require('querystring');

let server = http.createServer(function (req, res){
    switch (req.url) {
        case '/form':
            if(req.method == 'POST'){
                console.log("[200]" + req.method + " to " + req.url);
                let fullBody = '';
                req.on('data', function(chunk){
                    fullBody += chunk.toString();
                });
                req.on('end', function(){
                    res.writeHead(200,"OK",{'Content-Type':'text/html'});
                    res.write('<html><head><title>Post data</title></head><body>');

                let dBody = queryString.parse(fullBody);
                let result = dBody['text'];
                    res.write ('<b>Inputed text</b>: '+ result + '</br>'); 
                    
                    function countSentences(text){
                        let sentences = text.split(". ");
                        if(sentences){
                            res.write ('<b>Count of sentences:</b> '+ sentences.length + '</br>');
                        } else{
                            res.write ('<b>Count of sentences: 0 </b></br>');
                        }
                    
                    }
                    
                    function countLetters(text){
                        let matchingInstances = text.match(/[a-z]/gi);
                        if(matchingInstances) {
                            res.write ('<b>Count of letters:</b> '+ matchingInstances.length + '</br>');
                            
                        } else{
                            res.write ('<b>Count of letters: 0 </b></br>');
                        }
                    }

                    function countPunctuationSigns(text){
                        let matchingInstances = text.match(/[.,?!;''""()-]/gi);
                        if(matchingInstances) {
                            res.write ('<b>Count of punctuation signs:</b> '+ matchingInstances.length + '</br>');
                            
                        } else{
                            res.write ('<b>Count of punctuation signs: 0 </b></br>');
                        }
                    }
                    function relationVowelsConsonants(text){
                        let matchingVowels = text.match(/[aeiou]/gi);
                        let matchingConsonants = text.match(/[qwrtypsdfghjklzxcvbnm]/gi);

                        if(matchingVowels&&matchingConsonants) { 
                            res.write ('<b>Relation vowel/consonants is:</b> '+ matchingVowels.length/matchingConsonants.length + '</br>');
                        } else {
                            res.write ('<b> Relation vowel/consonants is 0 </b></br>');
                        }
        
                    }
                    
                    function mostUsable(text, match, letter){
                        let vowels = text.match(match);
                        vowels.sort();
                    
                        let map = new Map();
                        let current = null;
                        let count = 0;
                        for (let i = 0; i < vowels.length; i++) {
                            if (vowels[i] != current) {
                                if (count > 0) {
                                    map.set(current,count);
                                }
                                current = vowels[i];
                                count = 1;
                            } else {
                                count++;
                            }
                        }
                        if (count > 0) {
                            map.set(current,count);
                        }
                    
                    map[Symbol.iterator] = function* () {
                        yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
                    }
                    const mapIter = map[Symbol.iterator]();
                    
                    res.write ('<b>5 Most Usable ' + letter + ' : ' + '</b>');
                    res.write ( mapIter.next().value + ' ' + mapIter.next().value + ' ' + mapIter.next().value + ' ' + 
                    mapIter.next().value + ' ' + mapIter.next().value + '</br>');
                    
                    }

                    countSentences(result);
                    countLetters(result);
                    countPunctuationSigns(result);
                    relationVowelsConsonants(result);
                    mostUsable(result, /[aeiouAEIOU]/gi, 'vowel');
                    mostUsable(result,/[qwrtypsdfghjklzxcvbnmQWRTYPSDFGHJKLZXCVBNM]/gi, 'consonant');
                res.write ('</body></html> '); 
                res.end();      
                });

            } else{
                console.log("[405] " + req.method + " to " + req.url);
                res.writeHead(405, "Method not supported", {"Content-Type" : "text/html"});
                res.end('<html><head><title>405 - Method not supported<title></head><body>' + '<h1>Method not supported</h1></body></html>');
            }
            break;
        default:
        console.log("[404] " + req.method + " to " + req.url);
        res.writeHead(404, "Not found",{'Content-Type' : 'text/html'});
        res.end('<html><head><title> 404 - Not found</title></head><body>' + '<h1>Not found</h1></body></html>');
    };
}).listen(8080, function(){
    console.log('Server is running on port 8080');
});