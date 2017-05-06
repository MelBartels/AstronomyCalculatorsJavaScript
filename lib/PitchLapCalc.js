/*global
    MLB,$,window
*/
/*jslint
    this, for
*/

// copyright Mel Bartels, 2017

'use strict';

MLB.pitchLapCalc = {};

MLB.pitchLapCalc.common = {
    zoneCount: 6,
    //array of [zone, percent contact], eg, [[0, 1.0], [0.7, 0.7], [1.0, 0.5]]
    pitchContacts: [],
    arraySide: 51,
    strokeArray: undefined,

    stars: function () {
        return $('[id=stars]');
    },
    stroke: function () {
        return $('[id=stroke]');
    },
    pitchLapParmTableBody: function () {
        return $('#pitchLapParmTableBody');
    },
    btnUpdatePitchLap: function () {
        return $('input[id=btnUpdatePitchLap]');
    },
    pitchLapCanvas: function () {
        return $('#pitchLapCanvas')[0];
    },
    strokeCanvas: function () {
        return $('#strokeCanvas')[0];
    }
};

MLB.pitchLapCalc.plot = function () {
    var common = MLB.pitchLapCalc.common,
        zoneCount = common.zoneCount,
        pitchContacts = [],
        ix,
        zone,
        contact;

    for (ix = 0; ix < zoneCount; ix += 1) {
        zone = parseFloat($('[id=zoneRadius' + (ix + 1) + ']').val());
        contact = parseFloat($('[id=zoneContact' + (ix + 1) + ']').val());
        if (!isNaN(zone) && !isNaN(contact)) {
            pitchContacts.push([zone, contact]);
        }
    }
    common.pitchContacts = pitchContacts;
    MLB.pitchLapCalc.plotSubr();
};

MLB.pitchLapCalc.plotSubr = function () {
    var common = MLB.pitchLapCalc.common,
        stars = +common.stars().val(),
        canvas = common.pitchLapCanvas(),
        context = canvas.getContext('2d'),
        imageData,
        borderFactor,
        toolRadius,
        starPointsAngleRad,
        pitchContacts = common.pitchContacts,
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
        zoneRadius,
        px,
        contact,
        zoneA,
        zoneB,
        contactA,
        contactB,
        zoneAngleRad,
        zoneAngleMod,
        halfContactAngleRad,
        uom = MLB.sharedLib.uom,
        point = MLB.sharedLib.point,
        setPixel = MLB.sharedLib.setPixel,
        validRev = MLB.coordLib.validRev;

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
    for (x = 0; x < canvas.width; x += 1) {
        centerOffsetX = center.x - x;
        for (y = 0; y < canvas.height; y += 1) {
            centerOffsetY = center.y - y;
            zoneScaled = Math.sqrt(centerOffsetX * centerOffsetX + centerOffsetY * centerOffsetY);
            if (zoneScaled <= toolRadiusScaled) {
                zoneRadius = zoneScaled / toolRadiusScaled / 2;
                // find pitchContacts[] element that fits zoneRadius
                for (px = 0; px < pitchContactsLength; px += 1) {
                    if (pitchContacts[px][0] >= zoneRadius) {
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
                    contact = contactA + (contactB - contactA) * (zoneRadius - zoneA) / (zoneB - zoneA);
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


MLB.pitchLapCalc.displayStrokes = function () {
    var common = MLB.pitchLapCalc.common,
        strokeArray = common.strokeArray,
        canvas = common.strokeCanvas(),
        context = canvas.getContext('2d'),
        strokeStyle = 'black',
        width,
        topRightPoint,
        topLeftPoint,
        bottomRightPoint,
        bottomLeftPoint,
        widthScalingFactor,
        maxStroke,
        heightScalingFactor,
        point = MLB.sharedLib.point,
        drawLine = MLB.sharedLib.drawLine;

    context.clearRect(0, 0, canvas.width, canvas.height);

    width = canvas.width / (strokeArray.length * 2 - 1) * 0.9;

    widthScalingFactor = canvas.width / (strokeArray.length * 2 - 1);
    maxStroke = 0;
    strokeArray.forEach(function (s, i) {
        if (s > maxStroke) {
            maxStroke = s;
        }
    });
    heightScalingFactor = canvas.height / maxStroke;

    strokeArray.forEach(function (s, i) {
        topRightPoint = new point(canvas.width / 2 + i * widthScalingFactor, canvas.height - s * heightScalingFactor);
        topLeftPoint = new point(canvas.width / 2 - i * widthScalingFactor, topRightPoint.y);
        bottomRightPoint = new point(topRightPoint.x, canvas.height);
        bottomLeftPoint = new point(topLeftPoint.x, bottomRightPoint.y);
        drawLine(context, strokeStyle, width, topRightPoint, bottomRightPoint);
        drawLine(context, strokeStyle, width, topLeftPoint, bottomLeftPoint);
    });
};

MLB.pitchLapCalc.buildStrokeArray = function () {
    var common = MLB.pitchLapCalc.common,
        arraySide = common.arraySide,
        pitchContacts = common.pitchContacts,
        pitchContactsLength = pitchContacts.length,
        stroke = +common.stroke().val(),
        scaledStroke = stroke * arraySide,
        radius = arraySide / 2,
        strokeArray = new Int16Array(radius),
        x,
        y,
        zoneRadius,
        px,
        contact,
        zoneA,
        zoneB,
        contactA,
        contactB,
        scaledContact,
        displayStrokes = MLB.pitchLapCalc.displayStrokes;

    // entered stroke is entire length of stroke, so stroke length from starting center over center is half
    for (x = 0; x < scaledStroke / 2; x += 1) {
        // lap center is at x; for each y, distance from s, or the zone, is abs(y-x)
        for (y = 0; y < radius; y += 1) {
            zoneRadius = Math.abs(y - x) / radius / 2;
            // find pitchContacts[] element that fits zoneRadius
            for (px = 0; px < pitchContactsLength; px += 1) {
                if (pitchContacts[px][0] >= zoneRadius) {
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
                contact = contactA + (contactB - contactA) * (zoneRadius - zoneA) / (zoneB - zoneA);
            }
            scaledContact = contact * 100;
            // adjust for area of circle, eg, mirror center at edge of tool results in 1/3 of the circle's perimeter covered (interpolation is linear to a couple of percent)
            scaledContact *= (1 - zoneRadius) * 2 / 3;
            strokeArray[y] += scaledContact;
        }
    }
    common.strokeArray = strokeArray;
    /*
    strokeArray.forEach(function (s, i) {
        console.log('i: ' + i + ', s: ' + s);
    });
    */
    displayStrokes();
};
$(document).ready(function () {
    var common = MLB.pitchLapCalc.common,
        plot = MLB.pitchLapCalc.plot,
        buildStrokeArray = MLB.pitchLapCalc.buildStrokeArray,
        ix,
        htmlStr;

    // event hookups/subscribes
    common.btnUpdatePitchLap().click(function () {
        plot();
        buildStrokeArray();
    });

    /* build out zone rows, eg:
        "<tr>
        <td class="label">Zone 1: radius</td>
        <td> <input class="inputText" id="zoneRadius1" onfocus="select();" type="text"> </td>
        <td class="label"> contact </td>
        <td> <input class="inputText" id="zoneContact1" onfocus="select();" type="text"> </td>
        </tr>"
        ...
    */
    for (ix = 1; ix <= common.zoneCount; ix += 1) {
        htmlStr = '<tr>\r\n'
                + '<td class="label">' + 'Zone ' + ix + ': radius</td>\r\n'
                + '<td> <input class="inputText" id="zoneRadius' + ix + '" onfocus="select();" type="text"> </td>\r\n'
                + '<td class="label"> contact </td>\r\n'
                + '<td> <input class="inputText" id="zoneContact' + ix + '" onfocus="select();" type="text"> </td>\r\n'
                + '</tr>';
        common.pitchLapParmTableBody().append(htmlStr);
    }
    // and add some starting values
    $('[id=zoneRadius1]').val('0.0');
    $('[id=zoneContact1]').val('1.0');
    $('[id=zoneRadius2]').val('0.1');
    $('[id=zoneContact2]').val('1.0');
    $('[id=zoneRadius3]').val('0.2');
    $('[id=zoneContact3]').val('0.85');
    $('[id=zoneRadius4]').val('0.3');
    $('[id=zoneContact4]').val('0.7');
    $('[id=zoneRadius5]').val('0.4');
    $('[id=zoneContact5]').val('0.4');
    $('[id=zoneRadius6]').val('0.5');
    $('[id=zoneContact6]').val('0.0');

    plot();
    buildStrokeArray();
});

// end of file