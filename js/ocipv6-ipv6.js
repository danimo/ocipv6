/**
 * @author Michal Hrusecky <michal@hrusecky.net>
 *
 * @copyright Copyright (c) 2015, Michal Hrusecky
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 */

function refresh_ipv6() {
    var baseUrl = OC.generateUrl('/apps/ocipv6');
    $('#ipv6-loading').show();
    $('#ipv6addresses').html('');
    $.ajax({
        url: baseUrl + '/ipv6',
        type: 'GET',
        contentType: 'application/json',
    }).done(function (response) {
        if(response.ipv6.length > 0) {
            var text = '<ul class="ip-address">\n';
            response.ipv6.forEach(function(callback, arg) {
                text += '<li><a href="'
                     + document.location.protocol
                     + '//[' + response.ipv6[arg] + ']'
                     + '/">' 
                     + response.ipv6[arg]
                     + '</a></li>' + '\n';
            });
            text+= '</ul>';
        } else {
            text = '<p>No IPv6 adressses found.</p>';
        }
        $('#ipv6-loading').hide();
        $('#ipv6addresses').html(text);
    });
}

function update_teredo(val) {
    $('#teredo-loading').show();
    var baseUrl = OC.generateUrl('/apps/ocipv6');
    $('#TeredoEnable').prop("disabled", true);
    if(val) {
        $.ajax({
            url: baseUrl + '/enable_teredo',
            type: 'POST',
            contentType: 'application/json',
        }).done(function (response) {
            $('#TeredoEnable').prop("checked", response.enabled);
            $('#TeredoEnable').prop("disabled", false);
            refresh_ipv6();
            $('#teredo-loading').hide();
        });
    } else {
        $.ajax({
            url: baseUrl + '/disable_teredo',
            type: 'POST',
            contentType: 'application/json',
        }).done(function (response) {
            $('#TeredoEnable').prop("checked", response.enabled);
            $('#TeredoEnable').prop("disabled", false);
            refresh_ipv6();
            $('#teredo-loading').hide();
        });
    }
}

function check_teredo() {
    var baseUrl = OC.generateUrl('/apps/ocipv6');
    $('#teredo-loading').show();
    $('#TeredoEnable').prop("disabled", true);
    $.ajax({
        url: baseUrl + '/teredo',
        type: 'GET',
        contentType: 'application/json',
    }).done(function (response) {
        $('#TeredoEnable').prop("checked", response.enabled);
        $('#TeredoEnable').prop("disabled", false);
        $('#teredo-loading').hide();
    });
}

$(document).ready(function() {
    refresh_ipv6();
    check_teredo();
    $('#TeredoEnable').on('change', function() {
        update_teredo($(this).prop("checked"));
    });
});
