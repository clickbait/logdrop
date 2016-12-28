var Discord = require('discord.io');
var fs = require('fs');

var self = new Discord.Client({
    token: process.env.DiscordToken,
    autorun: true
});

self.on('ready', function() {
    console.log(self.username + " - (" + self.id + ")");
});

self.on('message', function(user, userID, channelID, message, event) {
    if (message === "!this" && userID == self.id) {
    	console.log("Starting to dump log");

    	log_messages(self, channelID);
    }
});

function log_messages(self, channelID, before = null, log = "") {
	var filepath = 'logs/' + channelID + '.txt';

	self.getMessages({
		channelID: channelID,
		limit: 100,
		before: before
	}, function (err, messages) {
		if (err) { console.log(err); return; }

		before = messages.pop().id
		messages = messages.reverse()

		log = build_messages(self, messages) + log

		console.log("Count: " + messages.length);

		if (messages.length >= 99) {
			log_messages(self, channelID, before, log);
		} else {
			fs.writeFile(filepath, log);
			console.log("log saved to: " + filepath);
		}
	});
}

function build_messages(self, messages) {
	var log_part = "";

	for (var i=0; i < messages.length; i++) {
		console.log("logging: " + messages[i].id)
		log_part += messages[i].author.username + " : " + self.fixMessage(messages[i].content) + "\n";

    for (var j=0; j < messages[i].attachments.length; j++) {
      log_part += messages[i].attachments[j].url + "\n";
    }
	}

	return log_part;
}
