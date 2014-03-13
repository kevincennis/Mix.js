# Mix.js

[![travis](https://travis-ci.org/kevincennis/Mix.js.png)](https://travis-ci.org/kevincennis/Mix.js)

Multitrack mixing with the Web Audio API.

Documentation (and lots of cleanup) forthcoming.

### Demo

[kevvv.in/mix](http://kevvv.in/mix)

### Getting started (for Developers)

##### Install Grunt
`npm install -g grunt-cli` (may require `sudo`)
##### Install Node dependencies
`npm install`
##### Build & Test
`npm test` or `grunt`
##### Start a local webserver at `http://localhost:8888`
`npm start`

### Usage (for... Users)

* Download `mix.js.zip` from the [Releases](https://github.com/kevincennis/Mix.js/releases) page and unzip it
* Put your own audio (mono mp3 or wav) in the `/sounds` directory
* Edit `mix.json` to reflect your track names and audio URLs
* Copy the directory to your webserver

To save a mix, open the dev tools in your browser and enter `JSON.stringify(App.mix.toJSON(), null, ' ')`
and copy the output into `mix.json`.

### Contributing

Pull requests are completely welcome and appreciated. Before submitting, please make sure that your 
code conforms to the [Idiomatic.js](https://github.com/rwaldron/idiomatic.js/) style guide.

### Tests

Unfotunately, PhantomJS doesn't currently support the Web Audio API, which makes meaningful testing
for most of Mix.js pretty much impossible. That said, if you write code which *can* be tested, please
submit tests with your pull request.

### Bugs

Bugs should be filed on this repo's [Issues page](https://github.com/kevincennis/Mix.js/issues). Please
include any relevant details (browser, OS, etc.) as well as steps to reproduce.
