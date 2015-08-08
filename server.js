fs = require('fs');
fs.readFile('./data/languages.csv', 'utf8', function(err, data){
  if (err){
    console.log('ERROR');
    console.log(err);
    return;
  }
  finishedReadingData(data);
});

function finishedReadingData(data){
  console.log('finished reading data');

  // start server
  var http = require('http');
  const PORT=8080;
  function handleRequest(request, response){
      response.end('It Works!! Path Hit: ' + request.url);
  }

  var server = http.createServer(handleRequest);

  server.listen(PORT, function(){
      console.log("Server listening on: http://localhost:%s", PORT);
  });
}
