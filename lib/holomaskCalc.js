// copyright Mel Bartels, 2015-2023

/*
EPS coordinate notes
http://paulbourke.net/dataformats/postscript/

0,0 in bottom left hand corner
units are 1/72 inch
'y' 'x' command
'm' = move to
'l' = line
's' = stroke
*/

'use strict';

MLB.holomaskCalc = {};

MLB.holomaskCalc.textFile = null;
MLB.holomaskCalc.fileName = 'holomask.eps';

MLB.holomaskCalc.drawGraphicsOnCanvas = function (canvas) {
    var canvasSize,
        mirrorDiameterMm,
        scale,
        lineType,
        int = MLB.sharedLib.int,
        graphicLines = MLB.holomaskLib.output.graphicLines,
        numbers,
        savedNumbers,
        context = canvas.getContext('2d');

    mirrorDiameterMm = +$('input[name = mirrorDiameterMm]').val();
    canvasSize = +$('input[name = canvasSize]').val();
    // fit the holomask into the canvas
    scale = canvasSize / mirrorDiameterMm * 25.4 / 72;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'orange';
    context.fillStyle = context.strokeStyle;
    context.beginPath();

    // each 'm', 'l'..., 's' sequence draws a wavy rectangle outlining a fringe on the mirror's surface from center to edge back to center;
    // 'm', 'l'..., 'f' designates a filled in area
    graphicLines.forEach(function (line) {
        lineType = line.slice(-1);
        if (lineType === 'm') {
            numbers = line.split(' ');
            context.moveTo(int(scale * numbers[0]), int(scale * numbers[1]));
            // save the starting moveto point to draw to the final lineto
            savedNumbers = numbers.slice();
        } else if (lineType === 'l') {
            numbers = line.split(' ');
            context.lineTo(int(scale * numbers[0]), int(scale * numbers[1]));
        } else if (lineType === 's' || lineType === 'f') {
            // draw a line back to the starting point
            context.lineTo(int(scale * savedNumbers[0]), int(scale * savedNumbers[1]));
            context.stroke();
            context.fill();
            context.beginPath();
        }
    });
};

MLB.holomaskCalc.mainWorkFlow = function () {
    var setInputParmsFromDOM = MLB.holomaskLib.setInputParmsFromDOM,
        calcParms = MLB.holomaskLib.calcParms,
        buildContentPreamble = MLB.holomaskLib.buildContentPreamble,
        generateEPSfileHeader = MLB.holomaskLib.generateEPSfileHeader,
        fringes = MLB.holomaskLib.fringes,
        addCenterSpotAndFooter = MLB.holomaskLib.addCenterSpotAndFooter,
        output = MLB.holomaskLib.output,
        extractGraphics = MLB.holomaskLib.extractGraphics,
        drawGraphicsOnCanvas = MLB.holomaskCalc.drawGraphicsOnCanvas,
        canvas;

    setInputParmsFromDOM();
    calcParms();
    generateEPSfileHeader();
    buildContentPreamble();
    fringes();
    addCenterSpotAndFooter();

    // file contents are found in MLB.holomaskLib.output.fileContents
    $('#parms').html(output.parms + output.fringeCount);

    extractGraphics();
    canvas = $('#holomaskCanvas')[0];
    drawGraphicsOnCanvas(canvas);
};

var makeTextFile = function () {
    var fileContents = MLB.holomaskLib.output.fileContents,
        textFile = MLB.holomaskCalc.textFile,
        data = new Blob([fileContents]);

    // if we are replacing a previously generated file we need to manually revoke the object URL to avoid memory leaks
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);
    return textFile;
};


$(window).ready(function () {
    var btnCalc = $('input[id = btnCalc]'),
        btnCreateFile = $('#createFile'),
        mainWorkFlow = MLB.holomaskCalc.mainWorkFlow,
        fileName = MLB.holomaskCalc.fileName;

    // event hookups / subscribes
    btnCalc.click(function () {
        mainWorkFlow();
    });
    btnCreateFile.click(function () {
        var link = document.getElementById('downloadlink');
        link.href = makeTextFile();
        link.fileName = fileName;
        link.style.display = 'block';
    });

    mainWorkFlow();
});

// end of file
