# Mix.js

[![travis](https://travis-ci.org/kevincennis/Mix.js.png)](https://travis-ci.org/kevincennis/Mix.js)

Multitrack mixing with the Web Audio API.

Documentation (and lots of cleanup) forthcoming.

### Demo

[kevvv.in/mix](http://kevvv.in/mix)

### Getting started

##### Install Grunt
`npm install -g grunt-cli` (may require `sudo`)
##### Install Node dependencies
`npm install`
##### Build & Test
`npm test` or `grunt`
##### Start a local webserver at `http://localhost:8888`
`npm start`

### Usage

* Make sure you have git and Node.js installed (obvs)
* Clone the repo
* Put your own audio (mono mp3 or wav) in the `/public/sounds` directory
* Edit `public/mix.json` to reflect your track names and audio URLs
* From the terminal, run `npm install -g grunt-cli`
* Run `npm install`
* Run `npm test`
* Copy the `public` directory to your webserver

To save a mix, open the dev tools in your browser and enter `JSON.stringify(App.mix.toJSON(), null, ' ')`
and copy the output into `public/mix.json`.
