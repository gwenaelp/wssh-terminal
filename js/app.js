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

var available_connections;

try{
	available_connections = JSON.parse(localStorage.getItem('config.available_connections'));
	console.log("available_connections", available_connections);
} catch(e) {
	console.log('Error getting configuration, cleaning everything :(');
}

function FormValidationException(message) {
   this.message = message;
}

var templates = {
	render_mmenu_sessions: function() {
		$('#available_connections').html(tmpl('mmenu_ssh_sessions_tmpl', {connections: available_connections}));
	}
};

function start_session(sessionId) {
	var currentSession = available_connections[sessionId];

	start_ssh_session(currentSession);
	$('#available_connections > li').removeClass('active');
	$('#available_connections > li[data-session=\'' + sessionId + '\']').addClass('active');

	$('#menu').trigger('close');
}


function delete_session(sessionId) {
	delete available_connections[sessionId];

	localStorage.setItem('config.available_connections', JSON.stringify(available_connections));

	templates.render_mmenu_sessions();
}

function extractConnectionFormData() {
	var new_connection = {};

	var connection_field_value = $('#field_connection').val();

	connection_field_value = connection_field_value.split('@');

	if(connection_field_value.length === 1) {
		new_connection.username = 'root';
		connection_field_value = connection_field_value[0];
	}
	else if (connection_field_value.length === 2) {
		new_connection.username = connection_field_value[0];
		connection_field_value = connection_field_value[1];
	} else {
		throw new FormValidationException('Invalid form');
	}

	connection_field_value = connection_field_value.split(':');

	if(connection_field_value.length === 1) {
		new_connection.port = '22';
		connection_field_value = connection_field_value[0];
	}
	else if (connection_field_value.length === 2) {
		new_connection.port = connection_field_value[1];
		connection_field_value = connection_field_value[0];
	} else {
		throw new FormValidationException('Invalid form');
	}

	new_connection.hostname = connection_field_value;

	new_connection.password = $('#field_password').val();
	new_connection.endpoint = $('#field_endpoint').val();

	return new_connection;
}

function resetAddConnectionForm() {
	$('#field_connection').val('');
	$('#field_password').val('');
	$('#field_endpoint').val('');

	//continue transition
	return true;
}


function saveAddConnectionForm(ev) {
	void(ev);

	try {
		var new_connection = extractConnectionFormData();

		console.log('new_connection', new_connection);

		if(! available_connections) {
			available_connections = {};
		}
		var key = $('#field_connection').val();

		available_connections[key] = new_connection;

		console.log(available_connections);
		localStorage.setItem('config.available_connections', JSON.stringify(available_connections));

		templates.render_mmenu_sessions();

		//continue transition
		return resetAddConnectionForm(); //TODO use finally? check MDN
	} catch (e) {
		if (e instanceof FormValidationException) {
			console.log('FormValidationException', e.message);

			return resetAddConnectionForm();
		}
		else
			throw e;
	}
}

$(function($, undefined) {
	templates.render_mmenu_sessions();
});