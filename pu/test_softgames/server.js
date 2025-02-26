const express = require('express')
const app = express();
const port = 3000;

app.get('*', (req, res) => {
	var path = req.params[0];
	if(path == "/") res.sendFile(__dirname+'/index.html');
	else res.sendFile(__dirname+path);
})

app.listen(port, () => console.log(`Game running on port ${port}!`));