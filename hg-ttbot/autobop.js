/**
 * Each time a song start, the bot vote up.
 */

var Bot = require('../index');
var fs = require('fs');
var ROOMID = '4f2c2060590ca265db00a6f6';

var bots = new Array();
var botDj = new Array();
var count = 1;
var botCount = 0;
var json;
fs.readFile('./bots', 'utf-8', function (err, data) {
                                   if (err) throw err;
                                   json = JSON.parse(data);
				   console.log("Setting Json Bots");
				   setUpBots();
			       });
function setUpBots() {
    for (var botId in json) {
	var bot = json[botId];
        if(bot.__name) {
	    var dj = new Bot(bot.auth, bot.id, ROOMID);
	    dj.name = bot.__name;
	    dj.roundCount = 0;
	    botDj.push(dj);
	    console.log("Setting up DJ: " + dj.name);
	} else {
	    bots.push(new Bot(bot.auth, bot.id, ROOMID));
	}
	botCount = botCount + 1;
    }
    console.log("Bots logged in");
    addDjs();
}

function addDjs() {
    botDj[0].on('ready', function (data) { 
		        for(var dj in botDj) {
     		            botDj[dj].addDj();
			}
		    } );
    setUpHeartbeat();
}

function setUpHeartbeat() {
    console.log("Heartbeat set");
    setInterval(function() {
	    //Bot Vote Up:
	    for(var i in bots) {
		    bots[i].vote("up");
	    }
	    //DJ Votes
	    for(var i in botDj) {
		    botDj[i].vote("up");
	    }
            var roomInfoData;
	    botDj[0].roomInfo(function (data) { 
	        var roomInfoData = data;
                //console.log("Vote Count: " + roomInfoData.room.metadata.votelog.length);
		//console.log("Round Count: " + count);
	        if(roomInfoData.room.metadata.votelog.length >= (botCount - 1) || count == 10) {
		    for(var dj in botDj) {
		        var djBot = botDj[dj];
    	                if(roomInfoData.room.metadata.current_dj == djBot.userId) {
			    djBot.roundCount = djBot.roundCount + roomInfoData.room.metadata.votelog.length;
		            djBot.skip();
			    console.log(djBot.name + " skipped at " + roomInfoData.room.metadata.votelog.length + ". Total: " + djBot.roundCount);
	                }
		    }
		    count = 0;
	        }
	    });
	    count = count + 1;
        }
        , 15000);
}
