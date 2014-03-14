// copyright Mel Bartels, 2012-2014

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

MLB.SQMandNELMconverterCalc.load = function () {
	var btnConvertSQMtoNELM = document.getElementById('btnConvertSQMtoNELM'),
		convertSQMtoNELM = MLB.SQMandNELMconverterCalc.convertSQMtoNELM,
	    btnConvertNELMtoSQM = document.getElementById('btnConvertNELMtoSQM'),
		convertNELMtoSQM = MLB.SQMandNELMconverterCalc.convertNELMtoSQM;

		// event hookups/subscribes
	btnConvertSQMtoNELM.onclick = function () {
		convertSQMtoNELM();
	};

	convertSQMtoNELM();
	convertNELMtoSQM();
};

// end of file