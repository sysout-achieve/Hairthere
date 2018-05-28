var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// var personArray = new Array();
// var personInfo = new Object();
function getWorldTime(tzOffset) { // 24시간제
  var now = new Date();
  var tz = now.getTime() + (now.getTimezoneOffset() * 60000) + (tzOffset * 3600000);
  now.setTime(tz);
	var s =
    leadingZeros(now.getFullYear(), 4) + '-' +
    leadingZeros(now.getMonth() + 1, 2) + '-' +
    leadingZeros(now.getDate(), 2) + ' ' +

    leadingZeros(now.getHours(), 2) + ':' +
    leadingZeros(now.getMinutes(), 2) + ':' +
    leadingZeros(now.getSeconds(), 2);

  return s;
}
function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

app.get('/', function(req,res){
	res.sendFile(__dirname+'/index.html');
});

io.on('connection', function(socket){
	console.log('one user connected' + socket.id);

	socket.on('connect_room', function(data){

		console.log('name:'+ data);
		socket.join(data); // 자신의 아이디로 만든 방에 입장
		console.log(data + " 의 방으로 전송하는 메세지는 계속 받습니다.");

			socket.on ('joinroom', function(roomid) {
				socket.join(roomid);
				console.log(getWorldTime(+9));
				console.log("join the room = " + roomid);
			}); //joinroom fin.
			socket.on ('disconnect_room', function(roomid) {
				socket.leave(roomid);
				console.log("disconnect_room = " + roomid + "방에서 나갔습니다.");
			}); //disconnect_room fin.



			socket.on('message', function(data){
				var receiveid = data["staffid"];
					 console.log(data["userid"] + "소켓아이디는?"+receiveid);
				var sockets = io.sockets.sockets;
				socket.broadcast.to(receiveid).emit('message', { message:data["message"],
																					sendid:data["userid"],
																					sendname:data["username"],
																					checkroom:receiveid } );
				console.log(data);
			}); //message fin.
	});

		socket.on('disconnected', function() {
			socket.leave(socket.id);
			console.log('disconnected' + socket.id)
		});//disconnected fin.
});//io fin.
http.listen(3000, function(){
	console.log('server listening on port 3000');
});

// !!!!!!!!!!!!!!!!!
// function showConsole() {
//     cur_join_state.forEach(function (item) {
//         console.log('======================================');
//         console.log('|room_code:'+item.room_code+'\t|');
//         console.log('|cur_member_list'+'\t|');
//         item.cur_member_list.forEach(function (mem) {
//             console.log('|id     :'+mem.id+'\t|');
//             console.log('|type   :'+mem.type+'\t|');
//             console.log('|socket_id   :'+mem.socket_id+'\t|');
//         });
//         console.log('======================================');
//     });
// }
// //현재 접속 멤버 목록 삽입
// function put_cur_join_member(room_code,id,join_type,total_member_list,socket_id) {
//     var flag = true;
//     for(var i in cur_join_state){
//         if(cur_join_state[i].room_code == room_code){
//             var user_ex = true;
//             cur_join_state[i].cur_member_list = cur_join_state[i].cur_member_list.map(function (item) {
//                 if(item.id == id){
//                     item.type > 1 && join_type == 2 ? item.type = item.type : item.type += join_type;
//                     if(join_type == 2){
//                         item.socket_id = socket_id;
//                     }
//                     user_ex = false;
//                 }
//                 return item;
//             });
//
//             if(user_ex){
//                 var json = {id:id,type:join_type};
//                 join_type > 1 ? json.socket_id = socket_id : '';
//                 cur_join_state[i].cur_member_list.push(json);//현재 접속중인 멤버에서 나를 추가함
//             }
//             flag = false;
//             break;
//         }
//     }
//     //cur_join_state에 없는 방이면 새로 추가
//     if(flag){
//         var json = {id:id,type:join_type};
//         join_type > 1 ? json.socket_id = socket_id : '';
//         cur_join_state.push({
//             room_code: room_code,
//             cur_member_list:[json],
//             total_member : total_member_list
//         });
//     }
//     console.log('===============join====================');
//     showConsole();
// }
// //채팅방에 현재 접속 멤버 가져오기
// function get_cur_join_state(room_code) {
//     var cur_member_state = {};
//     var flag = true;
//     for(var i in cur_join_state){
//         if(cur_join_state[i].room_code == room_code){
//             cur_member_state.total_member = cur_join_state[i].total_member;
//             cur_member_state.cur_member_list = cur_join_state[i].cur_member_list.map(function (item) {
//                 return item.id;
//             });
//             flag = false;
//             return cur_member_state;
//         }
//     }
//     if(flag){
//         return {cur_member_list : []};
//     }
// }
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

// 서버 열기 시작
//
// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
//
// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });
//
// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });
//
//
// io.on('connection', function(socket){
//
// 	socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
//
// 	socket.broadcast.emit('hi');
// });
//
// io.emit('some event', { for: 'everyone' });
// 서버 열기 끝


// var express = require('express');
// var app = express();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// var fs = require('fs');
//
// app.listen(3000);
//
// app.get('/', function(req, res) {
// 	 res.sendFile('./index.html');
// });

// io.on('connection', function (socket) {
//   socket.on('my other event', function (data) {
//     console.log('connection');
//   });
// });
