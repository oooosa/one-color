//REVERSE PROXY SERVER
var express = require('express');
var app = express();
var http = require('http').Server(app);


//listen for serving static files
app.get('*', function(req, res){
	var path = req.params[0];
	if(path == "/rps.js" || path == "/gf.js" || path == "/package.json") return;

	if(path === '/') res.sendFile(__dirname+'/index.html');
	else if(path == '/getGamingServersInfo') res.send(config.serversList);
	else res.sendFile(__dirname+req.params[0]);

});
app.post('*', function(req, res){
	if(req.params[0] == "/uploadSkin"){
		var skinBuffer = req.files.skinBuffer.data;
		var skinId = req.body.skinId;
		var skinKey = req.body.skinKey;
	
		if(skinKey == skinManagmentKey){
			fs.writeFile(usersSkinsFolderName+"/"+skinId+".png", skinBuffer, function(){res.sendStatus(200);});	
		}
	}
	else if(req.params[0] == "/moveSkinToAvatarFolder"){
		var skinId = req.body.skinId;
		var skinKey = req.body.skinKey;

		if(skinKey == skinManagmentKey){
			fs.copyFile(usersSkinsFolderName+"/"+skinId+".png", "img/avatars/"+skinId+".png", function(){res.sendStatus(200);});		
		}
	}
})

http.listen(2000, function(){
	console.log('listning on port: '+2000);
});