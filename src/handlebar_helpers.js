function formatOSMType(sType, bExcludeExternal)
{
    if (sType == 'N') return 'node';
    if (sType == 'W') return 'way';
    if (sType == 'R') return 'relation';

    if (!bExcludeExternal) return '';

    if (sType == 'T') return 'way';
    if (sType == 'I') return 'way';

    return '';
}

Handlebars.registerHelper({
    isaddresses_unused: function(aAddressLine) {
        return ((aAddressLine.isaddress && aAddressLine.isaddress == 'f') ? 'notused' : '');
    },
    // { osm_type: 'R', osm_id: 12345 }
    // <a href="//www.openstreetmap.org/relation/12345">relation 12345</a
    osmLink: function(aPlace) {
        if (!aPlace.osm_type) return '';
        var sOSMType = formatOSMType(aPlace.osm_type, false);
        if (!sOSMType) return '';

        return new Handlebars.SafeString(
            '<a href="//www.openstreetmap.org/' + sOSMType + '/' + aPlace.osm_id + '">' + sOSMType + ' ' + aPlace.osm_id + '</a>'
        );
    },
    /* en:London_Borough_of_Redbridge => https://en.wikipedia.org/wiki/London_Borough_of_Redbridge */
    wikipediaLink: function(aPlace) {
        if (! aPlace.wikipedia) return '';

        var parts = aPlace.wikipedia.split(':', 2);

        var sTitle = Handlebars.escapeExpression(aPlace.wikipedia),
            sLanguage = Handlebars.escapeExpression(parts[0]),
            sArticle = Handlebars.escapeExpression(parts[1]);

        return new Handlebars.SafeString(
            '<a href="https://' + sLanguage + '.wikipedia.org/wiki/' + sArticle + '" target="_blank">' + sTitle + '</a>'
        );
    },
    // { osm_type: 'R', osm_id: 12345 }
    // <a href="//www.openstreetmap.org/relation/12345">relation 12345</a
    detailsLink: function(aFeature, sTitle) {
        if (!aFeature) return '';
        if (!aFeature.place_id) return '';

        sTitle = 'details >';
        var sTitle = Handlebars.escapeExpression(sTitle);

        return new Handlebars.SafeString(
            '<a href="details.html?place_id=' + aFeature.place_id + '">' + (sTitle ? sTitle : aFeature.place_id ) + '</a>'
        );
    },
    coverageType: function(aPlace) {
        return (aPlace.isarea === 't' ? 'Polygon' : 'Point');
    },
    // fDistance is in meters
    formatDistance: function(fDistanceMeters) {
        if (fDistanceMeters < 1) return '0';

        var formatted = (fDistanceMeters >= 1000) ?
            Math.round(fDistanceMeters/1000, 1) + ' km' :
            Math.round(fDistanceMeters, 0) + ' m';

        return new Handlebars.SafeString(
            '<abbr class="distance" title="' + fDistanceMeters + '">~' + formatted + '</abbr>'
        );
    },
    // mark partial tokens (those starting with a space) with a star for readability
    formatKeywordToken: function(sToken) {
        return (sToken[0] == ' ' ? '*' : '') + Handlebars.escapeExpression(sToken);
    },
    // Any over 15 are invalid data in OSM anyway
    formatAdminLevel: function(iLevel) {
        return (iLevel < 15 ? iLevel : '');
    },
    formatMapIcon: function(sIcon) {
        if (!sIcon) return;
        
        var url = sIcon.match(/png$/) ? Nominatim_Config.Images_Base_Url + '/' + sIcon : Nominatim_Config.Images_Base_Url + 'nominatim/images/mapicons/' + sIcon + '.n.32.png';

        return new Handlebars.SafeString(
            '<img class="mapicon" src="' + url + '" alt="' + sIcon + '"/>'
        );
    },
    formatLabel: function(aPlace) {
        if (aPlace.label) return aPlace.label;

        function capitalize(s)
        {
            return s && s[0].toUpperCase() + s.slice(1);
        }

        if (aPlace.type && aPlace.type === 'yes') {
            return capitalize(aPlace.class.replace(/_/g, ' '));
        } else {
            return capitalize(aPlace.type.replace(/_/g, ' '));
        }
    },
    zoomLevels: function(iSelectedZoom) {
        var aZoomLevels = [
            /*  0 */ 'Continent / Sea',
            /*  1 */ '',
            /*  2 */ '',
            /*  3 */ 'Country',
            /*  4 */ '',
            /*  5 */ 'State',
            /*  6 */ 'Region',
            /*  7 */ '',
            /*  8 */ 'County',
            /*  9 */ '',
            /* 10 */ 'City',
            /* 11 */ '',
            /* 12 */ 'Town / Village',
            /* 13 */ '',
            /* 14 */ 'Suburb',
            /* 15 */ '',
            /* 16 */ 'Street',
            /* 17 */ '',
            /* 18 */ 'Building',
            /* 19 */ '',
            /* 20 */ '',
            /* 21 */ ''
        ];

        var select = $('<select>');
        var option = jQuery('<option>', { value: '', text: '--'});
        if (typeof(iSelectedZoom) === 'undefined') option.attr('selected', 'selected');
        option.appendTo(select);

        jQuery.each(aZoomLevels, function(i, title) {
            var option = jQuery('<option>', { value: i, text: i + ' ' + title });
            if (i == iSelectedZoom) option.attr('selected', 'selected');
            option.appendTo(select);
        });
        return new Handlebars.SafeString(select.html());
    }
});
