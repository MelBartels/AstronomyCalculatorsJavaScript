// copyright Mel Bartels, 2011-2016

'use strict';

MLB.ronchi = {};

MLB.ronchi.constants = {
	RonchigramSize: 250,
	shrinkForBorders: 0.9,

	btnPlot: function () {
		return $('input[id=btnPlot]');
	},
	mirrorDia: function () {
		return +$('[name=mirrorDia]').val();
	},
	radiusOfCurvature: function () {
		return +$('[name=radiusOfCurvature]').val();
	},
	gratingFreq: function () {
		return +$('[name=gratingFreq]').val();
	},
	gratingOffsetSeries: function () {
		return $('[name=gratingOffsetSeries]').val();
	},
	canvas: function () {
		return $('[id=RonchiCanvas]')[0];
	},
	Ronchigrams: function () {
		return $('[id=Ronchigrams]');
	},
	acceptableDeviation: function () {
		return $('td[id=acceptableDeviation]');
	}
};

MLB.ronchi.quadrantSetPixel = function (imageData, cg, x, y, r, g, b, opaque) {
	var setPixel = MLB.sharedLib.setPixel;

	setPixel(imageData, cg.x + x, cg.y + y, r, g, b, opaque);
	setPixel(imageData, cg.x - x, cg.y + y, r, g, b, opaque);
	setPixel(imageData, cg.x + x, cg.y - y, r, g, b, opaque);
	setPixel(imageData, cg.x - x, cg.y - y, r, g, b, opaque);
};

// from algorithm in Sky and Telescope magazine: trace light rays through grating;
// correction factor of 1 = parabola
MLB.ronchi.ronchiCalcWithAllowableDeviation = function (mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, imageData, cg) {
	var scaledMirrorRadius,
	    scaledMirrorRadiusSquared,
		scaledRadiusOfCurvature,
		scaledGratingOffset,
		scaledLineWidth,
		scaledMirrorZone,
		maxScaledMirrorZone,
		x,
		y,
		ySquared,
		z,
		l,
		u,
		t,
		band,
		opaque = 255,
		int = MLB.sharedLib.int,
		quadrantSetPixel = MLB.ronchi.quadrantSetPixel;

	scaledMirrorRadius = mirrorDia / 2 * scalingFactor;
	scaledMirrorRadiusSquared = scaledMirrorRadius * scaledMirrorRadius;
	scaledRadiusOfCurvature = radiusOfCurvature * scalingFactor;
	scaledGratingOffset = gratingOffset * scalingFactor;
	scaledLineWidth = scalingFactor / (2 * gratingFreq);

	for (y = 0; y < scaledMirrorRadius; y++) {
		ySquared = y * y;
		maxScaledMirrorZone = ySquared + scaledMirrorRadiusSquared;
		for (x = 0; x < scaledMirrorRadius; x++) {
			scaledMirrorZone = ySquared + x * x;
			if (scaledMirrorZone > scaledMirrorRadiusSquared) {
				break;
			}
			// for spherical mirror, Z=RC;
			z = scaledRadiusOfCurvature + scaledMirrorZone / scaledRadiusOfCurvature;
			// offset*2 for light source that moves with Ronchi grating 
			l = scaledRadiusOfCurvature + scaledGratingOffset * 2 - z;
			// u = projection of ray at scaledMirrorRadius onto grating displaced from RC by gratingOffset 
			u = Math.abs(l * x / z);
			// test for ray blockage by grating 
			t = int((u / scaledLineWidth) + 0.5);
			band = t % 2 === 0;

			if (band) {
				quadrantSetPixel(imageData, cg, x, y, 0, 0, 0, opaque);
			}
		}
	}
};

MLB.ronchi.plot = function (canvas, gratingOffset) {
	var context,
		imageData,
		mirrorDia,
		radiusOfCurvature,
		gratingFreq,
		scalingFactor,
		ronchiCenter,
		ronchiWidth,
		circleCenter,
		focalRatio,
		allowableParabolicDeviation,
		decimals = 0,
		point = MLB.sharedLib.point,
		drawCircle = MLB.sharedLib.drawCircle,
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		constants = MLB.ronchi.constants,
		ronchiCalcWithAllowableDeviation = MLB.ronchi.ronchiCalcWithAllowableDeviation,
		calcAllowableParabolicDeviationForQuarterWavefront = MLB.calcLib.calcAllowableParabolicDeviationForQuarterWavefront;

	context = canvas.getContext("2d");

	mirrorDia = constants.mirrorDia();
	radiusOfCurvature = constants.radiusOfCurvature();
	gratingFreq = constants.gratingFreq();

	scalingFactor = canvas.height / mirrorDia * constants.shrinkForBorders;
	ronchiCenter = point(canvas.width / 2, canvas.height / 2);
	ronchiWidth = canvas.width;

	focalRatio = radiusOfCurvature / mirrorDia / 2;
	allowableParabolicDeviation = calcAllowableParabolicDeviationForQuarterWavefront(focalRatio);
	constants.acceptableDeviation().html("1/4 wavefront paraboloidal deviation is " + roundToDecimal(allowableParabolicDeviation * 100, decimals) + '%. ');

	// create a new pixel array
	imageData = context.createImageData(ronchiWidth, canvas.height);
	circleCenter = point(ronchiCenter.x, ronchiCenter.y);

	ronchiCalcWithAllowableDeviation(mirrorDia, radiusOfCurvature, gratingFreq, gratingOffset, scalingFactor, imageData, ronchiCenter);

	// copy the image data back onto the canvas
	context.putImageData(imageData, 0, 0);
	// now draw the circle that outlines mirror's aperture in the Ronchigram
	drawCircle(context, circleCenter, mirrorDia / 2 * scalingFactor, 1, 'black');
};

MLB.ronchi.plotRonchigrams = function () {
	var constants = MLB.ronchi.constants,
		gratingOffsetSeries = constants.gratingOffsetSeries().split(',').map(Number),
		gratingOffsetSeriesLength = gratingOffsetSeries.length,
		ix,
		plot = MLB.ronchi.plot;

	constants.Ronchigrams().html('');
	for (ix = 0; ix < gratingOffsetSeriesLength; ix++) {
		constants.Ronchigrams().append("<canvas id='RonchiCanvas" + ix + "' width='" + constants.RonchigramSize + "' height='" + constants.RonchigramSize + "'></canvas>");
		plot($('[id=RonchiCanvas' + ix + ']')[0], gratingOffsetSeries[ix]);
	}
};

$(window).ready(function () {
	var constants = MLB.ronchi.constants,
		plotRonchigrams = MLB.ronchi.plotRonchigrams;

	// event hookups/subscribes
	constants.btnPlot().click(function () {
		plotRonchigrams();
	});

	plotRonchigrams();
});

// end of file