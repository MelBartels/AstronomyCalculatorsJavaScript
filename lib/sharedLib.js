// copyright Mel Bartels, 2011-2020
// see sharedLib unitTests.htm for unit tests
// turn on jslint's Tolerate ++ and --

'use strict';

// error handling

//window.onerror = errorHandlerUsingAlert;

function errorHandlerUsingAlert(msg, url, lno) {
    var alertmsg = "There has been an internal error. Sorry for the inconvenience.";
    alertmsg += "\n\nPlease refresh this page and this error should go away.";
    alertmsg += "\n\nIf the problem persists please contact the author.";

    alert(alertmsg);

    return (true);
}

function errorHandlerUsingStatus(msg, url, lno) {
    window.status = "There were errors getting this page. Try refreshing this page.";

    return (true);
}

// helpers

var MLB = {};
MLB.sharedLib = {};

MLB.sharedLib.withinRange = function (actual, expected, range) {
    return actual <= expected + range && actual >= expected - range;
};

MLB.sharedLib.singleWordsNotToBeCapitalized = [
    'a',
    'aboard',
    'about',
    'above',
    'absent',
    'across',
    'after',
    'against',
    'along',
    'alongside',
    'also',
    'although',
    'amid',
    'amidst',
    'among',
    'amongst',
    'an',
    'and',
    'around',
    'as',
    'aslant',
    'astride',
    'at',
    'atop',
    'barring',
    'because',
    'before',
    'behind',
    'below',
    'beneath',
    'beside',
    'besides',
    'between',
    'beyond',
    'both',
    'but',
    'by',
    'despite',
    'down',
    'during',
    'either',
    'except',
    'failing',
    'following',
    'for',
    'from',
    'in',
    'inside',
    'into',
    'like',
    'merry',
    'mid',
    'minus',
    'near',
    'neither',
    'next',
    'nor',
    'notwithstanding',
    'of',
    'off',
    'on',
    'onto',
    'or',
    'opposite',
    'outside',
    'over',
    'past',
    'plus',
    'regarding',
    'round',
    'save',
    'since',
    'so',
    'than',
    'the',
    'through',
    'throughout',
    'till',
    'times',
    'to',
    'toward',
    'towards',
    'under',
    'underneath',
    'unlike',
    'until',
    'up',
    'upon',
    'via',
    'when',
    'while',
    'with',
    'within',
    'without'
];

// ensures that every word is capitalized except for words above
MLB.sharedLib.toTitleCase = function (str) {
    var splitValues = str.split(/(\s|\.)/),
        length = splitValues.length,
        ix,
        value,
        result = '',
        singleWordsNotToBeCapitalized = MLB.sharedLib.singleWordsNotToBeCapitalized;

    for (ix = 0; ix < length; ix++) {
        value = splitValues[ix];
        if (singleWordsNotToBeCapitalized.indexOf(value.toLowerCase()) > -1) {
            result += value.toLowerCase();
        } else {
            result += value.substr(0, 1).toUpperCase() + value.substr(1);
        }
    }
    return result;
};

// ensures that only the first word in each sentence is capitalized; doesn't lower case any words
MLB.sharedLib.toSentenceCase = function (str) {
    var splitValues = str.split(/(\.)/),
        length = splitValues.length,
        ix,
        value,
        result = '';

    for (ix = 0; ix < length; ix++) {
        value = splitValues[ix];
        result += value.substr(0, 1).toUpperCase() + value.substr(1);
    }
    return result;
};

MLB.sharedLib.capitalizeFirstLetterOnly = function (word) {
    return word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase();
};

MLB.sharedLib.int = function (n) {
    return (n | 0) + (n % -1 < 0 ? -1 : 0);
};

MLB.sharedLib.isInt = function (n) {
    return n === +n && n === (n | 0);
};

MLB.sharedLib.isFloat = function (n) {
    return n === +n && n !== (n | 0);
};

MLB.sharedLib.resolveNumberToPrecision = function (number, precision) {
    var absNumber, absNumberToPrecision, int = MLB.sharedLib.int;

    absNumber = number < 0
        ? -number
        : number;
    absNumberToPrecision = int((absNumber + precision / 2 + 0.000000000000001) / precision) * precision;
    if (number >= 0) {
        return absNumberToPrecision;
    }
    return -absNumberToPrecision;
};

MLB.sharedLib.limitDecimalPlaces = function (number, decimalPlaces) {
    var split = number.toString().split('.');

    if (Math.abs(number) < Math.pow(10, -decimalPlaces)) {
        return '0';
    }
    if (split.length > 1) {
        return split[0] + '.' + split[1].substr(0, decimalPlaces);
    }
    return number.toString();
};

MLB.sharedLib.roundToDecimal = function (number, decimalPlaces) {
    var resolveNumberToPrecision = MLB.sharedLib.resolveNumberToPrecision,
        limitDecimalPlaces = MLB.sharedLib.limitDecimalPlaces;

    return limitDecimalPlaces(resolveNumberToPrecision(number, Math.pow(10, -decimalPlaces)), decimalPlaces);
};

MLB.sharedLib.log10 = function (n) {
    return Math.log(n) / Math.log(10);
};

MLB.sharedLib.cot = function (n) {
    return 1 / Math.tan(n);
};

MLB.sharedLib.point = function (width, height) {
    return {x: Math.round(width), y: Math.round(height)};
};

MLB.sharedLib.rect = function (x, y, width, height) {
    return {
        x: x,
        y: y,
        width: width,
        height: height,
        endX: x + width,
        endY: y + height
    };
};

MLB.sharedLib.drawLine = function (context, strokeStyle, width, point1, point2) {
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.strokeStyle = strokeStyle;
    context.lineWidth = width;
    context.stroke();
};

MLB.sharedLib.drawRect = function (context, strokeStyle, lineWidth, rect) {
    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
    context.strokeRect(Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height));
};

MLB.sharedLib.drawCircle = function (context, center, radius, width, strokeStyle) {
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    context.strokeStyle = strokeStyle;
    context.lineWidth = width;
    context.stroke();
};

MLB.sharedLib.fillRect = function (context, fillStyle, rect) {
    context.fillStyle  = fillStyle;
    context.fillRect(Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height));
};

MLB.sharedLib.fillCircle = function (context, center, radius, fillStyle) {
    context.fillStyle = fillStyle;
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
    context.fill();
};

MLB.sharedLib.fillEllipse = function (context, color, lineWidth, x, y, stretchX, stretchY, startAngle, endAngle) {
    var angle,
        angleIncrement = Math.PI / 180;

    for (angle = startAngle; angle < endAngle; angle += angleIncrement) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + Math.cos(angle) * stretchX, y + Math.sin(angle) * stretchY);
        context.lineWidth = lineWidth;
        context.strokeStyle = color;
        context.stroke();
        context.closePath();
      }
};

MLB.sharedLib.fillPolygon = function (context, points, fillStyle) {
    var ix, length;

    context.fillStyle = fillStyle;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    length = points.length;
    for (ix = 1; ix < length; ix++) {
        context.lineTo(points[ix].x, points[ix].y);
    }
    context.closePath();
    context.fill();
};

MLB.sharedLib.clearCanvas = function (canvas) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
};

MLB.sharedLib.drawHorizDimen = function (context, text, dimensionY, dimensionLeftX, dimensionRightX, markHeight, lineWidth, strokeStyle) {
    var point = MLB.sharedLib.point,
        drawLine = MLB.sharedLib.drawLine,
        dimensionRightPt = point(dimensionRightX, dimensionY),
        dimensionLeftPt = point(dimensionLeftX, dimensionY);

    drawLine(context, strokeStyle, lineWidth, dimensionLeftPt, dimensionRightPt);
    drawLine(context, strokeStyle, lineWidth, point(dimensionLeftPt.x, dimensionLeftPt.y - markHeight), point(dimensionLeftPt.x, dimensionLeftPt.y + markHeight));
    drawLine(context, strokeStyle, lineWidth, point(dimensionRightPt.x, dimensionRightPt.y - markHeight), point(dimensionRightPt.x, dimensionRightPt.y + markHeight));
    context.fillStyle = strokeStyle;
    context.fillText(text, dimensionLeftPt.x + markHeight, dimensionY - markHeight);
};

MLB.sharedLib.drawVertDimen = function (context, text, dimensionX, dimensionBottomY, dimensionTopY, markHeight, lineWidth, strokeStyle) {
    var point = MLB.sharedLib.point,
        drawLine = MLB.sharedLib.drawLine,
        dimensionTopPt = point(dimensionX, dimensionTopY),
        dimensionBottomPt = point(dimensionX, dimensionBottomY);

    drawLine(context, strokeStyle, lineWidth, dimensionBottomPt, dimensionTopPt);
    drawLine(context, strokeStyle, lineWidth, point(dimensionBottomPt.x - markHeight, dimensionBottomPt.y), point(dimensionBottomPt.x + markHeight, dimensionBottomPt.y));
    drawLine(context, strokeStyle, lineWidth, point(dimensionTopPt.x - markHeight, dimensionTopPt.y), point(dimensionTopPt.x + markHeight, dimensionTopPt.y));
    context.fillStyle = strokeStyle;
    context.fillText(text, dimensionBottomPt.x + markHeight, (dimensionBottomY + dimensionTopY) / 2);
};

// 'a' is opaqueness with 255 or 0xff opaque, 0 transparent
MLB.sharedLib.setPixel = function (imageData, x, y, r, g, b, a) {
    var ix = (x + y * imageData.width) * 4;
    imageData.data[ix] = r;
    imageData.data[ix + 1] = g;
    imageData.data[ix + 2] = b;
    imageData.data[ix + 3] = a;
};

MLB.sharedLib.getDistance = function (pointA, pointB) {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
};

MLB.sharedLib.seriesLabel = function (label) {
    return {
        label: label,
        showMarker: false
    };
};

MLB.sharedLib.seriesLabelDiamondMarker = function (label) {
    return {
        label: label,
        markerOptions: {
            style: 'dimaond'
        }
    };
};

MLB.sharedLib.buildCanvasElement = function (id, width, height) {
    $('#' + id).remove();

    return $('<canvas/>', {
        'id': id
    }).prop({
        width: width,
        height: height
    });
};

// unit of measurements constants

MLB.sharedLib.uom = {
    sidRate: 1.002737909,

    //JD on Greenwich Jan 1 2000 noon
    JD2000: 2451545,
    // number of seconds since Jan 1 1970
    secondsAtYr2000: 946627200,
    daysInYear: 365.25,

    // 1 revolution: 2 Pi Radians: 360 Degrees: 24 Hours
    oneRev: Math.PI * 2,
    threeQtrsRev: Math.PI * 3 / 2,
    halfRev: Math.PI,
    qtrRev: Math.PI / 2,

    hrToRev: 1 / 24,
    hrToRad: Math.PI / 12,
    minToRev: 1 / 1440,
    minToRad: Math.PI / 720,
    secToRev: 1 / 86400,
    secToRad: Math.PI / 43200,

    degToRev: 1 / 360,
    degToRad: Math.PI / 180,
    arcminToRev: 1 / 21600,
    arcminToRad: Math.PI / 10800,
    arcsecToRev: 1 / 1296000,
    arcsecToRad: Math.PI / 648000,

    // based on comparison of circular areas; area change from arc-seconds to arc-minutes is 30*30*Pi = 2827.4334
    sqrArcminToSqrArcsec: 30 * 30 * Math.PI,
    // using the above value to get magnitude change; if using a square area (not circular) then the value is 8.89075625191822
    sqrArcminToSqrArcsecCircularMagnitudeChange: 8.628480955333647,
    sqrArcminToSqrArcsecSquareMagnitudeChange: 8.89075625191822,

    plus: '+',
    minus: '-',
    deg: '°',
    min: '\'',
    sec: '"'
};

// regex library http://www.regexlib.com/DisplayPatterns.aspx?cattabindex=2&categoryId=3&AspxAutoDetectCookieSupport=1
// matches 1, 34.5, .3, 5., 10.5:1, 10.5:2 (returns 5.25), 10 2 (returns 5)
MLB.sharedLib.getReduction = function (val) {
    var numbers = val.match(/([0-9]+\.[0-9]*)|([0-9]*\.[0-9]+)|([0-9]+)\s*/g),
        numbersLength = numbers === null
            ? 0
            : numbers.length,
        denominator,
        reduction;

    if (numbersLength === 1) {
        reduction = numbers[0];
    } else if (numbersLength === 2) {
        denominator = parseFloat(numbers[1]);
        // check for divide by 0
        if (denominator === 0) {
            reduction = undefined;
        } else {
            reduction = numbers[0] / denominator;
        }
    } else {
        reduction = undefined;
    }
    return reduction;
};

MLB.sharedLib.findMatchingLocalStorageItems = function (stringMatch) {
  var key = new RegExp(stringMatch + '*'),
      item,
      results = [];

  for (item in localStorage) {
    if (localStorage.hasOwnProperty(item)) {
      if (item.match(key) || (!key && typeof item === 'string')) {
        results.push(item);
      }
    }
  }
  return results;
}

MLB.sharedLib.removeMatchingLocalStorageItems = function (stringMatch) {
    var findMatchingLocalStorageItems = MLB.sharedLib.findMatchingLocalStorageItems,
        items = findMatchingLocalStorageItems(stringMatch),
        itemsLength = items.length,
        ix;

    for (ix = 0; ix < itemsLength; ix +=1) {
        localStorage.removeItem(items[ix]);
    }
};

// end of file
