/*global
    MLB,$,window
*/
/*jslint
    this, for
*/

// copyright Mel Bartels, 2017-2021

'use strict';

MLB.pitchLapCalc = {};

MLB.pitchLapCalc.common = {
    zoneIdLit: '[id=zone',
    zoneContactIdLit: '[id=zoneContact',
    fullContactLit: 'fullContact',
    petalLapLit: 'petalLap',
    reversePetalLapLit: 'reversePetalLap',

    zoneCount: 10,
    //array of [zone, percent contact], eg, [[0, 1.0], [0.7, 0.7], [1.0, 0.5]]
    pitchContacts: [],
    // array of polish actions for each mirror radius: size is (arraySide / 2 + 1)
    polishActions: undefined,

    rulerWidth: 2,
    rulerZones: 4,
    rulerMarks: 8,
    rulerHeight: 10,
    rulerStrokeStyle: 'orange',

    mirrorXYSize: 100,
    mirrorNodes: undefined,
    toolNodes: undefined,
    mirrorNodeCountPerRadius: undefined,
    polishingActionPerRadius: undefined,
    polishingActionPerRadiusWeighted: undefined,

    stars: function () {
        return $('[id=stars]');
    },
    toolToMirrorSizeRatio: function () {
        return $('[id=toolToMirrorSizeRatio]');
    },
    strokeLength: function () {
        return $('[id=strokeLength]');
    },
    strokeOffset: function () {
        return $('[id=strokeOffset]');
    },
    btnPreset: function () {
        return $('[name=btnPreset]');
    },
    preset: function () {
        return $('[name=btnPreset]:checked').val();
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
    polishingActionCanvas: function () {
        return $('#polishingActionCanvas')[0];
    }
};

MLB.pitchLapCalc.buildZoneAndContactTableBasedOnPreset = function () {
    var common = MLB.pitchLapCalc.common;

    if (common.preset() === common.fullContactLit) {
        $(common.zoneIdLit + '1]').val('0.0');
        $(common.zoneContactIdLit + '1]').val('1.0');
        $(common.zoneIdLit + '2]').val('0.2');
        $(common.zoneContactIdLit + '2]').val('1.0');
        $(common.zoneIdLit + '3]').val('0.4');
        $(common.zoneContactIdLit + '3]').val('1.0');
        $(common.zoneIdLit + '4]').val('0.6');
        $(common.zoneContactIdLit + '4]').val('1.0');
        $(common.zoneIdLit + '5]').val('0.8');
        $(common.zoneContactIdLit + '5]').val('1.0');
        $(common.zoneIdLit + '6]').val('1.0');
        $(common.zoneContactIdLit + '6]').val('1.0');
        $(common.zoneIdLit + '7]').val('');
        $(common.zoneIdLit + '8]').val('');
        $(common.zoneIdLit + '9]').val('');
        $(common.zoneIdLit + '10]').val('');
    } else if (common.preset() === common.petalLapLit) {
        $(common.zoneIdLit + '1]').val('0.0');
        $(common.zoneContactIdLit + '1]').val('1.0');
        $(common.zoneIdLit + '2]').val('0.2');
        $(common.zoneContactIdLit + '2]').val('1.0');
        $(common.zoneIdLit + '3]').val('0.4');
        $(common.zoneContactIdLit + '3]').val('0.85');
        $(common.zoneIdLit + '4]').val('0.6');
        $(common.zoneContactIdLit + '4]').val('0.7');
        $(common.zoneIdLit + '5]').val('0.8');
        $(common.zoneContactIdLit + '5]').val('0.4');
        $(common.zoneIdLit + '6]').val('1.0');
        $(common.zoneContactIdLit + '6]').val('0.0');
        $(common.zoneIdLit + '7]').val('');
        $(common.zoneIdLit + '8]').val('');
        $(common.zoneIdLit + '9]').val('');
        $(common.zoneIdLit + '10]').val('');
    } else if (common.preset() === common.reversePetalLapLit) {
        $(common.zoneIdLit + '1]').val('0.0');
        $(common.zoneContactIdLit + '1]').val('0.25');
        $(common.zoneIdLit + '2]').val('0.2');
        $(common.zoneContactIdLit + '2]').val('0.3');
        $(common.zoneIdLit + '3]').val('0.4');
        $(common.zoneContactIdLit + '3]').val('0.4');
        $(common.zoneIdLit + '4]').val('0.6');
        $(common.zoneContactIdLit + '4]').val('0.6');
        $(common.zoneIdLit + '5]').val('0.8');
        $(common.zoneContactIdLit + '5]').val('0.77');
        $(common.zoneIdLit + '6]').val('1.0');
        $(common.zoneContactIdLit + '6]').val('1.0');
        $(common.zoneIdLit + '7]').val('');
        $(common.zoneIdLit + '8]').val('');
        $(common.zoneIdLit + '9]').val('');
        $(common.zoneIdLit + '10]').val('');
    }
};

MLB.pitchLapCalc.createNode = function (x, y, radius, contact) {
    return {
        x: x,
        y: y,
        radius: radius,
        contact: contact
    };
};

MLB.pitchLapCalc.createXNode = function (x) {
    return {
        x: x,
        yNodes: []
    };
};

MLB.pitchLapCalc.createNodes = function (xySize, contact) {
    var halfXYSize = xySize / 2,
        x,
        y,
        radius,
        nodes = [],
        xNode,
        createNode = MLB.pitchLapCalc.createNode,
        createXNode = MLB.pitchLapCalc.createXNode;

    for (x = -halfXYSize; x <= halfXYSize; x += 1) {
        xNode = createXNode(x);
        for (y = -halfXYSize; y <= halfXYSize; y += 1) {
            radius = Math.sqrt(x * x + y * y);
            if (radius <= halfXYSize) {
                xNode.yNodes.push(createNode(x, y, radius, contact));
            }
        }
        nodes.push(xNode);
    }
    return nodes;
};

MLB.pitchLapCalc.createToolNodes = function () {
    var common = MLB.pitchLapCalc.common,
        xySize = common.mirrorXYSize * common.toolToMirrorSizeRatio().val(),
        halfXYSize = xySize / 2,
        toolNodes,
        contact,
        createNodes = MLB.pitchLapCalc.createNodes,
        getPitchLapContactForZone = MLB.pitchLapCalc.getPitchLapContactForZone;

    toolNodes = createNodes(xySize, contact);

    // build out the pit lap contact for each tool node
    // x nodes first then y nodes for each x node; both x & y ranging from -xySize/2 to + xySize/2
    toolNodes.forEach(function (toolNode) {
        toolNode.yNodes.forEach(function (yNode) {
            yNode.contact = getPitchLapContactForZone(yNode.radius / halfXYSize);
        });
    });

    common.toolNodes = toolNodes;
};

MLB.pitchLapCalc.createMirrorNodes = function () {
    var common = MLB.pitchLapCalc.common,
        xySize = common.mirrorXYSize,
        mirrorNodes,
        contact = 1,
        mirrorNodeCountPerRadius = [],
        radius,
        createNodes = MLB.pitchLapCalc.createNodes;

    mirrorNodes = createNodes(xySize, contact);

    // get the node count for each radius so as to assess polishing action for each zonal radius
    // x nodes first then y nodes for each x node; both x & y ranging from -xySize/2 to + xySize/2
    mirrorNodes.forEach(function (mirrorNode) {
        mirrorNode.yNodes.forEach(function (yNode) {
            radius = Math.floor(yNode.radius + 0.5);
            if (mirrorNodeCountPerRadius[radius] === undefined) {
                mirrorNodeCountPerRadius[radius] = 0;
            }
            mirrorNodeCountPerRadius[radius] += 1;
        });
    });

    common.mirrorNodes = mirrorNodes;
    common.mirrorNodeCountPerRadius = mirrorNodeCountPerRadius;
};

// for stroke, offset in one direction (not counting the return stroke length), eg, 10 inch mirror with 0.2 stroke means 0.1 stroke delta up (then 0.2 stroke return, then 0.1 delta back up to return to the starting position, however, since these actions are mirror images of each other, only the stroke delta up need be used
MLB.pitchLapCalc.getStrokeLengthAndOffsetInXY = function () {
    var common = MLB.pitchLapCalc.common;

    return {
        xOffset: common.mirrorXYSize * common.strokeOffset().val() / 2,
        yStroke: common.mirrorXYSize * common.strokeLength().val() / 2,
    };
};


MLB.pitchLapCalc.calcPolishingAction = function () {
    var common = MLB.pitchLapCalc.common,
        yTraverse,
        getStrokeLengthAndOffsetInXY = MLB.pitchLapCalc.getStrokeLengthAndOffsetInXY,
        strokeAndOffsetInXY = getStrokeLengthAndOffsetInXY(),
        mirrorNodes = common.mirrorNodes,
        xTool,
        yTool,
        toolNodes = common.toolNodes,
        toolNodesLength = common.toolNodes.length,
        xToolNodes,
        yToolNodes,
        toolNode,
        yNodesTool,
        yNodesToolLength,
        yNodeTool,
        radius,
        polishingActionPerRadius = [],
        mirrorNodeCountPerRadius = common.mirrorNodeCountPerRadius,
        polishingActionPerRadiusWeighted = [];

    // traverse stroke at offset...
    for (yTraverse = 0; yTraverse <= strokeAndOffsetInXY.yStroke; yTraverse += 1) {

        // each mirror node...
        mirrorNodes.forEach(function (mirrorNode) {
            mirrorNode.yNodes.forEach(function (yNodeMirror) {

                // get pitch lap contact from a toolNode...

                // xTool, yTool is tool's xy for that mirror node's xy; eg, if mirror x,y is 5,7 and offset is 0 and stroke is now 2, then tool x,y is 5+0,7+2 or 5,9
                xTool = yNodeMirror.x + strokeAndOffsetInXY.xOffset;
                yTool = yNodeMirror.y + yTraverse;

                // get tool node if possible: start with the x axis represented by the toolNodes array
                if (xTool >= toolNodes[0].x && xTool <= toolNodes[toolNodesLength - 1].x) {

                    xToolNodes = Math.floor(xTool - toolNodes[0].x);
                    toolNode = toolNodes[xToolNodes];
                    yNodesTool = toolNode.yNodes;
                    yNodesToolLength = yNodesTool.length;

                    // now try to find the tool node for the y axis represented by toolNode.yNodes (yNodesTool); full path to a particular tool node is toolNodes[].yNodes[]
                    if (yTool >= yNodesTool[0].y && yTool <= yNodesTool[yNodesToolLength - 1].y) {

                        yToolNodes = Math.floor(yTool - yNodesTool[0].y);
                        yNodeTool = yNodesTool[yToolNodes];

                        // add contact to polishing action array
                        radius = Math.floor(yNodeMirror.radius + 0.5);
                        if (polishingActionPerRadius[radius] === undefined) {
                            polishingActionPerRadius[radius] = 0;
                        }
                        polishingActionPerRadius[radius] += yNodeTool.contact;
                    }
                }
            });
        });
    }

    // calc weighted values
    polishingActionPerRadius.forEach(function (action, ix) {
        polishingActionPerRadiusWeighted[ix] = action / mirrorNodeCountPerRadius[ix];
    });

    // save state
    common.polishingActionPerRadius = polishingActionPerRadius;
    common.polishingActionPerRadiusWeighted = polishingActionPerRadiusWeighted;
};

MLB.pitchLapCalc.buildPitchContactsArray = function () {
    var common = MLB.pitchLapCalc.common,
        zoneCount = common.zoneCount,
        pitchContacts = [],
        ix,
        zone,
        contact;

    for (ix = 0; ix < zoneCount; ix += 1) {
        zone = parseFloat($(common.zoneIdLit + (ix + 1) + ']').val());
        contact = parseFloat($(common.zoneContactIdLit + (ix + 1) + ']').val());
        if (!isNaN(zone) && !isNaN(contact)) {
            pitchContacts.push([zone, contact]);
        }
    }
    common.pitchContacts = pitchContacts.sort();
};

// zone can range from 0 to 1: comes from user defined pitch lap contact zone
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

MLB.pitchLapCalc.drawPitchLap = function () {
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

MLB.pitchLapCalc.displayPolishingActions = function () {
    var common = MLB.pitchLapCalc.common,
        polishActions = common.polishingActionPerRadiusWeighted,
        xySize = common.mirrorXYSize,
        canvas = common.polishingActionCanvas(),
        context = canvas.getContext('2d'),
        strokeStrokeStyle = 'blue',
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

    widthScalingFactor = canvas.width / xySize;
    maxStroke = 0;
    polishActions.forEach(function (s, i) {
        if (s > maxStroke) {
            maxStroke = s;
        }
    });
    heightScalingFactor = canvas.height / maxStroke;

    polishActions.forEach(function (s, i) {
        topRightPoint = new point(canvas.width / 2 + i * widthScalingFactor, canvas.height - s * heightScalingFactor);
        topLeftPoint = new point(canvas.width / 2 - i * widthScalingFactor, topRightPoint.y);
        bottomRightPoint = new point(topRightPoint.x, canvas.height);
        bottomLeftPoint = new point(topLeftPoint.x, bottomRightPoint.y);
        drawLine(context, strokeStrokeStyle, widthScalingFactor, topRightPoint, bottomRightPoint);
        drawLine(context, strokeStrokeStyle, widthScalingFactor, topLeftPoint, bottomLeftPoint);
    });

    // mark a ruler
    drawLine(context, common.rulerStrokeStyle, widthScalingFactor, point(0, canvas.height), point(canvas.width, canvas.height));
    for (ix = 0; ix <= common.rulerMarks; ix += 1) {
        x = canvas.width * (ix / common.rulerMarks);
        drawLine(context, common.rulerStrokeStyle, common.rulerWidth, point(x, canvas.height), point(x, canvas.height - common.rulerHeight));
    }
};

MLB.pitchLapCalc.calculatePitchLapAndAction = function () {
    var common = MLB.pitchLapCalc.common,
        buildPitchContactsArray = MLB.pitchLapCalc.buildPitchContactsArray,
        drawPitchLap = MLB.pitchLapCalc.drawPitchLap,
        createMirrorNodes = MLB.pitchLapCalc.createMirrorNodes,
        createToolNodes = MLB.pitchLapCalc.createToolNodes,
        calcPolishingAction = MLB.pitchLapCalc.calcPolishingAction,
        displayPolishingActions = MLB.pitchLapCalc.displayPolishingActions;

    buildPitchContactsArray();
    drawPitchLap();
    createMirrorNodes();
    createToolNodes();
    calcPolishingAction();
    displayPolishingActions();
};

$(document).ready(function () {
    var common = MLB.pitchLapCalc.common,
        calculatePitchLapAndAction = MLB.pitchLapCalc.calculatePitchLapAndAction,
        buildZoneAndContactTableBasedOnPreset = MLB.pitchLapCalc.buildZoneAndContactTableBasedOnPreset,
        ix,
        htmlStr;

    // build tool zone+contact table
    for (ix = 1; ix <= common.zoneCount; ix += 1) {
        htmlStr = '<tr>\r\n'
                + '<td class="label">' + 'Zone</td>\r\n'
                + '<td> <input class="inputText" id="zone' + ix + '" onfocus="select();" type="number" step="0.1" min="0" max="1"> </td>\r\n'
                + '<td class="label"> contact </td>\r\n'
                + '<td> <input class="inputText" id="zoneContact' + ix + '" onfocus="select();" type="number" step="0.05" min="0" max="1"> </td>\r\n'
                + '</tr>';
        common.pitchLapParmTableBody().append(htmlStr);
    }

    // event hookups/subscribes...
    // add in change event handlers for each zone and contact
    for (ix = 1; ix <= common.zoneCount; ix += 1) {
        $(common.zoneIdLit + ix + ']').change(calculatePitchLapAndAction);
        $(common.zoneContactIdLit + ix + ']').change(calculatePitchLapAndAction);
    }
    common.btnUpdatePitchLap().click(calculatePitchLapAndAction);
    common.stars().change(calculatePitchLapAndAction);
    common.toolToMirrorSizeRatio().change(calculatePitchLapAndAction);
    common.strokeLength().change(calculatePitchLapAndAction);
    common.strokeOffset().change(calculatePitchLapAndAction);
    common.btnPreset().change(function () {
        buildZoneAndContactTableBasedOnPreset();
        calculatePitchLapAndAction();
    });
    // execute default layout and relative polishing action
    buildZoneAndContactTableBasedOnPreset();
    calculatePitchLapAndAction();
});

// end of file