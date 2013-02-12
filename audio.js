
/**CONTEXT**/
//create an AudioContext
var context;
var beats_per_minute = 144
var tempo_multiplier = 1

try
{
	context = new webkitAudioContext();
}
catch(e)
{
	try
	{	
		context = new AudioContext();
	}
	catch(e)
	{
		alert("Sorry, playback is not supported in this browser :( Audio playback requires a browser that supports the Web Audio API for HTML5.");
	}
}

//melody (right now it gets changed by tilt.html though)
//var melody1 = [57,62,64,57,69,57,62,64,67,55] //can add more, have single osc shift between multiple ones
//e.g. an "action" state. but you'd have to modify pick fn
//var melody2 = [45,45]

//context-wide vars
var masterVolume = context.createGainNode();
masterVolume.gain.value=1;
masterVolume.connect(context.destination);

/**OSCILLATORS**/

/**osc1**/
var osc1 = context.createOscillator();
var g1 = context.createGainNode();
var r1 = context.createConvolver();
var eq1 = context.createBiquadFilter();
//var wavetype = "square"; //again, shapes can change wavetype

osc1.type = 0;
eq1.type = 0;
g1.gain.value = 0.35
osc1.connect(eq1);
eq1.connect(g1);
g1.connect(masterVolume);
//osc1.connect(context.destination);

/*
osc1.connect(eq1);
eq1.connect(g1);
g1.connect(context.destination);
*/

/**osc2**/
//osc2: imagine multiplying two waves, thus 2a 2b etc.
var osc2 = context.createOscillator();
//var osc2b = context.createOscillator(); //trying to combine to make richer sound
var g2 = context.createGainNode();
var r2 = context.createConvolver();
var eq2 = context.createBiquadFilter();
eq2.type = 1;
g2.gain.value = 0.15

osc2.type = 2;
//osc2b.type = 2;
osc2.connect(eq2);
eq2.connect(g2);
g2.connect(masterVolume);


//var osc3 = context.createOscillator();
//var waveshaper = context.createWaveShaper()

/**osc3**/
var osc3 = context.createOscillator();
var g3 = context.createGainNode();
var r3 = context.createConvolver();
var eq3 = context.createBiquadFilter();
//var wavetype = "square"; //again, shapes can change wavetype

osc3.type = 2;
eq3.type = 0;
g3.gain.value = 0.35
osc3.connect(eq3);
eq3.connect(g3);
g3.connect(masterVolume);


/**FUNCTIONS**/

//converts midi to hz
/**TRANSPOSES IT!!!! for volume purposes for the devfest demo**/
function MIDItoHz(midi)
{
	var freq = (440 / 32) * (Math.pow(2,((midi+12 - 9) / 12)));
	return freq;
}

//play a single frequency w/ sine wave. use stopTone() to shut it up
//RIGHT NOW IT'S CONSTANT, NO BREAK BTWEEN NOTES
function playTone(oscillator, freq)
{	
	//oscillator.noteOn && oscillator.noteOn(1);
	//oscillator.noteOff(0);
	if (freq != 0 && freq != oscillator.frequency.value)
	{
		//oscillator = context.createOscillator();
		
		//oscillator.type = 0;
		/*
		setWaveType(oscillator);
		setReverb(oscillator);
		setGain(oscillator);
		*/
		
		//are these gain things actually doing anything?
		//g1.gain.value = 0
		oscillator.frequency.value = freq;
		//g1.gain.value = 0.5
		oscillator.noteOn(0);
		
		//console.log(freq);
	}
}

//if you abstract it like this you need to connect it to eq1, or eq2, etc... depending on which....
function stopTone(oscillator) {
	oscillator.noteOff(0);
	oscillator = context.createOscillator();
}

function stopAll() { 
	osc1.noteOff(0);
	osc2.noteOff(0);
	osc3.noteOff(0);
	
	osc1 = context.createOscillator();
	osc1.type = 0;
	osc1.connect(eq1);

	osc2 = context.createOscillator();
	osc2.type = 2;
	osc2.connect(eq2);
	
	osc3 = context.createOscillator();
	osc3.type = 2;
	osc3.connect(eq3);
}

//play a single note as part of the blossom, then recursively pick&play next note
function playNote(oscillator, melody, BPM)
{
	var pitch = melody1[Math.floor(Math.random()*melody1.length)];
	//var bpm = Number(BPM);
	var bpm = tempo_multiplier*BPM; //tempo actually is "multiplier"
	var freq;
	//console.log("Playing note (" + note.pitch + ", " + note.rhythm + ")");
	if (pitch != 0)
		freq = (440 / 32) * (Math.pow(2,((pitch - 9) / 12)));
	else
		freq = 0; //rest
	var beat = (60/bpm) * 1000; //in ms
	//var duration = Math.floor(Math.random()*2 + 1) * beat;
	var duration = 2*beat;
	//HARDCODED 8th notes
	//var typeNext;//get from doc
	
	//else if (type == STOP) {stopTone();} //do nothing
	playTone(oscillator, freq);
	setTimeout(function(){playNote(oscillator, melody, BPM);}, duration);
	
	//console.log(freq+"\n");
}

function setWaveType(oscillator, type) {
	//if with shapes
	oscillator.type = type;
}

function setPitch(oscillator, hz) {
	oscillator.frequency.value = hz;
}

function setReverb(oscillator) {
	
}

function setGain(oscillator) {
	
}