// copyright Mel Bartels, 2017

'use strict';

MLB.pitchLapCalc = {};

MLB.pitchLapCalc.common = {
    zoneCount: function () {
        return $('[name^=zoneRadius]').length;
    },
    stars: function () {
        return $('[name=stars]');
    },
    pitchLapCanvas: function () {
        return $('#pitchLapCanvas')[0];
    },
    btnUpdatePitchLap: function () {
        return $('input[id=btnUpdatePitchLap]');
    }
};

MLB.pitchLapCalc.plot = function () {
    var common = MLB.pitchLapCalc.common,
        stars = +common.stars().val(),
        canvas = common.pitchLapCanvas(),
        //array of [zone, percent contact], eg, [[0, 1.0], [0.7, 0.7], [1.0, 0.5]]
        pitchContacts = [],
        ix,
        zoneCount = common.zoneCount(),
        zone,
        contact;

    for (ix = 0; ix < zoneCount; ix++) {
        zone = parseFloat($('[name=zoneRadius' + (ix + 1) + ']').val());
        contact = parseFloat($('[name=zoneContact' + (ix + 1) + ']').val());
        if (!isNaN(zone) && !isNaN(contact)) {
            pitchContacts.push([zone, contact]);
        }
    }
    MLB.pitchLapCalc.plotSubr(stars, pitchContacts, canvas);
};

MLB.pitchLapCalc.plotSubr = function (stars, pitchContacts, canvas) {
    var context,
        imageData,
        borderFactor,
        toolRadius,
        starPointsAngleRad,
        pitchContacts,
        pitchContactsLength,
        scalingFactor,
        minSide,
        center,
        toolRadiusScaled,
        x,
        y,
        centerOffsetX,
        centerOffsetY,
        zoneScaled,
        zone,
        px,
        contact,
        halfContactAngleRad,
        zoneA,
        zoneB,
        contactA,
        contactB,
        zoneAngleRad,
        zoneAngleMod,
        uom = MLB.sharedLib.uom,
        point = MLB.sharedLib.point,
        setPixel = MLB.sharedLib.setPixel,
        validRev = MLB.coordLib.validRev;

    context = canvas.getContext('2d');
    imageData = context.createImageData(canvas.width, canvas.height);

    borderFactor = 0.1;
    toolRadius = 10;
    starPointsAngleRad = uom.oneRev / stars;
    pitchContactsLength = pitchContacts.length;

    minSide = canvas.width < canvas.height
        ? canvas.width
        : canvas.height;
    scalingFactor = minSide / toolRadius * (1 - borderFactor);

    center = point(canvas.width / 2, canvas.height / 2);
    toolRadiusScaled = toolRadius * scalingFactor / 2;

    // go pixel by pixel, asking if pixel falls on pitch lap
    for (x = 0; x < canvas.width; x++) {
        centerOffsetX = center.x - x;
        for (y = 0; y < canvas.height; y++) {
            centerOffsetY = center.y - y;
            zoneScaled = Math.sqrt(centerOffsetX * centerOffsetX + centerOffsetY * centerOffsetY);
            if (zoneScaled <= toolRadiusScaled) {
                zone = zoneScaled / toolRadiusScaled;
                // find pitchContacts[] element that fits zone
                for (px = 0; px < pitchContactsLength; px++) {
                    if (pitchContacts[px][0] >= zone) {
                        break;
                    }
                }
                // interpolate for contact
                if (px === 0) {
                    contact = pitchContacts[px][1];
                } else {
                    zoneA = pitchContacts[px - 1][0];
                    zoneB = pitchContacts[px][0];
                    contactA = pitchContacts[px - 1][1];
                    contactB = pitchContacts[px][1];
                    contact = contactA + (contactB - contactA) * (zone - zoneA) / (zoneB - zoneA);
                }
                // counterclockwise from +x axis
                zoneAngleRad = validRev(Math.atan2(centerOffsetY, centerOffsetX));
                zoneAngleMod = zoneAngleRad % starPointsAngleRad;
                halfContactAngleRad = contact * starPointsAngleRad / 2;
                if (zoneAngleMod <= halfContactAngleRad || zoneAngleMod >= starPointsAngleRad - halfContactAngleRad) {
                    setPixel(imageData, x, y, 0, 0, 0, 255); // black = pitch lap
                } else {
                    setPixel(imageData, x, y, 255, 255, 0, 255); // yellow = no contact
                }
            } else {
                setPixel(imageData, x, y, 255, 255, 255, 255); // white = outside tool radius
            }
        }
    }

    // copy the image data back onto the canvas
    context.putImageData(imageData, 0, 0);
};

$(document).ready(function () {
    var common = MLB.pitchLapCalc.common,
        plot = MLB.pitchLapCalc.plot;

    // event hookups/subscribes
    common.btnUpdatePitchLap().click(function () {
        plot();
    });

    plot();
});

// end of file