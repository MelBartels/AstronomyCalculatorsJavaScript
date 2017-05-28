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
    debug: false,

    zoneCount: 10,
    //array of [zone, percent contact], eg, [[0, 1.0], [0.7, 0.7], [1.0, 0.5]]
    pitchContacts: [],
    arraySide: 101,
    strokeArray: undefined,

    rulerWidth: 2,
    rulerZones: 4,
    rulerMarks: 8,
    rulerHeight: 10,
    rulerStrokeStyle: 'orange',

    stars: function () {
        return $('[id=stars]');
    },
    stroke: function () {
        return $('[id=stroke]');
    },
    btnGravity: function () {
        return $('[name=btnGravity]');
    },
    gravity: function () {
        if (this.btnGravity()[0].checked) {
            return 'MOT';
        } else if (this.btnGravity()[1].checked) {
            return 'neutral';
        } else if (this.btnGravity()[2].checked) {
            return 'TOT';
        } else {
            return undefined;
        }
    },
    btnPreset: function () {
        return $('[name=btnPreset]');
    },
    preset: function () {
        if (this.btnPreset()[0].checked) {
            return 'fullContact';
        } else if (this.btnPreset()[1].checked) {
            return 'starLap';
        } else if (this.btnPreset()[2].checked) {
            return 'reverseStarLap';
        } else {
            return undefined;
        }
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
        zone = parseFloat($('[id=zone' + (ix + 1) + ']').val());
        contact = parseFloat($('[id=zoneContact' + (ix + 1) + ']').val());
        if (!isNaN(zone) && !isNaN(contact)) {
            pitchContacts.push([zone, contact]);
        }
    }
    common.pitchContacts = pitchContacts.sort();
};

MLB.pitchLapCalc.getPitchLapContactForZone = function (zone) {
    var common = MLB.pitchLapCalc.common,
        pitchContacts = common.pitchContacts,
        pitchContactsLength = pitchContacts.length,
        px,
        contact,
        zoneA,
        zoneB,
        contactA,
        contactB;

    // find pitchContacts[] element that fits zone
    for (px = 0; px < pitchContactsLength; px += 1) {
        if (pitchContacts[px][0] >= zone) {
            break;
        }
    }
    // interpolate for contact
    if (px === 0) {
        contact = pitchContacts[px][1];
    } else if (px === pitchContactsLength) {
        contact = 0;
    } else {
        zoneA = pitchContacts[px - 1][0];
        zoneB = pitchContacts[px][0];
        contactA = pitchContacts[px - 1][1];
        contactB = pitchContacts[px][1];
        contact = contactA + (contactB - contactA) * (zone - zoneA) / (zoneB - zoneA);
    }
    return contact;
};

MLB.pitchLapCalc.plotSubr = function () {
    var common = MLB.pitchLapCalc.common,
        getPitchLapContactForZone = MLB.pitchLapCalc.getPitchLapContactForZone,
        stars = +common.stars().val(),
        canvas = common.pitchLapCanvas(),
        context = canvas.getContext('2d'),
        imageData,
        toolRadius,
        starPointsAngleRad,
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
        contact,
        zoneAngleRad,
        zoneAngleMod,
        halfContactAngleRad,
        ix,
        uom = MLB.sharedLib.uom,
        point = MLB.sharedLib.point,
        setPixel = MLB.sharedLib.setPixel,
        drawCircle = MLB.sharedLib.drawCircle,
        validRev = MLB.coordLib.validRev;

    imageData = context.createImageData(canvas.width, canvas.height);

    toolRadius = 10;
    starPointsAngleRad = uom.oneRev / stars;

    minSide = canvas.width < canvas.height
        ? canvas.width
        : canvas.height;
    scalingFactor = minSide / toolRadius;

    center = point(canvas.width / 2, canvas.height / 2);
    toolRadiusScaled = toolRadius * scalingFactor / 2;

    // go pixel by pixel, asking if pixel falls on pitch lap
    for (x = 0; x < canvas.width; x += 1) {
        centerOffsetX = center.x - x;
        for (y = 0; y < canvas.height; y += 1) {
            centerOffsetY = center.y - y;
            zoneScaled = Math.sqrt(centerOffsetX * centerOffsetX + centerOffsetY * centerOffsetY);
            if (zoneScaled <= toolRadiusScaled) {
                zone = zoneScaled / toolRadiusScaled;
                contact = getPitchLapContactForZone(zone);
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

    // mark circular ruler
    for (ix = 1; ix < common.rulerZones; ix += 1) {
        drawCircle(context, center, toolRadiusScaled * ix / common.rulerZones, 2, common.rulerStrokeStyle);
    }
};


MLB.pitchLapCalc.displayStrokes = function () {
    var common = MLB.pitchLapCalc.common,
        strokeArray = common.strokeArray,
        canvas = common.strokeCanvas(),
        context = canvas.getContext('2d'),
        strokeStrokeStyle = 'blue',
        zoneWidth,
        topRightPoint,
        topLeftPoint,
        bottomRightPoint,
        bottomLeftPoint,
        widthScalingFactor,
        maxStroke,
        heightScalingFactor,
        ix,
        x,
        point = MLB.sharedLib.point,
        drawLine = MLB.sharedLib.drawLine;

    context.clearRect(0, 0, canvas.width, canvas.height);

    zoneWidth = canvas.width / (strokeArray.length * 2 - 1);

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
        drawLine(context, strokeStrokeStyle, zoneWidth, topRightPoint, bottomRightPoint);
        drawLine(context, strokeStrokeStyle, zoneWidth, topLeftPoint, bottomLeftPoint);
    });

    // mark a ruler
    drawLine(context, common.rulerStrokeStyle, zoneWidth, point(0, canvas.height), point(canvas.width, canvas.height));
    for (ix = 0; ix < common.rulerMarks; ix += 1) {
        x = canvas.width * (ix / common.rulerMarks);
        drawLine(context, common.rulerStrokeStyle, common.rulerWidth, point(x, canvas.height), point(x, canvas.height - common.rulerHeight));
    }
};

MLB.pitchLapCalc.buildStrokeArray = function () {
    var common = MLB.pitchLapCalc.common,
        getPitchLapContactForZone = MLB.pitchLapCalc.getPitchLapContactForZone,
        debug = common.debug,
        arraySide = common.arraySide,
        stroke = +common.stroke().val(),
        radius = arraySide / 2,
        scaledStroke = stroke * radius,
        uom = MLB.sharedLib.uom,
        strokeArray = new Int32Array(Math.floor(radius + 1)),
        s,
        z,
        accumContact,
        scaledAccumContact,
        gravityFactor,
        a,
        x,
        y,
        zone,
        contact;

    /*
    for each stroke increment from mirror center to end of stroke
        for each mirror zone from center to edge
            zero out pitch contact for mirror zone
            for each angle within a full circle
                get pitch contact from center of lap (offset per stroke above)
                add in pitch contact (no contact=0 otherwise contact = pitch lap contact) for that mirror zone
            end each
            add accumulated pitch contact to array for that zone
        end each
    end each
    */

    if (debug) {console.log('stroke = ' + stroke + '; radius = ' + radius);}
    // accuracy/resolution scaled to pixels
    for (s = 0; s < scaledStroke; s += 1) {
        if (debug) {console.log('starting new stroke position = ' + s + ' of ' + scaledStroke);}
        for (z = 0; z < radius; z += 1) {
            if (debug) {console.log('    starting new zone = ' + z + ' of ' + radius);}
            accumContact = 0;
            // 12 deg resolution
            for (a = 0; a < uom.oneRev; a += uom.oneRev / 30) {
                if (debug) {console.log('        starting new angle = ' + a / uom.degToRad);}
                // x, y distance from center of mirror's zone
                x = Math.sin(a) * z;
                y = Math.cos(a) * z;
                // lap's center is offset from mirror's center by 's', the stroke
                zone = Math.sqrt(x * x + (y - s) * (y - s)) / radius;
                if (debug) {console.log('            x, y relative to mirror center = ' + x + ', ' + y + '; lap zone = ' + zone);}
                if (zone <= 1.0) {
                    contact = getPitchLapContactForZone(zone);
                } else {
                    contact = 0;
                }
                accumContact += contact;
                if (debug) {console.log('            contact = ' + contact + ', accumContact = ' + accumContact);}
            }
            // adjust for gravity: MOT at extreme edge (s/radius=1) factor=1; MOT near center (s/radius=.05) factor=.22; opposite for TOT
            if (common.gravity() === 'MOT') {
                gravityFactor = Math.sqrt(s / radius);
            } else if (common.gravity() === 'TOT') {
                gravityFactor = Math.sqrt(1 - s / radius);
            } else { // 'neutral'
                gravityFactor = 1;
            }
            // since accumulating ints, give enough precision
            scaledAccumContact = accumContact * gravityFactor * 100;
            strokeArray[z] += scaledAccumContact;
            if (debug) {console.log('    added scaledAccumContact = ' + scaledAccumContact + ' to z = ' + z + '; strokeArray[z] now = ' + strokeArray[z]);}
        }
    }
    common.strokeArray = strokeArray;
    if (debug) {console.log(strokeArray.toString());}
};

MLB.pitchLapCalc.processInput = function () {
    MLB.pitchLapCalc.plot();
    MLB.pitchLapCalc.plotSubr();
    MLB.pitchLapCalc.buildStrokeArray();
    MLB.pitchLapCalc.displayStrokes();
};

MLB.pitchLapCalc.processPreset = function () {
    var common = MLB.pitchLapCalc.common;

    if (common.preset() === 'fullContact') {
        $('[id=zone1]').val('0.0');
        $('[id=zoneContact1]').val('1.0');
        $('[id=zone2]').val('0.2');
        $('[id=zoneContact2]').val('1.0');
        $('[id=zone3]').val('0.4');
        $('[id=zoneContact3]').val('1.0');
        $('[id=zone4]').val('0.6');
        $('[id=zoneContact4]').val('1.0');
        $('[id=zone5]').val('0.8');
        $('[id=zoneContact5]').val('1.0');
        $('[id=zone6]').val('1.0');
        $('[id=zoneContact6]').val('1.0');
        $('[id=zone7]').val('');
        $('[id=zone8]').val('');
        $('[id=zone9]').val('');
        $('[id=zone10]').val('');
    } else if (common.preset() === 'starLap') {
        $('[id=zone1]').val('0.0');
        $('[id=zoneContact1]').val('1.0');
        $('[id=zone2]').val('0.2');
        $('[id=zoneContact2]').val('1.0');
        $('[id=zone3]').val('0.4');
        $('[id=zoneContact3]').val('0.85');
        $('[id=zone4]').val('0.6');
        $('[id=zoneContact4]').val('0.7');
        $('[id=zone5]').val('0.8');
        $('[id=zoneContact5]').val('0.4');
        $('[id=zone6]').val('1.0');
        $('[id=zoneContact6]').val('0.0');
        $('[id=zone7]').val('');
        $('[id=zone8]').val('');
        $('[id=zone9]').val('');
        $('[id=zone10]').val('');
    } else if (common.preset() === 'reverseStarLap') {
        $('[id=zone1]').val('0.0');
        $('[id=zoneContact1]').val('0.25');
        $('[id=zone2]').val('0.2');
        $('[id=zoneContact2]').val('0.3');
        $('[id=zone3]').val('0.4');
        $('[id=zoneContact3]').val('0.4');
        $('[id=zone4]').val('0.6');
        $('[id=zoneContact4]').val('0.6');
        $('[id=zone5]').val('0.8');
        $('[id=zoneContact5]').val('0.77');
        $('[id=zone6]').val('1.0');
        $('[id=zoneContact6]').val('1.0');
        $('[id=zone7]').val('');
        $('[id=zone8]').val('');
        $('[id=zone9]').val('');
        $('[id=zone10]').val('');
    }
};

$(document).ready(function () {
    var common = MLB.pitchLapCalc.common,
        processInput = MLB.pitchLapCalc.processInput,
        processPreset = MLB.pitchLapCalc.processPreset,
        ix,
        htmlStr;

    for (ix = 1; ix <= common.zoneCount; ix += 1) {
        htmlStr = '<tr>\r\n'
                + '<td class="label">' + 'Zone</td>\r\n'
                + '<td> <input class="inputText" id="zone' + ix + '" onfocus="select();" type="number" step="0.1" min="0" max="1"> </td>\r\n'
                + '<td class="label"> contact </td>\r\n'
                + '<td> <input class="inputText" id="zoneContact' + ix + '" onfocus="select();" type="number" step="0.05" min="0" max="1"> </td>\r\n'
                + '</tr>';
        common.pitchLapParmTableBody().append(htmlStr);
    }

    // event hookups/subscribes
    common.btnUpdatePitchLap().click(processInput);
    common.stars().change(processInput);
    common.stroke().change(processInput);
    common.btnGravity().change(processInput);
    common.btnPreset().change(function () {
        processPreset();
        processInput();
    });
    for (ix = 1; ix <= common.zoneCount; ix += 1) {
        $('[id=zone' + ix + ']').change(processInput);
        $('[id=zoneContact' + ix + ']').change(processInput);
    }

    processPreset();
    processInput();
});

// end of file