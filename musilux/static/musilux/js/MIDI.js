/*
	----------------------------------------------------------
	MIDI.audioDetect : 0.3.2 : 2015-03-26
	----------------------------------------------------------
	https://github.com/mudcube/MIDI.js
	----------------------------------------------------------
	Probably, Maybe, No... Absolutely!
	Test to see what types of <audio> MIME types are playable by the browser.
	----------------------------------------------------------
*/

if (typeof MIDI === 'undefined') MIDI = {};

(function(root) { 'use strict';

	let supports = {}; // object of supported file types
	let pending = 0; // pending file types to process
	let canPlayThrough = function (src) { // check whether format plays through
		pending ++;
		let body = document.body;
		let audio = new Audio();
		let mime = src.split(';')[0];
		audio.id = 'audio';
		audio.setAttribute('preload', 'auto');
		audio.setAttribute('audiobuffer', true);
		audio.addEventListener('error', function() {
			body.removeChild(audio);
			supports[mime] = false;
			pending --;
		}, false);
		audio.addEventListener('canplaythrough', function() {
			body.removeChild(audio);
			supports[mime] = true;
			pending --;
		}, false);
		audio.src = 'data:' + src;
		body.appendChild(audio);
	};

	root.audioDetect = function(onsuccess) {
		/// detect jazz-midi plugin
		if (navigator.requestMIDIAccess) {
			let isNative = Function.prototype.toString.call(navigator.requestMIDIAccess).indexOf('[native code]');
			if (isNative) { // has native midiapi support
				supports['webmidi'] = true;
			} else { // check for jazz plugin midiapi support
				for (let n = 0; navigator.plugins.length > n; n ++) {
					let plugin = navigator.plugins[n];
					if (plugin.name.indexOf('Jazz-Plugin') >= 0) {
						supports['webmidi'] = true;
					}
				}
			}
		}

		/// check whether <audio> tag is supported
		if (typeof(Audio) === 'undefined') {
			return onsuccess({});
		} else {
			supports['audiotag'] = true;
		}

		/// check for webaudio api support
		if (window.AudioContext || window.webkitAudioContext) {
			supports['webaudio'] = true;
		}

		/// check whether canPlayType is supported
		let audio = new Audio();
		if (typeof(audio.canPlayType) === 'undefined') {
			return onsuccess(supports);
		}

		/// see what we can learn from the browser
		let vorbis = audio.canPlayType('audio/ogg; codecs="vorbis"');
		vorbis = (vorbis === 'probably' || vorbis === 'maybe');
		let mpeg = audio.canPlayType('audio/mpeg');
		mpeg = (mpeg === 'probably' || mpeg === 'maybe');
		// maybe nothing is supported
		if (!vorbis && !mpeg) {
			onsuccess(supports);
			return;
		}

		/// or maybe something is supported
		if (vorbis) canPlayThrough('audio/ogg;base64,T2dnUwACAAAAAAAAAADqnjMlAAAAAOyyzPIBHgF2b3JiaXMAAAAAAUAfAABAHwAAQB8AAEAfAACZAU9nZ1MAAAAAAAAAAAAA6p4zJQEAAAANJGeqCj3//////////5ADdm9yYmlzLQAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMTAxMTAxIChTY2hhdWZlbnVnZ2V0KQAAAAABBXZvcmJpcw9CQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBACAAAAYRqF1TCqDEEPKQ4QUY9AzoxBDDEzGHGNONKQMMogzxZAyiFssLqgQBKEhKwKAKAAAwBjEGGIMOeekZFIi55iUTkoDnaPUUcoolRRLjBmlEluJMYLOUeooZZRCjKXFjFKJscRUAABAgAMAQICFUGjIigAgCgCAMAYphZRCjCnmFHOIMeUcgwwxxiBkzinoGJNOSuWck85JiRhjzjEHlXNOSuekctBJyaQTAAAQ4AAAEGAhFBqyIgCIEwAwSJKmWZomipamiaJniqrqiaKqWp5nmp5pqqpnmqpqqqrrmqrqypbnmaZnmqrqmaaqiqbquqaquq6nqrZsuqoum65q267s+rZru77uqapsm6or66bqyrrqyrbuurbtS56nqqKquq5nqq6ruq5uq65r25pqyq6purJtuq4tu7Js664s67pmqq5suqotm64s667s2rYqy7ovuq5uq7Ks+6os+75s67ru2rrwi65r66os674qy74x27bwy7ouHJMnqqqnqq7rmarrqq5r26rr2rqmmq5suq4tm6or26os67Yry7aumaosm64r26bryrIqy77vyrJui67r66Ys67oqy8Lu6roxzLat+6Lr6roqy7qvyrKuu7ru+7JuC7umqrpuyrKvm7Ks+7auC8us27oxuq7vq7It/KosC7+u+8Iy6z5jdF1fV21ZGFbZ9n3d95Vj1nVhWW1b+V1bZ7y+bgy7bvzKrQvLstq2scy6rSyvrxvDLux8W/iVmqratum6um7Ksq/Lui60dd1XRtf1fdW2fV+VZd+3hV9pG8OwjK6r+6os68Jry8ov67qw7MIvLKttK7+r68ow27qw3L6wLL/uC8uq277v6rrStXVluX2fsSu38QsAABhwAAAIMKEMFBqyIgCIEwBAEHIOKQahYgpCCKGkEEIqFWNSMuakZM5JKaWUFEpJrWJMSuaclMwxKaGUlkopqYRSWiqlxBRKaS2l1mJKqcVQSmulpNZKSa2llGJMrcUYMSYlc05K5pyUklJrJZXWMucoZQ5K6iCklEoqraTUYuacpA46Kx2E1EoqMZWUYgupxFZKaq2kFGMrMdXUWo4hpRhLSrGVlFptMdXWWqs1YkxK5pyUzDkqJaXWSiqtZc5J6iC01DkoqaTUYiopxco5SR2ElDLIqJSUWiupxBJSia20FGMpqcXUYq4pxRZDSS2WlFosqcTWYoy1tVRTJ6XFklKMJZUYW6y5ttZqDKXEVkqLsaSUW2sx1xZjjqGkFksrsZWUWmy15dhayzW1VGNKrdYWY40x5ZRrrT2n1mJNMdXaWqy51ZZbzLXnTkprpZQWS0oxttZijTHmHEppraQUWykpxtZara3FXEMpsZXSWiypxNhirLXFVmNqrcYWW62ltVprrb3GVlsurdXcYqw9tZRrrLXmWFNtBQAADDgAAASYUAYKDVkJAEQBAADGMMYYhEYpx5yT0ijlnHNSKucghJBS5hyEEFLKnINQSkuZcxBKSSmUklJqrYVSUmqttQIAAAocAAACbNCUWByg0JCVAEAqAIDBcTRNFFXVdX1fsSxRVFXXlW3jVyxNFFVVdm1b+DVRVFXXtW3bFn5NFFVVdmXZtoWiqrqybduybgvDqKqua9uybeuorqvbuq3bui9UXVmWbVu3dR3XtnXd9nVd+Bmzbeu2buu+8CMMR9/4IeTj+3RCCAAAT3AAACqwYXWEk6KxwEJDVgIAGQAAgDFKGYUYM0gxphhjTDHGmAAAgAEHAIAAE8pAoSErAoAoAADAOeecc84555xzzjnnnHPOOeecc44xxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY0wAwE6EA8BOhIVQaMhKACAcAABACCEpKaWUUkoRU85BSSmllFKqFIOMSkoppZRSpBR1lFJKKaWUIqWgpJJSSimllElJKaWUUkoppYw6SimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaVUSimllFJKKaWUUkoppRQAYPLgAACVYOMMK0lnhaPBhYasBAByAwAAhRiDEEJpraRUUkolVc5BKCWUlEpKKZWUUqqYgxBKKqmlklJKKbXSQSihlFBKKSWUUkooJYQQSgmhlFRCK6mEUkoHoYQSQimhhFRKKSWUzkEoIYUOQkmllNRCSB10VFIpIZVSSiklpZQ6CKGUklJLLZVSWkqpdBJSKamV1FJqqbWSUgmhpFZKSSWl0lpJJbUSSkklpZRSSymFVFJJJYSSUioltZZaSqm11lJIqZWUUkqppdRSSiWlkEpKqZSSUmollZRSaiGVlEpJKaTUSimlpFRCSamlUlpKLbWUSkmptFRSSaWUlEpJKaVSSksppRJKSqmllFpJKYWSUkoplZJSSyW1VEoKJaWUUkmptJRSSymVklIBAEAHDgAAAUZUWoidZlx5BI4oZJiAAgAAQABAgAkgMEBQMApBgDACAQAAAADAAAAfAABHARAR0ZzBAUKCwgJDg8MDAAAAAAAAAAAAAACAT2dnUwAEAAAAAAAAAADqnjMlAgAAADzQPmcBAQA=');
		if (mpeg) canPlayThrough('audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');

		/// lets find out!
		let time = (new Date()).getTime();
		let interval = window.setInterval(function() {
			let now = (new Date()).getTime();
			let maxExecution = now - time > 5000;
			if (!pending || maxExecution) {
				window.clearInterval(interval);
				onsuccess(supports);
			}
		}, 1);
	};

})(MIDI);
/*
	----------------------------------------------------------
	GeneralMIDI
	----------------------------------------------------------
*/

(function(root) { 'use strict';

	root.GM = (function(arr) {
		let clean = function(name) {
			return name.replace(/[^a-z0-9 ]/gi, '').replace(/[ ]/g, '_').toLowerCase();
		};
		let res = {
			byName: { },
			byId: { },
			byCategory: { }
		};
		for (let key in arr) {
			let list = arr[key];
			for (let n = 0, length = list.length; n < length; n++) {
				let instrument = list[n];
				if (!instrument) continue;
				let num = parseInt(instrument.substr(0, instrument.indexOf(' ')), 10);
				instrument = instrument.replace(num + ' ', '');
				res.byId[--num] =
				res.byName[clean(instrument)] =
				res.byCategory[clean(key)] = {
					id: clean(instrument),
					instrument: instrument,
					number: num,
					category: key
				};
			}
		}
		return res;
	})({
		'Piano': ['1 Acoustic Grand Piano', '2 Bright Acoustic Piano', '3 Electric Grand Piano', '4 Honky-tonk Piano', '5 Electric Piano 1', '6 Electric Piano 2', '7 Harpsichord', '8 Clavinet'],
		'Chromatic Percussion': ['9 Celesta', '10 Glockenspiel', '11 Music Box', '12 Vibraphone', '13 Marimba', '14 Xylophone', '15 Tubular Bells', '16 Dulcimer'],
		'Organ': ['17 Drawbar Organ', '18 Percussive Organ', '19 Rock Organ', '20 Church Organ', '21 Reed Organ', '22 Accordion', '23 Harmonica', '24 Tango Accordion'],
		'Guitar': ['25 Acoustic Guitar (nylon)', '26 Acoustic Guitar (steel)', '27 Electric Guitar (jazz)', '28 Electric Guitar (clean)', '29 Electric Guitar (muted)', '30 Overdriven Guitar', '31 Distortion Guitar', '32 Guitar Harmonics'],
		'Bass': ['33 Acoustic Bass', '34 Electric Bass (finger)', '35 Electric Bass (pick)', '36 Fretless Bass', '37 Slap Bass 1', '38 Slap Bass 2', '39 Synth Bass 1', '40 Synth Bass 2'],
		'Strings': ['41 Violin', '42 Viola', '43 Cello', '44 Contrabass', '45 Tremolo Strings', '46 Pizzicato Strings', '47 Orchestral Harp', '48 Timpani'],
		'Ensemble': ['49 String Ensemble 1', '50 String Ensemble 2', '51 Synth Strings 1', '52 Synth Strings 2', '53 Choir Aahs', '54 Voice Oohs', '55 Synth Choir', '56 Orchestra Hit'],
		'Brass': ['57 Trumpet', '58 Trombone', '59 Tuba', '60 Muted Trumpet', '61 French Horn', '62 Brass Section', '63 Synth Brass 1', '64 Synth Brass 2'],
		'Reed': ['65 Soprano Sax', '66 Alto Sax', '67 Tenor Sax', '68 Baritone Sax', '69 Oboe', '70 English Horn', '71 Bassoon', '72 Clarinet'],
		'Pipe': ['73 Piccolo', '74 Flute', '75 Recorder', '76 Pan Flute', '77 Blown Bottle', '78 Shakuhachi', '79 Whistle', '80 Ocarina'],
		'Synth Lead': ['81 Lead 1 (square)', '82 Lead 2 (sawtooth)', '83 Lead 3 (calliope)', '84 Lead 4 (chiff)', '85 Lead 5 (charang)', '86 Lead 6 (voice)', '87 Lead 7 (fifths)', '88 Lead 8 (bass + lead)'],
		'Synth Pad': ['89 Pad 1 (new age)', '90 Pad 2 (warm)', '91 Pad 3 (polysynth)', '92 Pad 4 (choir)', '93 Pad 5 (bowed)', '94 Pad 6 (metallic)', '95 Pad 7 (halo)', '96 Pad 8 (sweep)'],
		'Synth Effects': ['97 FX 1 (rain)', '98 FX 2 (soundtrack)', '99 FX 3 (crystal)', '100 FX 4 (atmosphere)', '101 FX 5 (brightness)', '102 FX 6 (goblins)', '103 FX 7 (echoes)', '104 FX 8 (sci-fi)'],
		'Ethnic': ['105 Sitar', '106 Banjo', '107 Shamisen', '108 Koto', '109 Kalimba', '110 Bagpipe', '111 Fiddle', '112 Shanai'],
		'Percussive': ['113 Tinkle Bell', '114 Agogo', '115 Steel Drums', '116 Woodblock', '117 Taiko Drum', '118 Melodic Tom', '119 Synth Drum'],
		'Sound effects': ['120 Reverse Cymbal', '121 Guitar Fret Noise', '122 Breath Noise', '123 Seashore', '124 Bird Tweet', '125 Telephone Ring', '126 Helicopter', '127 Applause', '128 Gunshot']
	});

	/* get/setInstrument
	--------------------------------------------------- */
	root.getInstrument = function(channelId) {
		let channel = root.channels[channelId];
		return channel && channel.instrument;
	};

	root.setInstrument = function(channelId, program, delay) {
		let channel = root.channels[channelId];
		if (delay) {
			return setTimeout(function() {
				channel.instrument = program;
			}, delay);
		} else {
			channel.instrument = program;
		}
	};

	/* get/setMono
	--------------------------------------------------- */
	root.getMono = function(channelId) {
		let channel = root.channels[channelId];
		return channel && channel.mono;
	};

	root.setMono = function(channelId, truthy, delay) {
		let channel = root.channels[channelId];
		if (delay) {
			return setTimeout(function() {
				channel.mono = truthy;
			}, delay);
		} else {
			channel.mono = truthy;
		}
	};

	/* get/setOmni
	--------------------------------------------------- */
	root.getOmni = function(channelId) {
		let channel = root.channels[channelId];
		return channel && channel.omni;
	};

	root.setOmni = function(channelId, truthy) {
		let channel = root.channels[channelId];
		if (delay) {
			return setTimeout(function() {
				channel.omni = truthy;
			}, delay);
		} else {
			channel.omni = truthy;
		}
	};

	/* get/setSolo
	--------------------------------------------------- */
	root.getSolo = function(channelId) {
		let channel = root.channels[channelId];
		return channel && channel.solo;
	};

	root.setSolo = function(channelId, truthy) {
		let channel = root.channels[channelId];
		if (delay) {
			return setTimeout(function() {
				channel.solo = truthy;
			}, delay);
		} else {
			channel.solo = truthy;
		}
	};

	/* channels
	--------------------------------------------------- */
	root.channels = (function() { // 0 - 15 channels
		let channels = {};
		for (let i = 0; i < 16; i++) {
			channels[i] = { // default values
				instrument: i,
				pitchBend: 0,
				mute: false,
				mono: false,
				omni: false,
				solo: false
			};
		}
		return channels;
	})();

	/* note conversions
	--------------------------------------------------- */
	root.keyToNote = {}; // C8  == 108
	root.noteToKey = {}; // 108 ==  C8

	(function() {
		let A0 = 0x15; // first note
		let C8 = 0x6C; // last note
		let number2key = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
		for (let n = A0; n <= C8; n++) {
			let octave = (n - 12) / 12 >> 0;
			let name = number2key[n % 12] + octave;
			root.keyToNote[name] = n;
			root.noteToKey[n] = name;
		}
	})();

})(MIDI);
/*
	----------------------------------------------------------
	MIDI.Plugin : 0.3.4 : 2015-03-26
	----------------------------------------------------------
	https://github.com/mudcube/MIDI.js
	----------------------------------------------------------
	Inspired by javax.sound.midi (albeit a super simple version):
		http://docs.oracle.com/javase/6/docs/api/javax/sound/midi/package-summary.html
	----------------------------------------------------------
	Technologies
	----------------------------------------------------------
		Web MIDI API - no native support yet (jazzplugin)
		Web Audio API - firefox 25+, chrome 10+, safari 6+, opera 15+
		HTML5 Audio Tag - ie 9+, firefox 3.5+, chrome 4+, safari 4+, opera 9.5+, ios 4+, android 2.3+
	----------------------------------------------------------
*/

if (typeof MIDI === 'undefined') MIDI = {};

MIDI.Soundfont = MIDI.Soundfont || {};
MIDI.Player = MIDI.Player || {};

(function(root) { 'use strict';

	root.DEBUG = true;
	root.USE_XHR = true;
	root.soundfontUrl = './soundfont/';

	/*
		MIDI.loadPlugin({
			onsuccess: function() { },
			onprogress: function(state, percent) { },
			targetFormat: 'mp3', // optionally can force to use MP3 (for instance on mobile networks)
			instrument: 'acoustic_grand_piano', // or 1 (default)
			instruments: [ 'acoustic_grand_piano', 'acoustic_guitar_nylon' ] // or multiple instruments
		});
	*/

	root.loadPlugin = function(opts) {
		if (typeof opts === 'function') {
			opts = {onsuccess: opts};
		}

		root.soundfontUrl = opts.soundfontUrl || root.soundfontUrl;

		/// Detect the best type of audio to use
		root.audioDetect(function(supports) {
			let hash = window.location.hash;
			let api = '';

			/// use the most appropriate plugin if not specified
			if (supports[opts.api]) {
				api = opts.api;
			} else if (supports[hash.substr(1)]) {
				api = hash.substr(1);
			} else if (supports.webmidi) {
				api = 'webmidi';
			} else if (window.AudioContext) { // Chrome
				api = 'webaudio';
			} else if (window.Audio) { // Firefox
				api = 'audiotag';
			}

			if (connect[api]) {
				/// use audio/ogg when supported
				if (opts.targetFormat) {
					let audioFormat = opts.targetFormat;
				} else { // use best quality
					let audioFormat = supports['audio/ogg'] ? 'ogg' : 'mp3';
				}

				/// load the specified plugin
				root.__api = api;
				root.__audioFormat = audioFormat;
				root.supports = supports;
				root.loadResource(opts);
			}
		});
	};

	/*
		root.loadResource({
			onsuccess: function() { },
			onprogress: function(state, percent) { },
			instrument: 'banjo'
		})
	*/

	root.loadResource = function(opts) {
		let instruments = opts.instruments || opts.instrument || 'acoustic_grand_piano';
		///
		if (typeof instruments !== 'object') {
			if (instruments || instruments === 0) {
				instruments = [instruments];
			} else {
				instruments = [];
			}
		}
		/// convert numeric ids into strings
		for (let i = 0; i < instruments.length; i ++) {
			let instrument = instruments[i];
			if (instrument === +instrument) { // is numeric
				if (root.GM.byId[instrument]) {
					instruments[i] = root.GM.byId[instrument].id;
				}
			}
		}
		///
		opts.format = root.__audioFormat;
		opts.instruments = instruments;
		///
		connect[root.__api](opts);
	};

	let connect = {
		webmidi: function(opts) {
			// cant wait for this to be standardized!
			root.WebMIDI.connect(opts);
		},
		audiotag: function(opts) {
			// works ok, kinda like a drunken tuna fish, across the board
			// http://caniuse.com/audio
			requestQueue(opts, 'AudioTag');
		},
		webaudio: function(opts) {
			// works awesome! safari, chrome and firefox support
			// http://caniuse.com/web-audio
			requestQueue(opts, 'WebAudio');
		}
	};

	let requestQueue = function(opts, context) {
		let audioFormat = opts.format;
		let instruments = opts.instruments;
		let onprogress = opts.onprogress;
		let onerror = opts.onerror;
		///
		let length = instruments.length;
		let pending = length;
		let waitForEnd = function() {
			if (!--pending) {
				onprogress && onprogress('load', 1.0);
				root[context].connect(opts);
			}
		};
		///
		for (let i = 0; i < length; i ++) {
			let instrumentId = instruments[i];
			if (MIDI.Soundfont[instrumentId]) { // already loaded
				waitForEnd();
			} else { // needs to be requested
				sendRequest(instruments[i], audioFormat, function(evt, progress) {
					let fileProgress = progress / length;
					let queueProgress = (length - pending) / length;
					onprogress && onprogress('load', fileProgress + queueProgress, instrumentId);
				}, function() {
					waitForEnd();
				}, onerror);
			}
		};
	};

	let sendRequest = function(instrumentId, audioFormat, onprogress, onsuccess, onerror) {
		let soundfontPath = root.soundfontUrl + instrumentId + '-' + audioFormat + '.js';
		if (root.USE_XHR) {
			root.util.request({
				url: soundfontPath,
				format: 'text',
				onerror: onerror,
				onprogress: onprogress,
				onsuccess: function(event, responseText) {
					let script = document.createElement('script');
					script.language = 'javascript';
					script.type = 'text/javascript';
					script.text = responseText;
					document.body.appendChild(script);
					///
					onsuccess();
				}
			});
		} else {
			dom.loadScript.add({
				url: soundfontPath,
				verify: 'MIDI.Soundfont["' + instrumentId + '"]',
				onerror: onerror,
				onsuccess: function() {
					onsuccess();
				}
			});
		}
	};

	root.setDefaultPlugin = function(midi) {
		for (let key in midi) {
			root[key] = midi[key];
		}
	};

})(MIDI);
/*
	----------------------------------------------------------
	MIDI.Player : 0.3.1 : 2015-03-26
	----------------------------------------------------------
	https://github.com/mudcube/MIDI.js
	----------------------------------------------------------
*/

if (typeof MIDI === 'undefined') MIDI = {};
if (typeof MIDI.Player === 'undefined') MIDI.Player = {};

(function() { 'use strict';

let midi = MIDI.Player;
midi.currentTime = 0;
midi.endTime = 0;
midi.restart = 0;
midi.playing = false;
midi.timeWarp = 1;
midi.startDelay = 0;
midi.BPM = 120;

midi.start =
midi.resume = function(onsuccess) {
    if (midi.currentTime < -1) {
    	midi.currentTime = -1;
    }
    startAudio(midi.currentTime, null, onsuccess);
};

midi.pause = function() {
	let tmp = midi.restart;
	stopAudio();
	midi.restart = tmp;
};

midi.stop = function() {
	stopAudio();
	midi.restart = 0;
	midi.currentTime = 0;
};

midi.addListener = function(onsuccess) {
	onMidiEvent = onsuccess;
};

midi.removeListener = function() {
	onMidiEvent = undefined;
};

midi.clearAnimation = function() {
	if (midi.animationFrameId)  {
		cancelAnimationFrame(midi.animationFrameId);
	}
};

midi.setAnimation = function(callback) {
	let currentTime = 0;
	let tOurTime = 0;
	let tTheirTime = 0;
	//
	midi.clearAnimation();
	///
	let frame = function() {
		midi.animationFrameId = requestAnimationFrame(frame);
		///
		if (midi.endTime === 0) {
			return;
		}
		if (midi.playing) {
			currentTime = (tTheirTime === midi.currentTime) ? tOurTime - Date.now() : 0;
			if (midi.currentTime === 0) {
				currentTime = 0;
			} else {
				currentTime = midi.currentTime - currentTime;
			}
			if (tTheirTime !== midi.currentTime) {
				tOurTime = Date.now();
				tTheirTime = midi.currentTime;
			}
		} else { // paused
			currentTime = midi.currentTime;
		}
		///
		let endTime = midi.endTime;
		let percent = currentTime / endTime;
		let total = currentTime / 1000;
		let minutes = total / 60;
		let seconds = total - (minutes * 60);
		let t1 = minutes * 60 + seconds;
		let t2 = (endTime / 1000);
		///
		if (t2 - t1 < -1.0) {
			return;
		} else {
			callback({
				now: t1,
				end: t2,
				events: noteRegistrar
			});
		}
	};
	///
	requestAnimationFrame(frame);
};

// helpers

midi.loadMidiFile = function(onsuccess, onprogress, onerror) {
	try {
		midi.replayer = new Replayer(MidiFile(midi.currentData), midi.timeWarp, null, midi.BPM);
		midi.data = midi.replayer.getData();
		midi.endTime = getLength();
		///
		MIDI.loadPlugin({
			instruments: midi.getFileInstruments(),
			onsuccess: onsuccess,
			onprogress: onprogress,
			onerror: onerror
		});
	} catch(event) {
		onerror && onerror(event);
	}
};

midi.loadFile = function(file, onsuccess, onprogress, onerror) {
	midi.stop();
	if (file.indexOf('base64,') !== -1) {
		let data = window.atob(file.split(',')[1]);
		midi.currentData = data;
		midi.loadMidiFile(onsuccess, onprogress, onerror);
	} else {
		let fetch = new XMLHttpRequest();
		fetch.open('GET', file);
		fetch.overrideMimeType('text/plain; charset=x-user-defined');
		fetch.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					let t = this.responseText || '';
					let ff = [];
					let mx = t.length;
					let scc = String.fromCharCode;
					for (let z = 0; z < mx; z++) {
						ff[z] = scc(t.charCodeAt(z) & 255);
					}
					///
					let data = ff.join('');
					midi.currentData = data;
					midi.loadMidiFile(onsuccess, onprogress, onerror);
				} else {
					onerror && onerror('Unable to load MIDI file');
				}
			}
		};
		fetch.send();
	}
};

midi.getFileInstruments = function() {
	let instruments = {};
	let programs = {};
	for (let n = 0; n < midi.data.length; n ++) {
		let event = midi.data[n][0].event;
		if (event.type !== 'channel') {
			continue;
		}
		let channel = event.channel;
		switch(event.subtype) {
			case 'controller':
//				console.log(event.channel, MIDI.defineControl[event.controllerType], event.value);
				break;
			case 'programChange':
				programs[channel] = event.programNumber;
				break;
			case 'noteOn':
				let program = programs[channel];
				let gm = MIDI.GM.byId[isFinite(program) ? program : channel];
				instruments[gm.id] = true;
				break;
		}
	}
	let ret = [];
	for (let key in instruments) {
		ret.push(key);
	}
	return ret;
};

// Playing the audio

let eventQueue = []; // hold events to be triggered
let queuedTime; //
let startTime = 0; // to measure time elapse
let noteRegistrar = {}; // get event for requested note
let onMidiEvent = undefined; // listener
let scheduleTracking = function(channel, note, currentTime, offset, message, velocity, time) {
	return setTimeout(function() {
		let data = {
			channel: channel,
			note: note,
			now: currentTime,
			end: midi.endTime,
			message: message,
			velocity: velocity
		};
		//
		if (message === 128) {
			delete noteRegistrar[note];
		} else {
			noteRegistrar[note] = data;
		}
		if (onMidiEvent) {
			onMidiEvent(data);
		}
		midi.currentTime = currentTime;
		///
		eventQueue.shift();
		///
		if (eventQueue.length < 1000) {
			startAudio(queuedTime, true);
		} else if (midi.currentTime === queuedTime && queuedTime < midi.endTime) { // grab next sequence
			startAudio(queuedTime, true);
		}
	}, currentTime - offset);
};

let getContext = function() {
	if (MIDI.api === 'webaudio') {
		return MIDI.WebAudio.getContext();
	} else {
		midi.ctx = {currentTime: 0};
	}
	return midi.ctx;
};

let getLength = function() {
	let data =  midi.data;
	let length = data.length;
	let totalTime = 0.5;
	for (let n = 0; n < length; n++) {
		totalTime += data[n][1];
	}
	return totalTime;
};

let __now;
let getNow = function() {
    if (window.performance && window.performance.now) {
        return window.performance.now();
    } else {
		return Date.now();
	}
};

let startAudio = function(currentTime, fromCache, onsuccess) {
	if (!midi.replayer) {
		return;
	}
	if (!fromCache) {
		if (typeof currentTime === 'undefined') {
			currentTime = midi.restart;
		}
		///
		midi.playing && stopAudio();
		midi.playing = true;
		midi.data = midi.replayer.getData();
		midi.endTime = getLength();
	}
	///
	let note;
	let offset = 0;
	let messages = 0;
	let data = midi.data;
	let ctx = getContext();
	let length = data.length;
	//
	queuedTime = 0.5;
	///
	let interval = eventQueue[0] && eventQueue[0].interval || 0;
	let foffset = currentTime - midi.currentTime;
	///
	if (MIDI.api !== 'webaudio') { // set currentTime on ctx
		let now = getNow();
		__now = __now || now;
		ctx.currentTime = (now - __now) / 1000;
	}
	///
	startTime = ctx.currentTime;
	///
	for (let n = 0; n < length && messages < 100; n++) {
		let obj = data[n];
		if ((queuedTime += obj[1]) <= currentTime) {
			offset = queuedTime;
			continue;
		}
		///
		currentTime = queuedTime - offset;
		///
		let event = obj[0].event;
		if (event.type !== 'channel') {
			continue;
		}
		///
		let channelId = event.channel;
		let channel = MIDI.channels[channelId];
		let delay = ctx.currentTime + ((currentTime + foffset + midi.startDelay) / 1000);
		let queueTime = queuedTime - offset + midi.startDelay;
		switch (event.subtype) {
			case 'controller':
				MIDI.setController(channelId, event.controllerType, event.value, delay);
				break;
			case 'programChange':
				MIDI.programChange(channelId, event.programNumber, delay);
				break;
			case 'pitchBend':
				MIDI.pitchBend(channelId, event.value, delay);
				break;
			case 'noteOn':
				if (channel.mute) break;
				note = event.noteNumber - (midi.MIDIOffset || 0);
				eventQueue.push({
				    event: event,
				    time: queueTime,
				    source: MIDI.noteOn(channelId, event.noteNumber, event.velocity, delay),
				    interval: scheduleTracking(channelId, note, queuedTime + midi.startDelay, offset - foffset, 144, event.velocity)
				});
				messages++;
				break;
			case 'noteOff':
				if (channel.mute) break;
				note = event.noteNumber - (midi.MIDIOffset || 0);
				eventQueue.push({
				    event: event,
				    time: queueTime,
				    source: MIDI.noteOff(channelId, event.noteNumber, delay),
				    interval: scheduleTracking(channelId, note, queuedTime, offset - foffset, 128, 0)
				});
				break;
			default:
				break;
		}
	}
	///
	onsuccess && onsuccess(eventQueue);
};

let stopAudio = function() {
	let ctx = getContext();
	midi.playing = false;
	midi.restart += (ctx.currentTime - startTime) * 1000;
	// stop the audio, and intervals
	while (eventQueue.length) {
		let o = eventQueue.pop();
		window.clearInterval(o.interval);
		if (!o.source) continue; // is not webaudio
		if (typeof(o.source) === 'number') {
			window.clearTimeout(o.source);
		} else { // webaudio
			o.source.disconnect(0);
		}
	}
	// run callback to cancel any notes still playing
	for (let key in noteRegistrar) {
		let o = noteRegistrar[key]
		if (noteRegistrar[key].message === 144 && onMidiEvent) {
			onMidiEvent({
				channel: o.channel,
				note: o.note,
				now: o.now,
				end: o.end,
				message: 128,
				velocity: o.velocity
			});
		}
	}
	// reset noteRegistrar
	noteRegistrar = {};
};

})();
/*
	----------------------------------------------------------------------
	AudioTag <audio> - OGG or MPEG Soundbank
	----------------------------------------------------------------------
	http://dev.w3.org/html5/spec/Overview.html#the-audio-element
	----------------------------------------------------------------------
*/

(function(root) { 'use strict';

	window.Audio && (function() {
		let midi = root.AudioTag = { api: 'audiotag' };
		let noteToKey = {};
		let volume = 127; // floating point
		let buffer_nid = -1; // current channel
		let audioBuffers = []; // the audio channels
		let notesOn = []; // instrumentId + noteId that is currently playing in each 'channel', for routing noteOff/chordOff calls
		let notes = {}; // the piano keys
		for (let nid = 0; nid < 12; nid ++) {
			audioBuffers[nid] = new Audio();
		}

		let playChannel = function(channel, note) {
			if (!root.channels[channel]) return;
			let instrument = root.channels[channel].instrument;
			let instrumentId = root.GM.byId[instrument].id;
			let note = notes[note];
			if (note) {
				let instrumentNoteId = instrumentId + '' + note.id;
				let nid = (buffer_nid + 1) % audioBuffers.length;
				let audio = audioBuffers[nid];
				notesOn[ nid ] = instrumentNoteId;
				if (!root.Soundfont[instrumentId]) {
					if (root.DEBUG) {
						console.log('404', instrumentId);
					}
					return;
				}
				audio.src = root.Soundfont[instrumentId][note.id];
				audio.volume = volume / 127;
				audio.play();
				buffer_nid = nid;
			}
		};

		let stopChannel = function(channel, note) {
			if (!root.channels[channel]) return;
			let instrument = root.channels[channel].instrument;
			let instrumentId = root.GM.byId[instrument].id;
			let note = notes[note];
			if (note) {
				let instrumentNoteId = instrumentId + '' + note.id;
				for (let i = 0, len = audioBuffers.length; i < len; i++) {
				    let nid = (i + buffer_nid + 1) % len;
				    let cId = notesOn[nid];
				    if (cId && cId == instrumentNoteId) {
				        audioBuffers[nid].pause();
				        notesOn[nid] = null;
				        return;
				    }
				}
			}
		};

		midi.audioBuffers = audioBuffers;
		midi.send = function(data, delay) { };
		midi.setController = function(channel, type, value, delay) { };
		midi.setVolume = function(channel, n) {
			volume = n; //- should be channel specific volume
		};

		midi.programChange = function(channel, program) {
			root.channels[channel].instrument = program;
		};

		midi.pitchBend = function(channel, program, delay) { };

		midi.noteOn = function(channel, note, velocity, delay) {
			let id = noteToKey[note];
			if (!notes[id]) return;
			if (delay) {
				return setTimeout(function() {
					playChannel(channel, id);
				}, delay * 1000);
			} else {
				playChannel(channel, id);
			}
		};

		midi.noteOff = function(channel, note, delay) {
// 			let id = noteToKey[note];
// 			if (!notes[id]) return;
// 			if (delay) {
// 				return setTimeout(function() {
// 					stopChannel(channel, id);
// 				}, delay * 1000)
// 			} else {
// 				stopChannel(channel, id);
// 			}
		};

		midi.chordOn = function(channel, chord, velocity, delay) {
			for (let idx = 0; idx < chord.length; idx ++) {
				let n = chord[idx];
				let id = noteToKey[n];
				if (!notes[id]) continue;
				if (delay) {
					return setTimeout(function() {
						playChannel(channel, id);
					}, delay * 1000);
				} else {
					playChannel(channel, id);
				}
			}
		};

		midi.chordOff = function(channel, chord, delay) {
			for (let idx = 0; idx < chord.length; idx ++) {
				let n = chord[idx];
				let id = noteToKey[n];
				if (!notes[id]) continue;
				if (delay) {
					return setTimeout(function() {
						stopChannel(channel, id);
					}, delay * 1000);
				} else {
					stopChannel(channel, id);
				}
			}
		};

		midi.stopAllNotes = function() {
			for (let nid = 0, length = audioBuffers.length; nid < length; nid++) {
				audioBuffers[nid].pause();
			}
		};

		midi.connect = function(opts) {
			root.setDefaultPlugin(midi);
			///
			for (let key in root.keyToNote) {
				noteToKey[root.keyToNote[key]] = key;
				notes[key] = {id: key};
			}
			///
			opts.onsuccess && opts.onsuccess();
		};
	})();

})(MIDI);
/*
	----------------------------------------------------------
	Web Audio API - OGG or MPEG Soundbank
	----------------------------------------------------------
	http://webaudio.github.io/web-audio-api/
	----------------------------------------------------------
*/

(function(root) { 'use strict';

	window.AudioContext && (function() {
		let audioContext = null; // new AudioContext();
		let useStreamingBuffer = false; // !!audioContext.createMediaElementSource;
		let midi = root.WebAudio = {api: 'webaudio'};
		let ctx; // audio context
		let sources = {};
		let effects = {};
		let masterVolume = 127;
		let audioBuffers = {};
		///
		midi.audioBuffers = audioBuffers;
		midi.send = function(data, delay) { };
		midi.setController = function(channelId, type, value, delay) { };

		midi.setVolume = function(channelId, volume, delay) {
			if (delay) {
				setTimeout(function() {
					masterVolume = volume;
				}, delay * 1000);
			} else {
				masterVolume = volume;
			}
		};

		midi.programChange = function(channelId, program, delay) {
// 			if (delay) {
// 				return setTimeout(function() {
// 					let channel = root.channels[channelId];
// 					channel.instrument = program;
// 				}, delay);
// 			} else {
				let channel = root.channels[channelId];
				channel.instrument = program;
// 			}
		};

		midi.pitchBend = function(channelId, program, delay) {
// 			if (delay) {
// 				setTimeout(function() {
// 					let channel = root.channels[channelId];
// 					channel.pitchBend = program;
// 				}, delay);
// 			} else {
				let channel = root.channels[channelId];
				channel.pitchBend = program;
// 			}
		};

		midi.noteOn = function(channelId, noteId, velocity, delay) {
			delay = delay || 0;

			/// check whether the note exists
			let channel = root.channels[channelId];
			let instrument = channel.instrument;
			let bufferId = instrument + '' + noteId;
			let buffer = audioBuffers[bufferId];
			if (!buffer) {
// 				console.log(MIDI.GM.byId[instrument].id, instrument, channelId);
				return;
			}

			/// convert relative delay to absolute delay
			if (delay < ctx.currentTime) {
				delay += ctx.currentTime;
			}

			/// create audio buffer
			if (useStreamingBuffer) {
				let source = ctx.createMediaElementSource(buffer);
			} else { // XMLHTTP buffer
				let source = ctx.createBufferSource();
				source.buffer = buffer;
			}

			/// add effects to buffer
			if (effects) {
				let chain = source;
				for (let key in effects) {
					chain.connect(effects[key].input);
					chain = effects[key];
				}
			}

			/// add gain + pitchShift
			let gain = (velocity / 127) * (masterVolume / 127) * 2 - 1;
			source.connect(ctx.destination);
			source.playbackRate.value = 1; // pitch shift
			source.gainNode = ctx.createGain(); // gain
			source.gainNode.connect(ctx.destination);
			source.gainNode.gain.value = Math.min(1.0, Math.max(-1.0, gain));
			source.connect(source.gainNode);
			///
			if (useStreamingBuffer) {
				if (delay) {
					return setTimeout(function() {
						buffer.currentTime = 0;
						buffer.play()
					}, delay * 1000);
				} else {
					buffer.currentTime = 0;
					buffer.play()
				}
			} else {
				source.start(delay || 0);
			}
			///
			sources[channelId + '' + noteId] = source;
			///
			return source;
		};

		midi.noteOff = function(channelId, noteId, delay) {
			delay = delay || 0;

			/// check whether the note exists
			let channel = root.channels[channelId];
			let instrument = channel.instrument;
			let bufferId = instrument + '' + noteId;
			let buffer = audioBuffers[bufferId];
			if (buffer) {
				if (delay < ctx.currentTime) {
					delay += ctx.currentTime;
				}
				///
				let source = sources[channelId + '' + noteId];
				if (source) {
					if (source.gainNode) {
						// @Miranet: 'the values of 0.2 and 0.3 could of course be used as
						// a 'release' parameter for ADSR like time settings.'
						// add { 'metadata': { release: 0.3 } } to soundfont files
						let gain = source.gainNode.gain;
						gain.linearRampToValueAtTime(gain.value, delay);
						gain.linearRampToValueAtTime(-1.0, delay + 0.3);
					}
					///
					if (useStreamingBuffer) {
						if (delay) {
							setTimeout(function() {
								buffer.pause();
							}, delay * 1000);
						} else {
							buffer.pause();
						}
					} else {
						if (source.noteOff) {
							source.noteOff(delay + 0.5);
						} else {
							source.stop(delay + 0.5);
						}
					}
					///
					delete sources[channelId + '' + noteId];
					///
					return source;
				}
			}
		};

		midi.chordOn = function(channel, chord, velocity, delay) {
			let res = {};
			for (let n = 0, note, len = chord.length; n < len; n++) {
				res[note = chord[n]] = midi.noteOn(channel, note, velocity, delay);
			}
			return res;
		};

		midi.chordOff = function(channel, chord, delay) {
			let res = {};
			for (let n = 0, note, len = chord.length; n < len; n++) {
				res[note = chord[n]] = midi.noteOff(channel, note, delay);
			}
			return res;
		};

		midi.stopAllNotes = function() {
			for (let sid in sources) {
				let delay = 0;
				if (delay < ctx.currentTime) {
					delay += ctx.currentTime;
				}
				let source = sources[sid];
				source.gain.linearRampToValueAtTime(1, delay);
				source.gain.linearRampToValueAtTime(0, delay + 0.3);
				if (source.noteOff) { // old api
					source.noteOff(delay + 0.3);
				} else { // new api
					source.stop(delay + 0.3);
				}
				delete sources[sid];
			}
		};

		midi.setEffects = function(list) {
			if (ctx.tunajs) {
				for (let n = 0; n < list.length; n ++) {
					let data = list[n];
					let effect = new ctx.tunajs[data.type](data);
					effect.connect(ctx.destination);
					effects[data.type] = effect;
				}
			} else {
				return console.log('Effects module not installed.');
			}
		};

		midi.connect = function(opts) {
			root.setDefaultPlugin(midi);
			midi.setContext(ctx || createAudioContext(), opts.onsuccess);
		};

		midi.getContext = function() {
			return ctx;
		};

		midi.setContext = function(newCtx, onload, onprogress, onerror) {
			ctx = newCtx;

			/// tuna.js effects module - https://github.com/Dinahmoe/tuna
			if (typeof Tuna !== 'undefined' && !ctx.tunajs) {
				ctx.tunajs = new Tuna(ctx);
			}

			/// loading audio files
			let urls = [];
			let notes = root.keyToNote;
			for (let key in notes) urls.push(key);
			///
			let waitForEnd = function(instrument) {
				for (let key in bufferPending) { // has pending items
					if (bufferPending[key]) return;
				}
				///
				if (onload) { // run onload once
					onload();
					onload = null;
				}
			};
			///
			let requestAudio = function(soundfont, instrumentId, index, key) {
				let url = soundfont[key];
				if (url) {
					bufferPending[instrumentId] ++;
					loadAudio(url, function(buffer) {
						buffer.id = key;
						let noteId = root.keyToNote[key];
						audioBuffers[instrumentId + '' + noteId] = buffer;
						///
						if (-- bufferPending[instrumentId] === 0) {
							let percent = index / 87;
// 							console.log(MIDI.GM.byId[instrumentId], 'processing: ', percent);
							soundfont.isLoaded = true;
							waitForEnd(instrument);
						}
					}, function(err) {
		// 				console.log(err);
					});
				}
			};
			///
			let bufferPending = {};
			for (let instrument in root.Soundfont) {
				let soundfont = root.Soundfont[instrument];
				if (soundfont.isLoaded) {
					continue;
				}
				///
				let synth = root.GM.byName[instrument];
				let instrumentId = synth.number;
				///
				bufferPending[instrumentId] = 0;
				///
				for (let index = 0; index < urls.length; index++) {
					let key = urls[index];
					requestAudio(soundfont, instrumentId, index, key);
				}
			}
			///
			setTimeout(waitForEnd, 1);
		};

		/* Load audio file: streaming | base64 | arraybuffer
		---------------------------------------------------------------------- */
		function loadAudio(url, onload, onerror) {
			if (useStreamingBuffer) {
				let audio = new Audio();
				audio.src = url;
				audio.controls = false;
				audio.autoplay = false;
				audio.preload = false;
				audio.addEventListener('canplay', function() {
					onload && onload(audio);
				});
				audio.addEventListener('error', function(err) {
					onerror && onerror(err);
				});
				document.body.appendChild(audio);
			} else if (url.indexOf('data:audio') === 0) { // Base64 string
				let base64 = url.split(',')[1];
				let buffer = Base64Binary.decodeArrayBuffer(base64);
				ctx.decodeAudioData(buffer, onload, onerror);
			} else { // XMLHTTP buffer
				let request = new XMLHttpRequest();
				request.open('GET', url, true);
				request.responseType = 'arraybuffer';
				request.onload = function() {
					ctx.decodeAudioData(request.response, onload, onerror);
				};
				request.send();
			}
		};

		function createAudioContext() {
			return new (window.AudioContext || window.webkitAudioContext)();
		};
	})();
})(MIDI);
/*
	----------------------------------------------------------------------
	Web MIDI API - Native Soundbanks
	----------------------------------------------------------------------
	http://webaudio.github.io/web-midi-api/
	----------------------------------------------------------------------
*/

(function(root) { 'use strict';

	let plugin = null;
	let output = null;
	let channels = [];
	let midi = root.WebMIDI = {api: 'webmidi'};
	midi.send = function(data, delay) { // set channel volume
		output.send(data, delay * 1000);
	};

	midi.setController = function(channel, type, value, delay) {
		output.send([channel, type, value], delay * 1000);
	};

	midi.setVolume = function(channel, volume, delay) { // set channel volume
		output.send([0xB0 + channel, 0x07, volume], delay * 1000);
	};

	midi.programChange = function(channel, program, delay) { // change patch (instrument)
		output.send([0xC0 + channel, program], delay * 1000);
	};

	midi.pitchBend = function(channel, program, delay) { // pitch bend
		output.send([0xE0 + channel, program], delay * 1000);
	};

	midi.noteOn = function(channel, note, velocity, delay) {
		output.send([0x90 + channel, note, velocity], delay * 1000);
	};

	midi.noteOff = function(channel, note, delay) {
		output.send([0x80 + channel, note, 0], delay * 1000);
	};

	midi.chordOn = function(channel, chord, velocity, delay) {
		for (let n = 0; n < chord.length; n ++) {
			let note = chord[n];
			output.send([0x90 + channel, note, velocity], delay * 1000);
		}
	};

	midi.chordOff = function(channel, chord, delay) {
		for (let n = 0; n < chord.length; n ++) {
			let note = chord[n];
			output.send([0x80 + channel, note, 0], delay * 1000);
		}
	};

	midi.stopAllNotes = function() {
		output.cancel();
		for (let channel = 0; channel < 16; channel ++) {
			output.send([0xB0 + channel, 0x7B, 0]);
		}
	};

	midi.connect = function(opts) {
		root.setDefaultPlugin(midi);
		let errFunction = function(err) { // well at least we tried!
			if (window.AudioContext) { // Chrome
				opts.api = 'webaudio';
			} else if (window.Audio) { // Firefox
				opts.api = 'audiotag';
			} else { // no support
				return;
			}
			root.loadPlugin(opts);
		};
		///
		navigator.requestMIDIAccess().then(function(access) {
			plugin = access;
			let pluginOutputs = plugin.outputs;
			if (typeof pluginOutputs == 'function') { // Chrome pre-43
			  output = pluginOutputs()[0];
			} else { // Chrome post-43
        output = pluginOutputs[0];
			}
			if (output === undefined) { // nothing there...
			  errFunction();
			} else {
			  opts.onsuccess && opts.onsuccess();
			}
		}, errFunction);
	};

})(MIDI);
/*
	----------------------------------------------------------
	util/Request : 0.1.1 : 2015-03-26
	----------------------------------------------------------
	util.request({
		url: './dir/something.extension',
		data: 'test!',
		format: 'text', // text | xml | json | binary
		responseType: 'text', // arraybuffer | blob | document | json | text
		headers: {},
		withCredentials: true, // true | false
		///
		onerror: function(evt, percent) {
			console.log(evt);
		},
		onsuccess: function(evt, responseText) {
			console.log(responseText);
		},
		onprogress: function(evt, percent) {
			percent = Math.round(percent * 100);
			loader.create('thread', 'loading... ', percent);
		}
	});
*/

if (typeof MIDI === 'undefined') MIDI = {};

(function(root) {

	let util = root.util || (root.util = {});

	util.request = function(opts, onsuccess, onerror, onprogress) { 'use strict';
		if (typeof opts === 'string') opts = {url: opts};
		///
		let data = opts.data;
		let url = opts.url;
		let method = opts.method || (opts.data ? 'POST' : 'GET');
		let format = opts.format;
		let headers = opts.headers;
		let responseType = opts.responseType;
		let withCredentials = opts.withCredentials || false;
		///
		let onsuccess = onsuccess || opts.onsuccess;
		let onerror = onerror || opts.onerror;
		let onprogress = onprogress || opts.onprogress;
		///
		if (typeof NodeFS !== 'undefined' && root.loc.isLocalUrl(url)) {
			NodeFS.readFile(url, 'utf8', function(err, res) {
				if (err) {
					onerror && onerror(err);
				} else {
					onsuccess && onsuccess({responseText: res});
				}
			});
			return;
		}
		///
		let xhr = new XMLHttpRequest();
		xhr.open(method, url, true);
		///
		if (headers) {
			for (let type in headers) {
				xhr.setRequestHeader(type, headers[type]);
			}
		} else if (data) { // set the default headers for POST
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}
		if (format === 'binary') { //- default to responseType="blob" when supported
			if (xhr.overrideMimeType) {
				xhr.overrideMimeType('text/plain; charset=x-user-defined');
			}
		}
		if (responseType) {
			xhr.responseType = responseType;
		}
		if (withCredentials) {
			xhr.withCredentials = 'true';
		}
		if (onerror && 'onerror' in xhr) {
			xhr.onerror = onerror;
		}
		if (onprogress && xhr.upload && 'onprogress' in xhr.upload) {
			if (data) {
				xhr.upload.onprogress = function(evt) {
					onprogress.call(xhr, evt, event.loaded / event.total);
				};
			} else {
				xhr.addEventListener('progress', function(evt) {
					let totalBytes = 0;
					if (evt.lengthComputable) {
						totalBytes = evt.total;
					} else if (xhr.totalBytes) {
						totalBytes = xhr.totalBytes;
					} else {
						let rawBytes = parseInt(xhr.getResponseHeader('Content-Length-Raw'));
						if (isFinite(rawBytes)) {
							xhr.totalBytes = totalBytes = rawBytes;
						} else {
							return;
						}
					}
					onprogress.call(xhr, evt, evt.loaded / totalBytes);
				});
			}
		}
		///
		xhr.onreadystatechange = function(evt) {
			if (xhr.readyState === 4) { // The request is complete
				if (xhr.status === 200 || // Response OK
					xhr.status === 304 || // Not Modified
					xhr.status === 308 || // Permanent Redirect
					xhr.status === 0 && root.client.cordova // Cordova quirk
				) {
					if (onsuccess) {
						let res;
						if (format === 'xml') {
							res = evt.target.responseXML;
						} else if (format === 'text') {
							res = evt.target.responseText;
						} else if (format === 'json') {
							try {
								res = JSON.parse(evt.target.response);
							} catch(err) {
								onerror && onerror.call(xhr, evt);
							}
						}
						///
						onsuccess.call(xhr, evt, res);
					}
				} else {
					onerror && onerror.call(xhr, evt);
				}
			}
		};
		xhr.send(data);
		return xhr;
	};

	/// NodeJS
	if (typeof module !== 'undefined' && module.exports) {
		let NodeFS = require('fs');
		XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
		module.exports = root.util.request;
	}

})(MIDI);
/*
	-----------------------------------------------------------
	dom.loadScript.js : 0.1.4 : 2014/02/12 : http://mudcu.be
	-----------------------------------------------------------
	Copyright 2011-2014 Mudcube. All rights reserved.
	-----------------------------------------------------------
	/// No verification
	dom.loadScript.add("../js/jszip/jszip.js");
	/// Strict loading order and verification.
	dom.loadScript.add({
		strictOrder: true,
		urls: [
			{
				url: "../js/jszip/jszip.js",
				verify: "JSZip",
				onsuccess: function() {
					console.log(1)
				}
			},
			{
				url: "../inc/downloadify/js/swfobject.js",
				verify: "swfobject",
				onsuccess: function() {
					console.log(2)
				}
			}
		],
		onsuccess: function() {
			console.log(3)
		}
	});
	/// Just verification.
	dom.loadScript.add({
		url: "../js/jszip/jszip.js",
		verify: "JSZip",
		onsuccess: function() {
			console.log(1)
		}
	});
*/

if (typeof(dom) === "undefined") let dom = {};

(function() { "use strict";

dom.loadScript = function() {
	this.loaded = {};
	this.loading = {};
	return this;
};

dom.loadScript.prototype.add = function(config) {
	let that = this;
	if (typeof(config) === "string") {
		config = { url: config };
	}
	let urls = config.urls;
	if (typeof(urls) === "undefined") {
		urls = [{
			url: config.url,
			verify: config.verify
		}];
	}
	/// adding the elements to the head
	let doc = document.getElementsByTagName("head")[0];
	///
	let testElement = function(element, test) {
		if (that.loaded[element.url]) return;
		if (test && globalExists(test) === false) return;
		that.loaded[element.url] = true;
		//
		if (that.loading[element.url]) that.loading[element.url]();
		delete that.loading[element.url];
		//
		if (element.onsuccess) element.onsuccess();
		if (typeof(getNext) !== "undefined") getNext();
	};
	///
	let hasError = false;
	let batchTest = [];
	let addElement = function(element) {
		if (typeof(element) === "string") {
			element = {
				url: element,
				verify: config.verify
			};
		}
		if (/([\w\d.\[\]\'\"])$/.test(element.verify)) { // check whether its a variable reference
			let verify = element.test = element.verify;
			if (typeof(verify) === "object") {
				for (let n = 0; n < verify.length; n ++) {
					batchTest.push(verify[n]);
				}
			} else {
				batchTest.push(verify);
			}
		}
		if (that.loaded[element.url]) return;
		let script = document.createElement("script");
		script.onreadystatechange = function() {
			if (this.readyState !== "loaded" && this.readyState !== "complete") return;
			testElement(element);
		};
		script.onload = function() {
			testElement(element);
		};
		script.onerror = function() {
			hasError = true;
			delete that.loading[element.url];
			if (typeof(element.test) === "object") {
				for (let key in element.test) {
					removeTest(element.test[key]);
				}
			} else {
				removeTest(element.test);
			}
		};
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", element.url);
		doc.appendChild(script);
		that.loading[element.url] = function() {};
	};
	/// checking to see whether everything loaded properly
	let removeTest = function(test) {
		let ret = [];
		for (let n = 0; n < batchTest.length; n ++) {
			if (batchTest[n] === test) continue;
			ret.push(batchTest[n]);
		}
		batchTest = ret;
	};
	let onLoad = function(element) {
		if (element) {
			testElement(element, element.test);
		} else {
			for (let n = 0; n < urls.length; n ++) {
				testElement(urls[n], urls[n].test);
			}
		}
		let istrue = true;
		for (let n = 0; n < batchTest.length; n ++) {
			if (globalExists(batchTest[n]) === false) {
				istrue = false;
			}
		}
		if (!config.strictOrder && istrue) { // finished loading all the requested scripts
			if (hasError) {
				if (config.error) {
					config.error();
				}
			} else if (config.onsuccess) {
				config.onsuccess();
			}
		} else { // keep calling back the function
			setTimeout(function() { //- should get slower over time?
				onLoad(element);
			}, 10);
		}
	};
	/// loading methods;  strict ordering or loose ordering
	if (config.strictOrder) {
		let ID = -1;
		let getNext = function() {
			ID ++;
			if (!urls[ID]) { // all elements are loaded
				if (hasError) {
					if (config.error) {
						config.error();
					}
				} else if (config.onsuccess) {
					config.onsuccess();
				}
			} else { // loading new script
				let element = urls[ID];
				let url = element.url;
				if (that.loading[url]) { // already loading from another call (attach to event)
					that.loading[url] = function() {
						if (element.onsuccess) element.onsuccess();
						getNext();
					}
				} else if (!that.loaded[url]) { // create script element
					addElement(element);
					onLoad(element);
				} else { // it's already been successfully loaded
					getNext();
				}
			}
		};
		getNext();
	} else { // loose ordering
		for (let ID = 0; ID < urls.length; ID ++) {
			addElement(urls[ID]);
			onLoad(urls[ID]);
		}
	}
};

dom.loadScript = new dom.loadScript();

let globalExists = function(path, root) {
	try {
		path = path.split('"').join('').split("'").join('').split(']').join('').split('[').join('.');
		let parts = path.split(".");
		let length = parts.length;
		let object = root || window;
		for (let n = 0; n < length; n ++) {
			let key = parts[n];
			if (object[key] == null) {
				return false;
			} else { //
				object = object[key];
			}
		}
		return true;
	} catch(e) {
		return false;
	}
};

})();

/// For NodeJS
if (typeof (module) !== "undefined" && module.exports) {
	module.exports = dom.loadScript;
}