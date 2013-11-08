function FakeContext() {
  this.sampleRate = 44100;
}

FakeContext.prototype.createGain = function() {
  return {
    connect: function(){},
    gain: {
      value: 0
    }
  };
};

FakeContext.prototype.createScriptProcessor = function() {
  return {
    connect: function(){}
  };
};

FakeContext.prototype.createAnalyser = function() {
  return {
    connect: function(){}
  };
};

FakeContext.prototype.createChannelSplitter = function() {
  return {
    connect: function(){}
  };
};

window.AudioContext = (
  window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  FakeContext
);
