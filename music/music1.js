var http=require('http');
var fs=require('fs');
const { url } = require('inspector');
var server=http.createServer();
server.listen(8000);
server.on('request',function(req,res){
        var urls=req.url;
        console.log(urls);
    if(urls=="/"){
        fs.readFile('music1.html',"utf-8",function(err,data){
            res.end(data);
        })
    }
    else if(urls.indexOf('.jpg')>0 || urls.indexOf('.jpeg')>0){
        fs.readFile('./img'+urls,function(err,data){
            res.end(data);
        })
    }
    else if(urls.indexOf('.js')>0 || urls.indexOf('.min')>0 ){
        fs.readFile('./js'+urls,function(err,data){
            res.end(data);
        })
    }
    else if(urls.indexOf('.css')>0){
        fs.readFile('./css'+urls,function(err,data){
            res.end(data);
        })
    }
    else if(urls.indexOf('.lrc') || urls.indexOf('.mp3') || urls.indexOf('.flac')){
        fs.readFile('./audio'+urls,function(err,data){
            res.end(data);
        })
    }
    else{
        fs.readFile("."+urls,function(err,data){
            res.end(data);
        })
    }
})