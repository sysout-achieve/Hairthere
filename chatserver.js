var express = require('express'), http = require('http'), app = express(), server = http.createServer(app);
app.get('/index.html', function(req,res){res.send('서버와 통신완료');});
server.listen(12345, function(){console.log('Express server listening on port ' +server.address().port);});
