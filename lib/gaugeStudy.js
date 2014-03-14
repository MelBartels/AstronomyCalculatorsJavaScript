// copyright Mel Bartels, 2012-2014

'use strict';

MLB.gaugeStudy = {};

MLB.gaugeStudy.drawGauges = function () {
	var gaugeStyle = document.getElementById('gaugeStyle'),
		selectedGaugeStyle = gaugeStyle.options[gaugeStyle.selectedIndex].text,
	    scale = +document.getElementsByName('gaugeSize')[0].value,
		stateInstances = MLB.gaugeLib.stateInstances,
		init = MLB.gaugeLib.init;

	stateInstances.states = [];

	init('hourGauge1', 'inputHours1', 'Time', scale, 'hoursGauge', selectedGaugeStyle);
	init('degreeGauge1', 'inputDegrees1', 'Angle', scale, 'degreesGauge', selectedGaugeStyle);
	init('negHourGauge1', 'inputNegHours1', 'Net time', scale, 'negHoursGauge', selectedGaugeStyle);
	init('negDegreeGauge1', 'inputNegDegrees1', 'Net angle', scale, 'negDegreesGauge', selectedGaugeStyle);
	init('neg10DegreeGauge1', 'inputNeg10Degrees1', 'Net angle', scale, 'neg10DegreesGauge', selectedGaugeStyle);
};

MLB.gaugeStudy.load = function () {
	var gaugeStyle = document.getElementById('gaugeStyle'),
		btnRedraw = document.getElementById('btnRedraw'),
		btnHourGauge1 = document.getElementById('btnHourGauge1'),
		btnDegreeGauge1 = document.getElementById('btnDegreeGauge1'),
		btnNegHourGauge1 = document.getElementById('btnNegHourGauge1'),
		btnNegDegreeGauge1 = document.getElementById('btnNegDegreeGauge1'),
		btnNeg10DegreeGauge1 = document.getElementById('btnNeg10DegreeGauge1'),
		drawGauges = MLB.gaugeStudy.drawGauges,
		plot = MLB.gaugeLib.plot;

	// event hookups/subscribes
	gaugeStyle.onchange = drawGauges;
	btnRedraw.onclick = drawGauges;

	btnHourGauge1.onclick = function () {
		plot('hourGauge1');
	};
	btnDegreeGauge1.onclick = function () {
		plot('degreeGauge1');
	};
	btnNegHourGauge1.onclick = function () {
		plot('negHourGauge1');
	};
	btnNegDegreeGauge1.onclick = function () {
		plot('negDegreeGauge1');
	};
	btnNeg10DegreeGauge1.onclick = function () {
		plot('neg10DegreeGauge1');
	};

	drawGauges();
};

// end of file