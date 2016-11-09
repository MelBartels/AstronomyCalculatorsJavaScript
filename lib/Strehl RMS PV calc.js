// copyright Mel Bartels, 2016

'use strict';

MLB.StrehlRMSPeakValleyCalc = {};

MLB.StrehlRMSPeakValleyCalc.common = {
    btnCalcFromStrehl: function () {
        return $('[id=btnCalcFromStrehl]');
    },
    btnCalcFromRMS: function () {
        return $('[id=btnCalcFromRMS]');
    },
    btnCalcFromPeakValley: function () {
        return $('[id=btnCalcFromPeakValley]');
    },
    Strehl: function () {
        return $('[name=Strehl]');
    },
    RMS: function () {
        return $('[name=RMS]');
    },
    PeakValley: function () {
        return $('[name=PeakValley]');
    },
    StrehlVal: function () {
        return +this.Strehl().val();
    },
    RMSVal: function () {
        return +this.RMS().val();
    },
    PeakValleyVal: function () {
        return +this.PeakValley().val();
    }
};

MLB.StrehlRMSPeakValleyCalc.calcFromStrehl = function () {
    var common = MLB.StrehlRMSPeakValleyCalc.common,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcRMSFromStrehl = MLB.calcLib.calcRMSFromStrehl,
        calcPVFromRMS = MLB.calcLib.calcPVFromRMS,
        Strehl,
        RMS,
        PeakValley;

    Strehl = common.StrehlVal();
    RMS = calcRMSFromStrehl(Strehl);
    PeakValley = calcPVFromRMS(RMS);
    common.RMS().val(roundToDecimal(RMS, 3));
    common.PeakValley().val(roundToDecimal(PeakValley, 3));
};

MLB.StrehlRMSPeakValleyCalc.calcFromRMS = function () {
    var common = MLB.StrehlRMSPeakValleyCalc.common,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcStrehlFromRMS = MLB.calcLib.calcStrehlFromRMS,
        calcPVFromRMS = MLB.calcLib.calcPVFromRMS,
        Strehl,
        RMS,
        PeakValley;

    RMS = common.RMSVal();
    Strehl = calcStrehlFromRMS(RMS);
    PeakValley = calcPVFromRMS(RMS);
    common.Strehl().val(roundToDecimal(Strehl, 3));
    common.PeakValley().val(roundToDecimal(PeakValley, 3));
};

MLB.StrehlRMSPeakValleyCalc.calcFromPeakValley = function () {
    var common = MLB.StrehlRMSPeakValleyCalc.common,
        roundToDecimal = MLB.sharedLib.roundToDecimal,
        calcRMSFromPV = MLB.calcLib.calcRMSFromPV,
        calcStrehlFromRMS = MLB.calcLib.calcStrehlFromRMS,
        Strehl,
        RMS,
        PeakValley;

    PeakValley = common.PeakValleyVal();
    RMS = calcRMSFromPV(PeakValley);
    Strehl = calcStrehlFromRMS(RMS);
    common.RMS().val(roundToDecimal(RMS, 3));
    common.Strehl().val(roundToDecimal(Strehl, 3));
};

$(window).ready(function () {
    var common = MLB.StrehlRMSPeakValleyCalc.common,
        calcFromStrehl = MLB.StrehlRMSPeakValleyCalc.calcFromStrehl,
        calcFromRMS = MLB.StrehlRMSPeakValleyCalc.calcFromRMS,
        calcFromPeakValley = MLB.StrehlRMSPeakValleyCalc.calcFromPeakValley;

    // event hookups/subscribes
    common.btnCalcFromStrehl().click(calcFromStrehl);
    common.btnCalcFromRMS().click(calcFromRMS);
    common.btnCalcFromPeakValley().click(calcFromPeakValley);

    calcFromStrehl();
});

// end of file