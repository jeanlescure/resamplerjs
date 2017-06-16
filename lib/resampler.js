(function(e, a) { for(var i in a) e[i] = a[i]; }(window, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// JavaScript Audio Resampler
// Copyright (C) 2011-2015 Grant Galitz
// Released to Public Domain
var Resampler = exports.Resampler = function () {
  function Resampler(fromSampleRate, toSampleRate, channels, inputBuffer) {
    _classCallCheck(this, Resampler);

    this.fromSampleRate = +fromSampleRate;
    this.toSampleRate = +toSampleRate;
    this.channels = channels | 0;
    if ((typeof inputBuffer === 'undefined' ? 'undefined' : _typeof(inputBuffer)) !== 'object') {
      throw new Error('inputBuffer is not an object.');
    }
    if (!(inputBuffer instanceof Array) && !(inputBuffer instanceof Float32Array) && !(inputBuffer instanceof Float64Array)) {
      throw new Error('inputBuffer is not an array or a float32 or a float64 array.');
    }
    this.inputBuffer = inputBuffer;
    this.initialize();
  }

  _createClass(Resampler, [{
    key: 'initialize',
    value: function initialize() {
      if (this.fromSampleRate > 0 && this.toSampleRate > 0 && this.channels > 0) {
        if (this.fromSampleRate === this.toSampleRate) {
          this.resampler = this.bypassResampler; // Resampler just returns what was passed through.
          this.ratioWeight = 1;
          this.outputBuffer = this.inputBuffer;
        } else {
          this.ratioWeight = this.fromSampleRate / this.toSampleRate;
          if (this.fromSampleRate < this.toSampleRate) {
            this.compileLinearInterpolationFunction();
            this.lastWeight = 1;
          } else {
            this.compileMultiTapFunction();
            this.tailExists = false;
            this.lastWeight = 0;
          }
          this.initializeBuffers();
        }
      } else {
        throw new Error('Invalid settings specified for the resampler.');
      }
    }
  }, {
    key: 'compileLinearInterpolationFunction',
    value: function compileLinearInterpolationFunction() {
      var toCompile = 'var outputOffset = 0;    if (bufferLength > 0) {    var buffer = this.inputBuffer;    var weight = this.lastWeight;    var firstWeight = 0;    var secondWeight = 0;    var sourceOffset = 0;    var outputOffset = 0;    var outputBuffer = this.outputBuffer;    for (; weight < 1; weight += ' + this.ratioWeight + ') {    secondWeight = weight % 1;    firstWeight = 1 - secondWeight;';
      var channel = void 0;
      for (channel = 0; channel < this.channels; channel += 1) {
        toCompile += 'outputBuffer[outputOffset++] = (this.lastOutput[' + channel + '] * firstWeight) + (buffer[' + channel + '] * secondWeight);';
      }
      toCompile += '}    weight -= 1;    for (bufferLength -= ' + this.channels + ', sourceOffset = Math.floor(weight) * ' + this.channels + '; sourceOffset < bufferLength;) {    secondWeight = weight % 1;    firstWeight = 1 - secondWeight;';
      for (channel = 0; channel < this.channels; channel += 1) {
        toCompile += 'outputBuffer[outputOffset++] = (buffer[sourceOffset' + (channel > 0 ? ' + ' + channel : '') + '] * firstWeight) + (buffer[sourceOffset + ' + (this.channels + channel) + '] * secondWeight);';
      }
      toCompile += 'weight += ' + this.ratioWeight + ';    sourceOffset = Math.floor(weight) * ' + this.channels + ';    }';
      for (channel = 0; channel < this.channels; channel += 1) {
        toCompile += 'this.lastOutput[' + channel + '] = buffer[sourceOffset++];';
      }
      toCompile += 'this.lastWeight = weight % 1;\
    }\
    return outputOffset;';
      this.resampler = Function('bufferLength', toCompile);
    }
  }, {
    key: 'compileMultiTapFunction',
    value: function compileMultiTapFunction() {
      var toCompile = 'var outputOffset = 0;\
    if (bufferLength > 0) {\
    var buffer = this.inputBuffer;\
    var weight = 0;';
      var channel = void 0;
      for (channel = 0; channel < this.channels; channel += 1) {
        toCompile += 'var output' + channel + ' = 0;';
      }
      toCompile += 'var actualPosition = 0;    var amountToNext = 0;    var alreadyProcessedTail = !this.tailExists;    this.tailExists = false;    var outputBuffer = this.outputBuffer;    var currentPosition = 0;    do {    if (alreadyProcessedTail) {    weight = ' + this.ratioWeight + ';';
      for (channel = 0; channel < this.channels; channel += 1) {
        toCompile += 'output' + channel + ' = 0;';
      }
      toCompile += '} else {\
    weight = this.lastWeight;';
      for (channel = 0; channel < this.channels; channel += 1) {
        toCompile += 'output' + channel + ' = this.lastOutput[' + channel + '];';
      }
      toCompile += 'alreadyProcessedTail = true;\
    }\
    while (weight > 0 && actualPosition < bufferLength) {\
    amountToNext = 1 + actualPosition - currentPosition;\
    if (weight >= amountToNext) {';
      for (channel = 0; channel < this.channels; channel += 1) {
        toCompile += 'output' + channel + ' += buffer[actualPosition++] * amountToNext;';
      }
      toCompile += 'currentPosition = actualPosition;\
    weight -= amountToNext;\
    } else {';
      for (channel = 0; channel < this.channels; channel += 1) {
        toCompile += 'output' + channel + ' += buffer[actualPosition' + (channel > 0 ? ' + ' + channel : '') + '] * weight;';
      }
      toCompile += 'currentPosition += weight;\
    weight = 0;\
    break;\
    }\
    }\
    if (weight <= 0) {';
      for (channel = 0; channel < this.channels; channel += 1) {
        toCompile += 'outputBuffer[outputOffset++] = output' + channel + ' / ' + this.ratioWeight + ';';
      }
      toCompile += '} else {\
    this.lastWeight = weight;';
      for (channel = 0; channel < this.channels; channel += 1) {
        toCompile += 'this.lastOutput[' + channel + '] = output' + channel + ';';
      }
      toCompile += 'this.tailExists = true;\
    break;\
    }\
    } while (actualPosition < bufferLength);\
    }\
    return outputOffset;';
      this.resampler = Function('bufferLength', toCompile);
    }
  }, {
    key: 'bypassResampler',
    value: function bypassResampler(upTo) {
      return upTo;
    }
  }, {
    key: 'initializeBuffers',
    value: function initializeBuffers() {
      var outputBufferSize = Math.ceil(this.inputBuffer.length * this.toSampleRate / this.fromSampleRate / this.channels * 1.000000476837158203125) * this.channels + this.channels;
      try {
        this.outputBuffer = new Float32Array(outputBufferSize);
        this.lastOutput = new Float32Array(this.channels);
      } catch (error) {
        this.outputBuffer = [];
        this.lastOutput = [];
      }
    }
  }]);

  return Resampler;
}();

exports.default = Resampler;

/***/ })
/******/ ])));