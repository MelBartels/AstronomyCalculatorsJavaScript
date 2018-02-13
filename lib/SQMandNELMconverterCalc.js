// copyright Mel Bartels, 2012-2018

'use strict';

MLB.SQMandNELMconverterCalc = {};

MLB.SQMandNELMconverterCalc.convertSQMtoNELM = function () {
	var decimals = 1,
	    SQM = +$('input[name=SQMin]').val(),
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		SQMtoNELMconverter = MLB.calcLib.SQMtoNELMconverter;

	$('input[name=NELMout]').val(roundToDecimal(SQMtoNELMconverter(SQM), decimals));
};

MLB.SQMandNELMconverterCalc.convertNELMtoSQM = function () {
	var decimals = 1,
	    NELM = +$('input[name=NELMin]').val(),
		roundToDecimal = MLB.sharedLib.roundToDecimal,
		NELMtoSQMconverter = MLB.calcLib.NELMtoSQMconverter;

	$('input[name=SQMout]').val(roundToDecimal(NELMtoSQMconverter(NELM), decimals));
};

$(window).ready(function () {
	var btnConvertSQMtoNELM = $('#btnConvertSQMtoNELM')[0],
		convertSQMtoNELM = MLB.SQMandNELMconverterCalc.convertSQMtoNELM,
	    btnConvertNELMtoSQM = $('#btnConvertNELMtoSQM')[0],
		convertNELMtoSQM = MLB.SQMandNELMconverterCalc.convertNELMtoSQM;

	// event hookups/subscribes
	btnConvertSQMtoNELM.onclick = function () {
		convertSQMtoNELM();
	};
	btnConvertNELMtoSQM.onclick = function () {
		convertNELMtoSQM();
	};

	convertSQMtoNELM();
	convertNELMtoSQM();
});

// end of file