/*
 * HG Dev Room Bot
 */
var Bot = require('../index');

var botAuth = 'auth+live+1b427d1a72da7413a97f3240869d0cb236dacb2b';
var botId = '4f29a0eb590ca265db007f85';
//var ROOMID = '4f29966c590ca265db007e77'; ALLyourbase
var ROOMID = '4ed59c3e14169c686e41eb9a'; // Alt Nation;
var commands = new Array();
var roomDjs = new Array();

var hgBot = new Bot(botAuth, botId, ROOMID);

function do_hello(argument) {
	hgBot.speak('Hello you said ' + argument);
}

function do_commands(argument) {
	for(var command in commands) {
		hgBot.speak(commands[command].cmd + " " + commands[command].desc);
	}
}

function do_count (argument) {
	var cmdList;
	for(var id in roomDjs) {
		hgBot.speak(roomDjs[id]['name'] + ": " + roomDjs[id]['count']);
	}
}

commands = [
    { cmd: "/hello", func: do_hello, acl: ["all"], desc: "Says Hello" },
    { cmd: "/commands", func: do_commands, acl: ["all"], desc: "Shows Commands" },
    { cmd: "/count", func: do_count, acl: ["all"], desc: "Shows how many songs DJ's have played." }
];

function checkAcl(name, list) {
	var patt = "^"+name+"$";
	var re = new RegExp(patt, "g");
	for(var i = 0; i < list.length; i++) {
		if(list[i].match(/all/)) {
			return true;
		}
		else if(list[i].match(re)) {
			return true;
		}
	}
	return false;
}

hgBot.on('speak', function (data) {
		if(data.name == "Madison Koenig") {
			return;
		}
		var command = data.text.split(/\s/);
		var argument = data.text.split(/\s/);
		argument[0] = "";
		argument = argument.join(' ');
/*
		if(commands[command[0]]) {
		    if(checkAcl(data.name, commands[command[0]]['acl'])) {
    		        commands[command[0]]['func'](argument);
		    } else {
		        hgBot.speak("You don't have permission to run this command.");
		    }
		}
*/
		for(var i = 0; i < commands.length; i++) {
			if(command[0] == commands[i].cmd) {
				if(checkAcl(data.name, commands[i].acl)) {
					commands[i].func(argument);
				} else {
					hgBot.speak("You don't have permission to run this command.");
				}
			}
		}
	});

hgBot.on('newsong', function (data) {
		hgBot.vote('up');
		roomDjs[data.room.metadata.current_dj]['count']++;
	});

hgBot.on('add_dj', function (data) {
		roomDjs[data.user[0].userid] = new Array();
		roomDjs[data.user[0].userid]['name'] = data.user[0].name;
		roomDjs[data.user[0].userid]['count'] = 0;
	});

hgBot.on('rem_dj', function(data) {
		delete roomDjs[data.user[0].userid];
	});
