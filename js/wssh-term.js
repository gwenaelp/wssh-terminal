/*
# Copyright (c) 2014 "Gwenael Pluchon" <info@gwenp.fr>
#
# This file is part of Wssh Terminal.
#
# Wssh Terminal is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Wssh Terminal is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Wssh Terminal.  If not, see <http://www.gnu.org/licenses/>.
*/

var term;
var client;

var skipNextDataLine = false;

function openTerminal(options) {
	client = new WSSHClient();
	client.connect($.extend(options, {
		onError: function(error) {
			term.echo('Error: ' + error + '\r\n');
		},
		onConnect: function() {
			// Erase our connecting message
			term.echo('\r');
		},
		onClose: function() {
			term.echo('Connection Reset By Peer');
		},
		onData: function(data) {
			if(skipNextDataLine){
				skipNextDataLine = false;
				var lines = data.split('\n');
				// remove one line, starting at the first position
				lines.splice(0,1);
				// join the array back into a single string
				data = lines.join('\n');
			}

			// data = data.replace('[K', '');

			console.log("onData", data);
			if(!!data && data !== "" && data !== " ")
				term.echo(data);
		}
	}));
}

function start_ssh_session(session) {
	console.log('start session', session);

	var options = {
		username: session.username,
		hostname: session.hostname,
		authentication_method: 'password',
		password:session.password,
		port:session.port,
		endpoint:session.endpoint //TODO make pull request to wssh with this option
	};

	openTerminal(options);
}

$(function($, undefined) {
	$('html').keyup(function(e){
		if(e.keyCode === 8) {
			skipNextDataLine = true;

			if(!!client)
				client.send($.terminal.encode('\b'));
		}
	});

	$('#term_activity').terminal(function(command, terminal) {
		void(terminal);
		void(command);

		term.insert($.terminal.encode('\n'));
	}, {
		greetings: '\n\n\n\n\nHello!\n\nPlease connect to a wsshd\nby touching the cog icon',
		prompt: '',
		history: false,
		keypress_command: undefined,
		onInit: function(terminal) {
			term = terminal;
		},
		keypress: function() {
			if(!!term)
				this.keypress_command = term.get_command();
		},
		tabcompletion: true,
		completion: function(terminal, command, callback) {
			void(terminal);
			void(command);
			void(callback);

			// if(client !== undefined) {
			// 	var c = term.get_command();
			// 	term.set_command("");

			// 	console.log("tab", term.get_command(), command);
			// 	client.send(c + "\t");
			// 	command = "";
			// 	term.set_command(c);
			// }
		},
		onCommandChange: function() {

			window.scrollTo(0,document.body.scrollHeight);

			if(!!term) {
				var newCharacters = term.get_command().replace(this.keypress_command, '');
				skipNextDataLine = true;

				if(!!client)
					client.send(newCharacters);
			}
		}
	});
});