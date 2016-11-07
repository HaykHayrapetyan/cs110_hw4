"use strict";
const http = require('http');
const fs = require('fs');
const  querystring = require('querystring');
const  url = require('url');
let todos = [];

const server = http.createServer(function(req, res) {
    const method = req.method;
    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);

    if(req.url.indexOf('/todos') === 0) {
        res.setHeader('Content-Type', 'application/json');
        if(method === 'GET') {
            let localTodos = todos;
            if(parsedQuery.s) {
                localTodos = localTodos.filter(function(obj) {
                    return obj.message.indexOf(parsedQuery.s) >= 0;
                });
            }
            return res.end(JSON.stringify({items : localTodos}));
        }
    }
    else if(req.url.indexOf('/create') === 0){
            res.setHeader('Content-Type', 'application/json');
            if(method === 'POST') {
                let body = '';
                req.on('data', function (chunk) {
                    body += chunk;
                });
                req.on('end', function () {
                    let jsonObj = JSON.parse(body);
                    jsonObj.id = Math.random()+'';
                    todos.push(jsonObj);
                    return res.end(JSON.stringify(todos));
            });
        }
    }
    else if(req.url.indexOf('/delete/')===0){
        let id = req.url.substr(8);
        for(let i = 0; i < todos.length; i++) {
            if(id === todos[i].id) {
                todos.splice(i, 1);
                res.statusCode = 200;
                return res.end('');
            }
        }
        res.statusCode = 404;
        return res.end('');
    }
    else if(method === 'PUT') {
        if (req.url.indexOf('/update/') === 0) {
            let new_id = req.url.substr(8);
            for (let i = 0; i < todos.length; i++) {
                if (todos[i].id === new_id) {
                    todos[i].checked = !(todos[i].checked);
                    res.statusCode = 200;
                    return res.end('');
                }
            }
            res.statusCode = 404;
            return res.end('');
        }
    }

    else {
        fs.readFile('public'+ req.url, function(err, data){
            if(err){
                res.writeHead(404);
                return res.end(err+'');
            }
            else {
                res.writeHead(200);
                res.end(data);


            }
        });
    }
});
server.listen(3002);