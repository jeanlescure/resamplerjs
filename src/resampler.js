// JavaScript Audio Resampler
// Copyright (C) 2011-2015 Grant Galitz
// Released to Public Domain
export class Resampler {
  constructor(fromSampleRate, toSampleRate, channels, inputBuffer) {
    this.fromSampleRate = +fromSampleRate;
    this.toSampleRate = +toSampleRate;
    this.channels = channels | 0;
    if (typeof inputBuffer !== 'object') {
      throw (new Error('inputBuffer is not an object.'));
    }
    if (!(inputBuffer instanceof Array) && !(inputBuffer instanceof Float32Array) && !(inputBuffer instanceof Float64Array)) {
      throw (new Error('inputBuffer is not an array or a float32 or a float64 array.'));
    }
    this.inputBuffer = inputBuffer;
    this.initialize();
  }

  initialize() {
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
      throw (new Error('Invalid settings specified for the resampler.'));
    }
  }

  compileLinearInterpolationFunction() {
    let toCompile = `var outputOffset = 0;\
    if (bufferLength > 0) {\
    var buffer = this.inputBuffer;\
    var weight = this.lastWeight;\
    var firstWeight = 0;\
    var secondWeight = 0;\
    var sourceOffset = 0;\
    var outputOffset = 0;\
    var outputBuffer = this.outputBuffer;\
    for (; weight < 1; weight += ${this.ratioWeight}) {\
    secondWeight = weight % 1;\
    firstWeight = 1 - secondWeight;`;
    let channel;
    for (channel = 0; channel < this.channels; channel += 1) {
      toCompile += `outputBuffer[outputOffset++] = (this.lastOutput[${channel}] * firstWeight) + (buffer[${channel}] * secondWeight);`;
    }
    toCompile += `}\
    weight -= 1;\
    for (bufferLength -= ${this.channels}, sourceOffset = Math.floor(weight) * ${this.channels}; sourceOffset < bufferLength;) {\
    secondWeight = weight % 1;\
    firstWeight = 1 - secondWeight;`;
    for (channel = 0; channel < this.channels; channel += 1) {
      toCompile += `outputBuffer[outputOffset++] = (buffer[sourceOffset${(channel > 0) ? (' + ' + channel) : ''}] * firstWeight) + (buffer[sourceOffset + ${this.channels + channel}] * secondWeight);`;
    }
    toCompile += `weight += ${this.ratioWeight};\
    sourceOffset = Math.floor(weight) * ${this.channels};\
    }`;
    for (channel = 0; channel < this.channels; channel += 1) {
      toCompile += `this.lastOutput[${channel}] = buffer[sourceOffset++];`;
    }
    toCompile += 'this.lastWeight = weight % 1;\
    }\
    return outputOffset;';
    this.resampler = Function('bufferLength', toCompile);
  }

  compileMultiTapFunction() {
    let toCompile = 'var outputOffset = 0;\
    if (bufferLength > 0) {\
    var buffer = this.inputBuffer;\
    var weight = 0;';
    let channel;
    for (channel = 0; channel < this.channels; channel += 1) {
      toCompile += `var output${channel} = 0;`;
    }
    toCompile += `var actualPosition = 0;\
    var amountToNext = 0;\
    var alreadyProcessedTail = !this.tailExists;\
    this.tailExists = false;\
    var outputBuffer = this.outputBuffer;\
    var currentPosition = 0;\
    do {\
    if (alreadyProcessedTail) {\
    weight = ${this.ratioWeight};`;
    for (channel = 0; channel < this.channels; channel += 1) {
      toCompile += `output${channel} = 0;`;
    }
    toCompile += '} else {\
    weight = this.lastWeight;';
    for (channel = 0; channel < this.channels; channel += 1) {
      toCompile += `output${channel} = this.lastOutput[${channel}];`;
    }
    toCompile += 'alreadyProcessedTail = true;\
    }\
    while (weight > 0 && actualPosition < bufferLength) {\
    amountToNext = 1 + actualPosition - currentPosition;\
    if (weight >= amountToNext) {';
    for (channel = 0; channel < this.channels; channel += 1) {
      toCompile += `output${channel} += buffer[actualPosition++] * amountToNext;`;
    }
    toCompile += 'currentPosition = actualPosition;\
    weight -= amountToNext;\
    } else {';
    for (channel = 0; channel < this.channels; channel += 1) {
      toCompile += `output${channel} += buffer[actualPosition${(channel > 0) ? (' + ' + channel) : ''}] * weight;`;
    }
    toCompile += 'currentPosition += weight;\
    weight = 0;\
    break;\
    }\
    }\
    if (weight <= 0) {';
    for (channel = 0; channel < this.channels; channel += 1) {
      toCompile += `outputBuffer[outputOffset++] = output${channel} / ${this.ratioWeight};`;
    }
    toCompile += '} else {\
    this.lastWeight = weight;';
    for (channel = 0; channel < this.channels; channel += 1) {
      toCompile += `this.lastOutput[${channel}] = output${channel};`;
    }
    toCompile += 'this.tailExists = true;\
    break;\
    }\
    } while (actualPosition < bufferLength);\
    }\
    return outputOffset;';
    this.resampler = Function('bufferLength', toCompile);
  }

  bypassResampler(upTo) {
    return upTo;
  }

  initializeBuffers() {
    const outputBufferSize = (Math.ceil(((this.inputBuffer.length * this.toSampleRate) / this.fromSampleRate / this.channels) * 1.000000476837158203125) * this.channels) + this.channels;
    try {
      this.outputBuffer = new Float32Array(outputBufferSize);
      this.lastOutput = new Float32Array(this.channels);
    } catch (error) {
      this.outputBuffer = [];
      this.lastOutput = [];
    }
  }
}

export default Resampler;
