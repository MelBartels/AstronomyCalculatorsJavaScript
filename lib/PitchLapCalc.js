// copyright Mel Bartels, 2017-2021

'use strict';

MLB.pitchLapCalc = {};

MLB.pitchLapCalc.common = {
    ixMOT: 0,
    ixTOT: 1,
    ixStraight: 0,
    ixW: 1,
    ixSpin: 2,

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

    imageActive: false,
    image: undefined,

    rulerWidth: 2,
    rulerZones: 4,
    rulerMarks: 8,
    rulerHeight: 10,
    polishActionStrokeStyle: 'blue',
    noPolishActionColor: 'white',
    rulerStrokeStyle: 'red',

    mirrorXYSize: 100,
    smoothingValues: 5,
    pressureMultiplier: 0.005,
    spinMultipler: 0.1,
    mirrorNodes: undefined,
    toolNodes: undefined,
    mirrorNodeCountPerRadius: undefined,
    mirrorPolishingActionPerRadius: undefined,
    mirrorPolishingActionPerRadiusWeighted: undefined,
    mirrorPressurePerRadius: undefined,

    stars: function () {
        return $('[id=stars]');
    },
    toolToMirrorSizeRatio: function () {
        return $('[id=toolToMirrorSizeRatio]');
    },
    pressure: function () {
        return $('[id=pressure]');
    },
    btnPressure: function () {
        return $('[name=btnPressure]');
    },
    pressureMOT: function () {
        return this.btnPressure()[this.ixMOT].checked;
    },
    pressureTOT: function () {
        return this.btnPressure()[this.ixTOT].checked;
    },
    btnStrokeMethod: function () {
        return $('[name=btnStrokeMethod]');
    },
    strokeMethodStraight: function () {
        return this.btnStrokeMethod()[this.ixStraight].checked;
    },
    strokeMethodW: function () {
        return this.btnStrokeMethod()[this.ixW].checked;
    },
    strokeMethodSpin: function () {
        return this.btnStrokeMethod()[this.ixSpin].checked;
    },
    strokeLength: function () {
        return $('[id=strokeLength]');
    },
    strokeOffset: function () {
        return $('[id=strokeOffset]');
    },
    bottomSpin: function () {
        return $('[id=bottomSpin]');
    },
    btnPreset: function () {
        return $('[name=btnPreset]');
    },
    wOverhang: function () {
        return $('[id=wOverhang]');
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
    JSversion: function () {
        return $('[id=JSversion]');
    },
    pitchLapCanvas: function () {
        return $('#pitchLapCanvas')[0];
    },
    polishingActionSideViewCanvas: function () {
        return $('#polishingActionSideViewCanvas')[0];
    },
    polishingActionTopViewCanvas: function () {
        return $('#polishingActionTopViewCanvas')[0];
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
        xySize = common.mirrorXYSize * +common.toolToMirrorSizeRatio().val(),
        halfXYSize = xySize / 2,
        toolNodes,
        contact,
        createNodes = MLB.pitchLapCalc.createNodes,
        getPitchLapContactForZone = MLB.pitchLapCalc.getPitchLapContactForZone;

    toolNodes = createNodes(xySize, contact);

    // build out the pit lap contact for each tool node
    // x nodes first then y nodes for each x node; both x & y ranging from -xySize/2 to + xySize/2
    toolNodes.forEach(toolNode => {
        toolNode.yNodes.forEach(yNode => {
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
    mirrorNodes.forEach(mirrorNode => {
        mirrorNode.yNodes.forEach(yNode => {
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
MLB.pitchLapCalc.getPolishingActionForStraightStrokeMethod = function () {
    var common = MLB.pitchLapCalc.common,
        yOffset,
        xOffset = common.mirrorXYSize * +common.strokeOffset().val() / 2,
        yStroke = common.mirrorXYSize * +common.strokeLength().val() / 2,
        pressure = +common.pressure().val(),
        bottomSpin = +common.bottomSpin().val(),
        MOT = common.pressureMOT(),
        toolToMirrorSizeRatio = +common.toolToMirrorSizeRatio().val(),
        getPolishingActionForMirror = MLB.pitchLapCalc.getPolishingActionForMirror,
        getPolishingPressureForMirror = MLB.pitchLapCalc.getPolishingPressureForMirror;

    // step through the stroke at offset...
    for (yOffset = 0; yOffset <= yStroke; yOffset += 1) {
        getPolishingActionForMirror(xOffset, yOffset, bottomSpin, MOT, toolToMirrorSizeRatio);
        if (pressure > 0) {
            getPolishingPressureForMirror(xOffset, yOffset);
        }
    }
};

MLB.pitchLapCalc.getPolishingActionForWStrokeMethod = function () {
    var common = MLB.pitchLapCalc.common,
        toolToMirrorSizeRatio = +common.toolToMirrorSizeRatio().val(),
        mirrorXYSize = common.mirrorXYSize,
        mirrorXYRadius = mirrorXYSize / 2,
        toolXYSize = mirrorXYSize * toolToMirrorSizeRatio,
        toolXYRadius = toolXYSize / 2,
        overhang = +common.wOverhang().val(),
        overhangXYsize,
        pressure = +common.pressure().val(),
        bottomSpin = +common.bottomSpin().val(),
        MOT = common.pressureMOT(),
        strokeXYLength,
        yStroke,
        xStroke,
        yOffset,
        xOffset,
        getPolishingActionForMirror = MLB.pitchLapCalc.getPolishingActionForMirror,
        getPolishingPressureForMirror = MLB.pitchLapCalc.getPolishingPressureForMirror,
        debug = false;

    if (common.pressureMOT()) {
        overhangXYsize = overhang * mirrorXYSize;
        strokeXYLength = overhangXYsize + toolXYRadius - mirrorXYRadius;
    } else {
        overhangXYsize = overhang * toolXYSize;
        strokeXYLength = overhangXYsize + mirrorXYRadius - toolXYRadius;
    }

    if (debug) console.log('strokeXYLength = ' + strokeXYLength);
    yStroke = strokeXYLength * 0.707;
    // 2 strokes: first from center at 45 deg, second from edge (w/ overhang) to the ending point of the 1st stroke
    for (yOffset = 0; yOffset <= yStroke; yOffset += 1) {
        xOffset = yOffset;
        if (debug) console.log('xOffset, yOffset = ' + xOffset + ' '  + yOffset);
        getPolishingActionForMirror(xOffset, yOffset, bottomSpin, MOT, toolToMirrorSizeRatio);
        if (pressure > 0) {
            getPolishingPressureForMirror(xOffset, yOffset);
        }
    }
    // '<' not '<=' since the '=' stroke executed above
    xStroke = strokeXYLength - xOffset;
    if (debug) console.log('xStroke = ' + xStroke);
    for (yOffset = 0; yOffset < yStroke; yOffset += 1) {
        xOffset = Math.floor(xStroke - yOffset / yStroke * xStroke);
        if (debug) console.log('xOffset, yOffset = ' + xOffset + ' '  + yOffset);
        getPolishingActionForMirror(xOffset, yOffset, bottomSpin, MOT, toolToMirrorSizeRatio);
        if (pressure > 0) {
            getPolishingPressureForMirror(xOffset, yOffset);
        }
    }
};

MLB.pitchLapCalc.getPolishingActionForSpinMethod = function () {
    var common = MLB.pitchLapCalc.common,
        displayErrorMsg = MLB.pitchLapCalc.displayErrorMsg;

    //note todo

    displayErrorMsg('Under construction - not yet implemented');

};

MLB.pitchLapCalc.buildNewMirrorPressurePerRadiusArray = function () {
    var common = MLB.pitchLapCalc.common,
        mirrorPressurePerRadius = [],
        ix;

    for (ix = 0; ix < common.mirrorXYSize / 2; ix += 1) {
        mirrorPressurePerRadius[ix] = 0;
    }
    return mirrorPressurePerRadius;
};

MLB.pitchLapCalc.getPolishingActionForMirror = function (xOffset, yOffset, bottomSpin, MOT, toolToMirrorSizeRatio) {
    var common = MLB.pitchLapCalc.common,
        mirrorNodes = common.mirrorNodes,
        getPolishingActionForAMirrorNode = MLB.pitchLapCalc.getPolishingActionForAMirrorNode;

    // get polishing action for entire mirror by stepping through each mirror node...
    mirrorNodes.forEach(xMirrorNode => {
        xMirrorNode.yNodes.forEach(mirrorNode => {
            getPolishingActionForAMirrorNode(xOffset, yOffset, mirrorNode, bottomSpin, MOT, toolToMirrorSizeRatio);
        });
    });
};

MLB.pitchLapCalc.getPolishingPressureForMirror = function (xOffset, yOffset) {
    var common = MLB.pitchLapCalc.common,
        xyOffset = Math.sqrt(yOffset * yOffset + xOffset * xOffset),
        toolToMirrorSizeRatio = +common.toolToMirrorSizeRatio().val(),
        mirrorXYSize = common.mirrorXYSize,
        mirrorXYRadius = mirrorXYSize / 2,
        toolXYRadius,
        // otherwise pressure change is too sensitive
        pressure = +common.pressure().val() * common.pressureMultiplier,
        overhang,
        maxLeverage,
        startMirrorRadius,
        endMirrorRadius,
        leveragePerRadius,
        ixRadius,
        mirrorPressurePerRadius = common.mirrorPressurePerRadius;

    if (common.pressureMOT()) {
        // eg, offset = 5, mirror radius = 50 and tool = 50 (=mirror size): overhang = 5-50*(1-1)=5;
        // eg, offset = 5, mirror radius = 50 and tool = 60 (=1.2x mirror); overhang = 5-50*(1-1.2)=-5 (no overhang)
        overhang = xyOffset - mirrorXYRadius * (1 - toolToMirrorSizeRatio);
        if (overhang <= 0) {
            return;
        }
        // traverse mirror radii starting at mirror center to radius of mirror that sits over the tool edge
        maxLeverage = mirrorXYRadius / (mirrorXYRadius - overhang) * pressure;
        endMirrorRadius = mirrorXYRadius - xyOffset;
        leveragePerRadius = maxLeverage / endMirrorRadius;
        for (ixRadius = 0; ixRadius < endMirrorRadius; ixRadius += 1) {
            mirrorPressurePerRadius[ixRadius] += leveragePerRadius * ixRadius;
        }
    } else { // TOT
        // eg, offset = 5, mirror radius = 50 and tool = 50 (=mirror size): overhang = 5+50-50=5;
        // eg, offset = 5, mirror radius = 50 and tool = 40 (=0.8x mirror): overhang = 5+40-50=-5 (no overhang)
        toolXYRadius = toolToMirrorSizeRatio * mirrorXYRadius;
        overhang = xyOffset + toolXYRadius - mirrorXYRadius;
        if (overhang <= 0) {
            return;
        }
        // traverse mirror radii starting at inside edge of tool, or mirror center if edge of tool extends past, to mirror edge (since there is an overhang)
        maxLeverage = toolXYRadius / (toolXYRadius - overhang) * pressure;
        startMirrorRadius = xyOffset - toolXYRadius;
        if (startMirrorRadius < 0) {
            startMirrorRadius = 0;
        }
        endMirrorRadius = mirrorXYRadius;
        leveragePerRadius = maxLeverage / (endMirrorRadius - startMirrorRadius);
        for (ixRadius = startMirrorRadius; ixRadius < endMirrorRadius; ixRadius += 1) {
            mirrorPressurePerRadius[ixRadius] += leveragePerRadius * ixRadius;
        }
    }
};

MLB.pitchLapCalc.getPolishingActionForAMirrorNode = function (xOffset, yOffset, mirrorNode, bottomSpin, MOT, toolToMirrorSizeRatio) {
    var common = MLB.pitchLapCalc.common,
        mirrorXYRadius,
        toolXYRadius,
        xTool,
        yTool,
        toolNodes = common.toolNodes,
        toolNodesLength = common.toolNodes.length,
        xToolNodes,
        yToolNodes,
        xToolNode,
        yNodesTool,
        yNodesToolLength,
        toolNode,
        radius,
        contact,
        spin;

    // xTool, yTool is tool's xy for that mirror node's xy; eg, if mirror x,y is 5,7 and offset is 0 and stroke is now 2, then tool x,y is 5+0,7+2 or 5,9
    xTool = mirrorNode.x + xOffset;
    yTool = mirrorNode.y + yOffset;

    // get tool node if possible: start with the x axis represented by the toolNodes array
    if (xTool >= toolNodes[0].x && xTool <= toolNodes[toolNodesLength - 1].x) {

        xToolNodes = Math.floor(xTool - toolNodes[0].x);
        xToolNode = toolNodes[xToolNodes];
        yNodesTool = xToolNode.yNodes;
        yNodesToolLength = yNodesTool.length;

        // now try to find the tool node for the y axis in the array: xToolNode.yNodes; full path to a particular tool node is toolNodes[].yNodes[]
        if (yTool >= yNodesTool[0].y && yTool <= yNodesTool[yNodesToolLength - 1].y) {

            yToolNodes = Math.floor(yTool - yNodesTool[0].y);
            toolNode = yNodesTool[yToolNodes];

            // add contact to polishing action array
            radius = Math.floor(mirrorNode.radius + 0.5);
            if (common.mirrorPolishingActionPerRadius[radius] === undefined) {
                common.mirrorPolishingActionPerRadius[radius] = 0;
            }
            contact = toolNode.contact;
            if (bottomSpin > 0) {
                if (MOT) { //tool on bottom
                    mirrorXYRadius = common.mirrorXYSize / 2;
                    toolXYRadius = mirrorXYRadius * toolToMirrorSizeRatio;
                    spin = Math.sqrt(toolNode.x * toolNode.x + toolNode.y * toolNode.y) / toolXYRadius * bottomSpin * common.spinMultipler + 1;

                } else { //mirror on bottom
                    mirrorXYRadius = common.mirrorXYSize / 2;
                    spin = Math.sqrt(mirrorNode.x * mirrorNode.x + mirrorNode.y * mirrorNode.y) / mirrorXYRadius * bottomSpin * common.spinMultipler + 1;
                }
            }
            else {
                spin = 1;
            }
            // add tool node's contact to the mirror's polishing action per radius
            common.mirrorPolishingActionPerRadius[radius] += contact * spin;
        }
    }
};

MLB.pitchLapCalc.calcWeightedMirrorPolishingActions = function () {
    var common = MLB.pitchLapCalc.common;

    common.mirrorPolishingActionPerRadiusWeighted = [];

    common.mirrorPolishingActionPerRadius.forEach((action, ix) => {
        common.mirrorPolishingActionPerRadiusWeighted[ix] = action / common.mirrorNodeCountPerRadius[ix] * (1 + common.mirrorPressurePerRadius[ix]);
    });
};

MLB.pitchLapCalc.smoothWeightedMirrorPolishingActions = function () {
    var common = MLB.pitchLapCalc.common,
        mirrorPolishingActionPerRadiusWeightedLength = common.mirrorPolishingActionPerRadiusWeighted.length,
        smoothingValues = common.smoothingValues,
        ix,
        startIx,
        endIx,
        ixSmooth,
        accumValue,
        accumCount,
        smoothedArray = [];

    for (ix = 0; ix < mirrorPolishingActionPerRadiusWeightedLength; ix += 1) {
        startIx = Math.floor(ix - smoothingValues / 2);
        if (startIx < 0) {
            startIx = 0;
        }
        endIx = Math.floor(ix + smoothingValues / 2);
        if (endIx >= mirrorPolishingActionPerRadiusWeightedLength) {
            endIx = mirrorPolishingActionPerRadiusWeightedLength - 1;
        }
        accumCount = 0;
        accumValue = 0;
        for (ixSmooth = startIx; ixSmooth <= endIx; ixSmooth += 1) {
            if (!isNaN(common.mirrorPolishingActionPerRadiusWeighted[ixSmooth])) {
                accumValue += common.mirrorPolishingActionPerRadiusWeighted[ixSmooth];
                accumCount += 1;
            }
        }
        smoothedArray[ix] = accumValue / accumCount;
        //console.log('ix = ' + ix + ' startIx = ' + startIx + ' endIx = ' + endIx + ' accumCount = ' + accumCount + ' AccumValue = ' + accumValue + ' smoothedArray[ix] = ' + smoothedArray[ix]);
    }

    common.mirrorPolishingActionPerRadiusWeighted = smoothedArray;
};












/* get vector due to rotation of 'nodes' for each node x,; rotation centered at 0,0;
   vector due to rotation is rotated 90 degrees from a line from 'nodes' center to x,y; so to get the vector, transpose x and y, eg, vector in x=y and vector in y=x; then adjust for direction
   vector is normalized to the radius of 'nodes': at center is 0 (no rotational motion), at edge is max rotational motion;

   quadrants:
    ---------------------------
    |  1: -x,-y  |  2: +x,-y  |
    ---------------------------
    |  4: +x,+y  |  3: -x,+y  |
    ---------------------------

    direction: minus for CCW, positive for CW;

    quadrant    node    CW    CCW
    1           --      +-    -+
    2           +-      ++    --
    3           ++      -+    +-
    4           -+      --    ++
*/

MLB.pitchLapCalc.createRotationalVectors = function (nodes, direction) {
    var common = MLB.pitchLapCalc.common,
        xySize = common.mirrorXYSize * +common.toolToMirrorSizeRatio().val(),
        halfXYSize = xySize / 2;

    nodes.forEach(node => {
        node.yNodes.forEach(yNode => {

            yNode.vector = [];
            yNode.vector.x = yNode.y / halfXYSize * direction;
            yNode.vector.y = yNode.x / halfXYSize * direction;

            if (yNode.x <= 0 && yNode.y <= 0) {
                yNode.quadrant = 1;
                if (direction >= 0) {
                    yNode.vector.x = -Math.abs(yNode.vector.x);
                    yNode.vector.y = Math.abs(yNode.vector.y);
                } else {
                    yNode.vector.x = -Math.abs(yNode.vector.x);
                    yNode.vector.y = Math.abs(yNode.vector.y);
                }
            } else if (yNode.x >= 0 && yNode.y <= 0) {
                yNode.quadrant = 2;
                if (direction >= 0) {
                    yNode.vector.x = Math.abs(yNode.vector.x);
                    yNode.vector.y = -Math.abs(yNode.vector.y);
                } else {
                    yNode.vector.x = -Math.abs(yNode.vector.x);
                    yNode.vector.y = -Math.abs(yNode.vector.y);
                }
            } else if (yNode.x >= 0 && yNode.y >= 0) {
                yNode.quadrant = 3;
                if (direction >= 0) {
                    yNode.vector.x = -Math.abs(yNode.vector.x);
                    yNode.vector.y = Math.abs(yNode.vector.y);
                } else {
                    yNode.vector.x = Math.abs(yNode.vector.x);
                    yNode.vector.y = -Math.abs(yNode.vector.y);
                }
            } else if (yNode.x <= 0 && yNode.y >= 0) {
                yNode.quadrant = 4;
                if (direction >= 0) {
                    yNode.vector.x = -Math.abs(yNode.vector.x);
                    yNode.vector.y = -Math.abs(yNode.vector.y);
                } else {
                    yNode.vector.x = Math.abs(yNode.vector.x);
                    yNode.vector.y = Math.abs(yNode.vector.y);
                }
            } else {
                console.log('error assigning quadrant in createRotationalVectors(); yNode.x=' + yNode.x + ', yNode.y=' + yNode.y);
            }
        });
    });
};

MLB.pitchLapCalc.getRotationalVectorForAMirrorNode = function (mirrorNode, yOffset, toolToMirrorSizeRatio) {
    var common = MLB.pitchLapCalc.common,
        xTool,
        yTool,
        toolNodes = common.toolNodes,
        toolNodesLength = common.toolNodes.length,
        xToolNodes,
        yToolNodes,
        xToolNode,
        yNodesTool,
        yNodesToolLength,
        toolNode;

    // xTool, yTool is tool's xy for that mirror node's x,y; eg, if mirror x,y is 5,7 and yOffset is 3 then tool x,y is 5,7+3 or 5,10
    xTool = mirrorNode.x;
    yTool = mirrorNode.y + yOffset;

    // get tool node if possible: start with the x axis represented by the toolNodes array
    if (xTool >= toolNodes[0].x && xTool <= toolNodes[toolNodesLength - 1].x) {

        xToolNodes = Math.floor(xTool - toolNodes[0].x);
        xToolNode = toolNodes[xToolNodes];
        yNodesTool = xToolNode.yNodes;
        yNodesToolLength = yNodesTool.length;

        // now try to find the tool node for the y axis in the array: xToolNode.yNodes; full path to a particular tool node is toolNodes[].yNodes[]
        if (yTool >= yNodesTool[0].y && yTool <= yNodesTool[yNodesToolLength - 1].y) {

            yToolNodes = Math.floor(yTool - yNodesTool[0].y);
            toolNode = yNodesTool[yToolNodes];
            mirrorNode.toolVector = [];
            mirrorNode.toolVector.x = toolNode.vector.x;
            mirrorNode.toolVector.y = toolNode.vector.y;
        }
    }

    // set mirrorNode's netVector...
    if (mirrorNode.toolVector) {
        mirrorNode.netVector = [];
        // eg, if mirror and tool both rotate in same direction at same speed, then net vector is zero: subtract the tool vector from the mirror vector
        mirrorNode.netVector.x = mirrorNode.vector.x - mirrorNode.toolVector.x;
        mirrorNode.netVector.y = mirrorNode.vector.y - mirrorNode.toolVector.y;
    }
    // else no polishing action
};

MLB.pitchLapCalc.calcNetRotationalVectorForTOT = function (toolToMirrorSizeRatio, toolDirection, yOffset) {
    var common = MLB.pitchLapCalc.common,
        mirrorNodes = common.mirrorNodes,
        toolNodes = common.toolNodes,
        createRotationalVectors = MLB.pitchLapCalc.createRotationalVectors,
        getRotationalVectorForAMirrorNode = MLB.pitchLapCalc.getRotationalVectorForAMirrorNode,
        mirrorDirection = 1,
        netVector,
        netDirection,
        totalNetDirection = 0;

    createRotationalVectors(mirrorNodes, mirrorDirection);
    createRotationalVectors(toolNodes, toolDirection);

    mirrorNodes.forEach(xMirrorNode => {
        xMirrorNode.yNodes.forEach(mirrorNode => {

            getRotationalVectorForAMirrorNode(mirrorNode, yOffset, toolToMirrorSizeRatio);

            if (mirrorNode.toolVector) {
                // we have mirrorNode.netVector.x and mirrorNode.netVector.y, need to calculate net rotational action either CW or CCW

                mirrorNode.angleRad = Math.atan(mirrorNode.y, mirrorNode.x);

                netVector = mirrorNode.netVector;
                netVector.netX = netVector.x - mirrorNode.x;
                netVector.netY = netVector.y - mirrorNode.y;
                netVector.distance = Math.sqrt(netVector.netX * netVector.netX + netVector.netY * netVector.netY);
                netVector.angleRad = Math.atan(netVector.netY, netVector.netX);
                netVector.combinedAngleRad = netVector.angleRad + mirrorNode.angleRad;
                netVector.directionCW = Math.cos(netVector.combinedAngleRad);
                totalNetDirection += netVector.directionCW;


                switch (mirrorNode.quadrant) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                }

            }
        });
    });

    return totalNetDirection;
};

MLB.pitchLapCalc.freelyRotatingToolToMirrorRotationRatio = function () {
    var common = MLB.pitchLapCalc.common,
        calcNetRotationalVectorForTOT = MLB.pitchLapCalc.calcNetRotationalVectorForTOT,
        toolToMirrorSizeRatio,
        toolDirection,
        yOffset,
        directions,
        log = '';

    toolToMirrorSizeRatio = 1;
    yOffset = 25;
    for (toolDirection = -10; toolDirection <= 10; toolDirection += 0.1) {
        directions = calcNetRotationalVectorForTOT(toolToMirrorSizeRatio, toolDirection, yOffset);
        log += Math.floor(toolDirection * 10) / 10
                + ', '
                + Math.floor(directions.totalDirectionX)
                + ', '
                + Math.floor(directions.totalDirectionY)
                + ', '
                + Math.floor(directions.totalDirection)
                + '\n';
    }
    console.log(log);
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

MLB.pitchLapCalc.displayPitchLap = function () {
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

MLB.pitchLapCalc.displayPolishingActionsSideView = function () {
    var common = MLB.pitchLapCalc.common,
        polishActions = common.mirrorPolishingActionPerRadiusWeighted,
        xySize = common.mirrorXYSize,
        canvas = common.polishingActionSideViewCanvas(),
        context = canvas.getContext('2d'),
        topRightPoint,
        topLeftPoint,
        bottomRightPoint,
        bottomLeftPoint,
        widthScalingFactor,
        maxPolish,
        heightScalingFactor,
        ix,
        x,
        point = MLB.sharedLib.point,
        drawLine = MLB.sharedLib.drawLine;

    context.clearRect(0, 0, canvas.width, canvas.height);

    widthScalingFactor = canvas.width / xySize;
    maxPolish = 0;
    polishActions.forEach((s, i) => {
        if (s > maxPolish) {
            maxPolish = s;
        }
    });
    heightScalingFactor = canvas.height / maxPolish;

    polishActions.forEach((polishAction, ix) => {
        topRightPoint = new point(canvas.width / 2 + ix * widthScalingFactor, canvas.height - polishAction * heightScalingFactor);
        topLeftPoint = new point(canvas.width / 2 - ix * widthScalingFactor, topRightPoint.y);
        bottomRightPoint = new point(topRightPoint.x, canvas.height);
        bottomLeftPoint = new point(topLeftPoint.x, bottomRightPoint.y);
        drawLine(context, common.polishActionStrokeStyle, widthScalingFactor, topRightPoint, bottomRightPoint);
        drawLine(context, common.polishActionStrokeStyle, widthScalingFactor, topLeftPoint, bottomLeftPoint);
    });

    // mark a ruler
    drawLine(context, common.rulerStrokeStyle, widthScalingFactor, point(0, canvas.height), point(canvas.width, canvas.height));
    for (ix = 0; ix <= common.rulerMarks; ix += 1) {
        x = canvas.width * (ix / common.rulerMarks);
        drawLine(context, common.rulerStrokeStyle, common.rulerWidth, point(x, canvas.height), point(x, canvas.height - common.rulerHeight));
    }
};

MLB.pitchLapCalc.displayPolishingActionsTopView = function () {
    var common = MLB.pitchLapCalc.common,
        polishActions = common.mirrorPolishingActionPerRadiusWeighted,
        canvas = common.polishingActionTopViewCanvas(),
        context = canvas.getContext('2d'),
        center,
        strokeStyle,
        scalingFactor,
        maxPolish,
        polishColor,
        ix,
        point = MLB.sharedLib.point,
        fillCircle = MLB.sharedLib.fillCircle,
        drawCircle = MLB.sharedLib.drawCircle;

    context.clearRect(0, 0, canvas.width, canvas.height);

    scalingFactor = canvas.width / polishActions.length / 2;
    center = point(canvas.width / 2, canvas.height / 2);

    // find maxPolish
    maxPolish = 0;
    polishActions.forEach((s, i) => {
        if (s > maxPolish) {
            maxPolish = s;
        }
    });

    // fill in circle with default no polishing action
    fillCircle(context, center, canvas.width / 2, common.noPolishActionColor);

    polishActions.forEach((polishAction, ix) => {
        polishColor = 255 - polishAction * 255 / maxPolish;
        strokeStyle = 'rgb(' + polishColor + ',' + polishColor + ',255)';
        if (ix === 0) {
            fillCircle(context, center, scalingFactor, strokeStyle);
        } else {
            drawCircle(context, center, scalingFactor * ix, scalingFactor * 1.2, strokeStyle);
        }
    });

    // mark circular ruler
    for (ix = 1; ix < common.rulerZones; ix += 1) {
        drawCircle(context, center, polishActions.length * scalingFactor * ix / common.rulerZones, 2, common.rulerStrokeStyle);
    }
};

MLB.pitchLapCalc.displayErrorMsg = function (msg) {
    var common = MLB.pitchLapCalc.common,
        canvas,
        context;

    canvas = common.pitchLapCanvas();
    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '10pt arial';
    context.fillText(msg, 0, canvas.height / 4);

    canvas = common.polishingActionSideViewCanvas();
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    canvas = common.polishingActionTopViewCanvas();
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
};

MLB.pitchLapCalc.calculateAndDisplayPolishingAction = function () {
    var common = MLB.pitchLapCalc.common,
        displayErrorMsg = MLB.pitchLapCalc.displayErrorMsg,
        buildPitchContactsArray = MLB.pitchLapCalc.buildPitchContactsArray,
        displayPitchLap = MLB.pitchLapCalc.displayPitchLap,
        createMirrorNodes = MLB.pitchLapCalc.createMirrorNodes,
        createToolNodes = MLB.pitchLapCalc.createToolNodes,
        buildNewMirrorPressurePerRadiusArray = MLB.pitchLapCalc.buildNewMirrorPressurePerRadiusArray,
        getPolishingActionForStraightStrokeMethod = MLB.pitchLapCalc.getPolishingActionForStraightStrokeMethod,
        getPolishingActionForWStrokeMethod = MLB.pitchLapCalc.getPolishingActionForWStrokeMethod,
        getPolishingActionForSpinMethod = MLB.pitchLapCalc.getPolishingActionForSpinMethod,
        calcWeightedMirrorPolishingActions = MLB.pitchLapCalc.calcWeightedMirrorPolishingActions,
        smoothWeightedMirrorPolishingActions = MLB.pitchLapCalc.smoothWeightedMirrorPolishingActions,
        displayPolishingActionsSideView = MLB.pitchLapCalc.displayPolishingActionsSideView,
        displayPolishingActionsTopView = MLB.pitchLapCalc.displayPolishingActionsTopView,
        loadPastedImageIntoCanvas = MLB.pitchLapCalc.loadPastedImageIntoCanvas;

    if (common.pressureMOT() && common.toolToMirrorSizeRatio().val() < 1) {
        displayErrorMsg('Tool size cannot be smaller than mirror when Mirror On Top (MOT)');
        return;
    }

    buildPitchContactsArray();
    displayPitchLap();
    createMirrorNodes();
    createToolNodes();

    common.mirrorPolishingActionPerRadius = [];
    common.mirrorPressurePerRadius = buildNewMirrorPressurePerRadiusArray();

    if (common.strokeMethodStraight()) {
        getPolishingActionForStraightStrokeMethod();
    } else if (common.strokeMethodW()) {
        getPolishingActionForWStrokeMethod();
    } else if (common.strokeMethodSpin()) {
        getPolishingActionForSpinMethod();
    } else {
        alert('unhandled method in MLB.pitchLapCalc.calculateAndDisplayPolishingAction() of ' + common.btnStrokeMethod().val());
    }

    calcWeightedMirrorPolishingActions();
    smoothWeightedMirrorPolishingActions();
    displayPolishingActionsSideView();
    displayPolishingActionsTopView();
    if (common.imageActive) {
        loadPastedImageIntoCanvas(common.pitchLapCanvas(), common.image);
    }
};

MLB.pitchLapCalc.loadPastedImageIntoCanvas = function (canvas, image) {
    var common = MLB.pitchLapCalc.common,
        context = canvas.getContext("2d"),
        transparency = 0.75,
        xImageOffset = 0,
        yImageOffset = 0,
        canvasWidth = canvas.width,
        canvasHeight = canvas.height;

    context.globalAlpha = transparency;
    context.drawImage(image, xImageOffset, yImageOffset, canvasWidth, canvasHeight);
    common.image = image;
    common.imageActive = true;
};

MLB.pitchLapCalc.loadPastedImage = function (e) {
    var common = MLB.pitchLapCalc.common,
        loadPastedImageIntoCanvas = MLB.pitchLapCalc.loadPastedImageIntoCanvas;

    loadPastedImageIntoCanvas(common.pitchLapCanvas(), e.target);
};

MLB.pitchLapCalc.copyClipboardImage = function (e) {
    var items,
        ix,
        imageItem,
        blob,
        objectURL,
        source,
        pastedImage,
        loadPastedImage = MLB.pitchLapCalc.loadPastedImage;

    e.preventDefault();

    if (e.clipboardData) {
        items = e.clipboardData.items;
        // items can be array of url and image
        for (ix = 0; ix < items.length; ix += 1) {
            // eg, "image/png"
            if (items[ix].type.indexOf("image") > -1) {
                imageItem = items[ix];
                break;
            }
        }
        if (imageItem) {
            blob = imageItem.getAsFile();
            objectURL = window.URL || window.webkitURL;
            source = objectURL.createObjectURL(blob);

            pastedImage = new Image();
            pastedImage.onload = loadPastedImage;
            pastedImage.src = source;
            return;
        }
    }
    alert('No image found in clipboard');
};

MLB.pitchLapCalc.setDropEffectToCopy = function (e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
};

MLB.pitchLapCalc.dragAndDropImage = function (e) {
    var files,
        file,
        ix,
        objectURL,
        source,
        pastedImage,
        loadPastedImage = MLB.pitchLapCalc.loadPastedImage;

    e.stopPropagation();
    e.preventDefault();
    files = e.dataTransfer.files;

    for (ix = 0; ix < files.length; ix+=1) {
        file = files[ix];
        if (file.type.match(/image.*/)) {
            objectURL = window.URL || window.webkitURL;
            source = objectURL.createObjectURL(file);

            pastedImage = new Image();
            pastedImage.onload = loadPastedImage;
            pastedImage.src = source;
            return;
        }
    }
    alert('File is not an image');
};

$(document).ready(function () {
    var common = MLB.pitchLapCalc.common,
        calculateAndDisplayPolishingAction = MLB.pitchLapCalc.calculateAndDisplayPolishingAction,
        buildZoneAndContactTableBasedOnPreset = MLB.pitchLapCalc.buildZoneAndContactTableBasedOnPreset,
        copyClipboardImage = MLB.pitchLapCalc.copyClipboardImage,
        setDropEffectToCopy = MLB.pitchLapCalc.setDropEffectToCopy,
        dragAndDropImage = MLB.pitchLapCalc.dragAndDropImage,
        deleteImage = MLB.pitchLapCalc.deleteImage,
        ix,
        htmlStr;

    common.JSversion().text('JavaScript version Feb 6, 2021');

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
        $(common.zoneIdLit + ix + ']').change(calculateAndDisplayPolishingAction);
        $(common.zoneContactIdLit + ix + ']').change(calculateAndDisplayPolishingAction);
    }
    common.btnUpdatePitchLap().click(calculateAndDisplayPolishingAction);
    common.stars().change(calculateAndDisplayPolishingAction);
    common.toolToMirrorSizeRatio().change(calculateAndDisplayPolishingAction);
    common.pressure().change(calculateAndDisplayPolishingAction);
    common.btnPressure().change(calculateAndDisplayPolishingAction);
    common.btnStrokeMethod().change(calculateAndDisplayPolishingAction);
    common.strokeLength().change(calculateAndDisplayPolishingAction);
    common.strokeOffset().change(calculateAndDisplayPolishingAction);
    common.bottomSpin().change(calculateAndDisplayPolishingAction);
    common.wOverhang().change(calculateAndDisplayPolishingAction);
    common.btnPreset().change(function () {
        buildZoneAndContactTableBasedOnPreset();
        calculateAndDisplayPolishingAction();
    });

    document.addEventListener('paste', copyClipboardImage);
    document.addEventListener('dragover', setDropEffectToCopy);
    document.addEventListener('drop', dragAndDropImage);
    document.addEventListener('keydown', function(event) {
            const key = event.key;
            if (key === 'Delete' || key === 'Escape') {
                common.imageActive = false;
                calculateAndDisplayPolishingAction();
            }
        });

    // execute default layout and relative polishing action
    buildZoneAndContactTableBasedOnPreset();
    calculateAndDisplayPolishingAction();
});

// end of file