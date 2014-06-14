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

function showActivity(activityToShow) {
	$(".activity").addClass( "hidden" );
	$("#" + activityToShow + "_activity").removeClass("hidden");
}

$(function($, undefined) {
	$(".show_activity").click(function(ev) {
		var currentTarget = $(ev.currentTarget)[0];
		var activityToShow = currentTarget.attributes["data-activity"].value;

		var transitionCondition = currentTarget.attributes["data-transition-condition"];
		if(!! transitionCondition) {
			transitionCondition = transitionCondition.value;
			if(window[transitionCondition](ev) === false) {
				return;
			}
		}

		console.info("toggle activity", activityToShow, "#" + activityToShow + "_activity");
		showActivity(activityToShow);
	});

	$(".mmenu-trigger").click(function(ev) {
		void(ev);

		$("#menu").trigger("open");
	});

	$("#menu").mmenu({});
});