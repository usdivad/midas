/**
  * MUSICAL PARAMETERS
  */
 //SINGLE FREQ TESTING
var theFreq = 500;
var BASE_FREQUENCY = 300;

//params declared in audio.js :O
/*beats_per_minute = 180
tempoMultiplier = 1;*/

/**PRESETS**/
//PRESETS (buttons can change this)
var preset = 0;

//the "canvas"
var melody1 = [];
var melody2 = [];
var melody3 = [];

//single tone
var melody_tone = [52,52];
//pentatonic
var melody_pentatonic = [62,62,64,64,67,67,69,71,71,74,76,76,79,79]; //give the b7!!
var melody_pentatonic2 = [52,52,55,55,57,59,59,62,64,64,67];
var melody_5ths = [52, 59];
//bach art of fugue contrapunctus I
var melody_fugue1 = [62,62,62,62,69,69,69,69,65,65,65,65,62,62,62,62,61,61,61,61,62,62,64,64,65,65,65,65,65,67,65,64,62,62,64,64,65,65,67,67,69,69,57,59,60,57,65,65,65,59,64,64,64,65,64,62,64,64,66,66,67,67,67,67,67,67,65,65,64,64,64,64,62,62,62,64,65,65,65,62,67,67,67,67,65,64,62,61,62,62,67,67,67,67,60,60];
var melody_fugue2 = [50,50,50,50,57,57,57,57,53,53,53,53,50,50,50,50,49,49,49,49,50,50,52,52,53,53,53,53,53,55,53,52];
var melody_fugue3 = [69,69,69,69,74,74,74,74,72,72,72,72,69,69,69,69,68,68,68,68,69,69,71,71,72,72,72,72,72,74,72,70,69,62,74,74,74,74,73,73,74,69,72,72,72,69,70,70,70,64,69,69,69,69,69,69,69,72,72,71,72,72,72,72];
var melody_fugue_end1 = [62,62];
var melody_fugue_end2 = [50,50];
var melody_fugue_end3 = [69,69];

function setPreset0() {
	if (preset == 3)
		stopAll();
	preset = 0;
	melody1 = melody_tone;
	melody2 = [];
	melody3 = [];
	
	//gains
	g1.gain.value = 0.5;
	g2.gain.value = 0;
	g3.gain.value = 0;
}

function setPreset1() {
	if (preset == 3)
		stopAll();
	preset = 1;
	melody1 = melody_pentatonic;
	melody2 = [];
	melody3 = [];
	
	//gains
	g1.gain.value = 0.5;
	g2.gain.value = 0;
	g3.gain.value = 0;
}

function setPreset2() {
	if (preset == 3)
		stopAll();
	preset = 2;
	melody1 = melody_pentatonic;
	melody2 = melody_pentatonic2;
	melody3 = melody_5ths;
	
	//gains
	g1.gain.value = 0.35;
	g2.gain.value = 0.15;
	g3.gain.value = 0.35;
}

function setPreset3() {
	if (preset == 3)
		stopAll();
	preset = 3;
	melody1 = melody_fugue1;
	melody2 = melody_fugue2;
	melody3 = melody_fugue3;
	//gains
	g1.gain.value = 0.35;
	g2.gain.value = 0.15;
	g3.gain.value = 0.35;
	
	playNote(osc1, melody1, beats_per_minute);
	playNote(osc2, melody2, beats_per_minute);
	playNote(osc3, melody3, beats_per_minute);
}

function setPreset4() { //rrr it still has those pulses from state 3
	/*if (preset == 3)
		stopAll()*/
	preset = 4;
	melody1 = melody_fugue_end1;
	melody2 = melody_fugue_end2;
	melody3 = melody_fugue_end3;
}

/**
  * DEVICE PARAMETERS
  */

/**device orientation**/
var alpha;
var beta;
var gamma;
var rotations=0;

var alpha_0; //init
var alpha_pos;
var alpha_rel;
var beta_0;
var beta_pos;
var beta_rel;
var gamma_0;
var gamma_pos;
var gamma_rel;

function getDeviceOrientation() {
	if (window.DeviceOrientationEvent) {
		window.addEventListener("deviceorientation", function(evt){
				alpha = event.alpha; //0-360, but subtracted we go -180-180
				beta = event.beta; //-90-90
				gamma = event.gamma; //-180-180
				rotations++;
				
				alpha_rel = Math.abs(180-alpha);
				if (alpha_0 == null)
					alpha_0 = alpha_rel;
				alpha_pos = Math.abs(alpha_rel - alpha_0);
				
				beta_rel = Math.abs(beta);
				if (beta_0 == null)
					beta_0 = beta_rel;
				beta_pos = Math.abs(beta_rel - beta_0);
				
				gamma_rel = Math.abs(gamma);
				if (gamma_0 == null)
					gamma_0 = gamma_rel;
				gamma_pos = Math.abs(gamma_rel - gamma_0);
				
				
				//SINGLE FREQ TESTING
				
				/*theFreq = BASE_FREQUENCY + alpha_pos*3
				document.getElementById("freq_display").innerHTML = "freq: "+theFreq
				updateAudio()*/
				if (preset == 0)
				{
					var hz = MIDItoHz(melody1[0]) + alpha_pos*3;
					if (hz != osc1.frequency.value) {
						playTone(osc1, hz);
					}
				}
				else if (preset == 1 || preset == 2) {
					var ap = Math.floor(scale(alpha_pos, 180, melody1.length));
					var hz1 = MIDItoHz(melody1[ap]);
					//setPitch(osc1, hz)
					if (hz1 != osc1.frequency.value) {
						playTone(osc1, hz1);
					}
					
					var bp = Math.floor(scale(beta_pos, 90, melody2.length));
					var hz2 = MIDItoHz(melody2[bp]);
					//setPitch(osc1, hz)
					if (hz2 != osc2.frequency.value) {
						playTone(osc2, hz2);
					}
					
					var cp = Math.floor(scale(gamma_pos, 180, melody3.length));
					var hz3 = MIDItoHz(melody3[bp]);
					//setPitch(osc1, hz)
					if (hz3 != osc3.frequency.value) {
						playTone(osc3, hz3);
					}
				}
				else if (preset == 3) {
					var tm = scale(alpha_pos, 180, 4);
					tempo_multiplier = tm+1;
				}
				else if (preset == 4) {
					var hz1 = MIDItoHz(melody1[0]+12);
					var hz2 = MIDItoHz(melody2[0]);
					var hz3 = MIDItoHz(melody3[0]+12);
					playTone(osc1, hz1);
					playTone(osc2, hz2);
					playTone(osc3, hz3);
				}
					
				document.getElementById("alpha_pos_display").innerHTML = "alpha_pos: "+alpha_pos;
				document.getElementById("alpha_0_display").innerHTML = "alpha_0: "+alpha_0;
				document.getElementById("alpha_display").innerHTML = "alpha: "+alpha;
				document.getElementById("beta_display").innerHTML = "beta: "+beta;
				document.getElementById("gamma_display").innerHTML = "gamma: "+gamma;
				document.getElementById("num_rotations").innerHTML = "number of rotations: "+rotations;
		}, true);
	}			
}

/**device motion**/
//note: BROKEN implementation of a a-v-d physics engine
var acceleration;
var accelerationIncludingGravity;
/*
var x=0
var y=0
var z=0
*/
var axg;
var ayg;
var azg;
var interval = 0.05; //generally
var rotationRate;
var ACCELERATION_THRESHOLD_LOW = 0.5;
//var ACCELERATION_THRESHOLD_HIGH = 18
var highest_ax = 0; //this is high threshold for now

//initial position
var px = 0;
var py = 0;
var pz = 0;

//acc
var ax = 0;
var ay = 0;
var az = 0;
var ax_prev = 0;
var ay_prev = 0;
var az_prev = 0;
var countax = 0;
//vel
var vx = 0;
var vy = 0;
var vz = 0;
var vx_prev = 0;
var vy_prev = 0;
var vz_prev = 0;
//dist
var dx = 0;
var dy = 0;
var dz = 0;
var dx_prev = 0;
var dy_prev = 0;
var dz_prev = 0;
var total_dx = 0;



//integrate
function integral(a, aprev, vprev) {
	return (a+aprev)/2 * interval + vprev;
}


function getDeviceMotion() {
	if (window.DeviceMotionEvent) {
		window.addEventListener("devicemotion", function(evt) {
				if (Math.abs(event.acceleration.x) > ACCELERATION_THRESHOLD_LOW) {
					countax = 0;
					ax = event.acceleration.x;
					//ax = event.accelerationIncludingGravity.x
					document.getElementById("ax_display").innerHTML = "ax: "+ax;
					
					 vx = integral(ax, ax_prev, vx_prev);
					 dx = integral(vx, vx_prev, dx_prev);
					 px += dx;

					//SINGLE FREQ TESTING
					/*
					theFreq += dx*10000
					//theFreq = 500 + dx*10000
					//theFreq = px*1000000
					document.getElementById("freq_display").innerHTML = "freq: "+theFreq
					updateAudio()
					*/
					
					//potential threshold?
					if (ax > highest_ax)
						highest_ax = ax;
					document.getElementById("highest_ax_display").innerHTML = "highest ax: "+highest_ax;
				}
				else {
					countax++;
				}
				//"force to zero"
				if (countax>=20) {
					// vx = integral(highest_ax, ax_prev, vx_prev)
					// dx = integral(vx, vx_prev, dx_prev)
					vx = 0;
					vx_prev = 0;
					// ax = 0
					// highest_ax = 0
					//dx = 0
					//dx_prev = 0
				}
				if (Math.abs(event.acceleration.y) > ACCELERATION_THRESHOLD_LOW) {
					ay = event.acceleration.y;
					vy = integral(ay, ay_prev, vy_prev);
					dy = integral(vy, vy_prev, dy_prev);
					py += dy;
					document.getElementById("ay_display").innerHTML = "ay: "+ay;
					
				}
				if (Math.abs(event.acceleration.z) > ACCELERATION_THRESHOLD_LOW) {
					az = event.acceleration.z;
					vz = integral(az, az_prev, vz_prev);
					dz = integral(vz, vz_prev, dz_prev);
					pz += dz;
					document.getElementById("az_display").innerHTML = "az: "+az;
				}

				axg = event.accelerationIncludingGravity.x;
				ayg = event.accelerationIncludingGravity.y;
				azg = event.accelerationIncludingGravity.z;
				
				/*if (dx!=null && dy!=null && dz!=null) {
					px += dx
					py += dy
					pz += dz
				}
				else {
					px += axg
					py += ayg
					pz += azg
				}*/
				
				//SINGLE FREQ TESTING

	
				interval = event.interval;
				rotationRate = event.rotationRate;
				
				
				
				document.getElementById("axg_display").innerHTML = "axg: "+axg;
				document.getElementById("ayg_display").innerHTML = "ayg: "+ayg;
				document.getElementById("azg_display").innerHTML = "azg: "+azg;
				
				
				document.getElementById("dx_display").innerHTML = "dx: "+dx;
				document.getElementById("dy_display").innerHTML = "dy: "+dy;
				document.getElementById("dz_display").innerHTML = "dz: "+dz;
				
				document.getElementById("vx_display").innerHTML = "vx: "+vx;
				document.getElementById("vy_display").innerHTML = "vy: "+vy;
				document.getElementById("vz_display").innerHTML = "vz: "+vz;
				
				document.getElementById("px_display").innerHTML = "px: "+px;
				document.getElementById("py_display").innerHTML = "py: "+py;
				document.getElementById("pz_display").innerHTML = "pz: "+pz;
				document.getElementById("interval_display").innerHTML = "interval: "+interval;
				document.getElementById("rotationRate_display").innerHTML = "rotationRate: "+rotationRate;
		}, true);
	}
}

/**device location**/
//begin handling geolocation
var watch_id;
var latitude;
var longitude;
var watches=0;

function getLocation() {
	watch_id = navigator.geolocation.watchPosition(success_handler);
}

//begin audio playback
/*
playNote(osc1, melody1, beats_per_minute)
playNote(osc2a, melody1, beats_per_minute)
*/

//masterVolume.gain.value=0;

function success_handler(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	watches++;
	
	document.getElementById("latitude_display").innerHTML = "latitude: "+latitude;
	document.getElementById("longitude_display").innerHTML = "longitude: "+longitude;
	document.getElementById("num_watches").innerHTML = "number of watches: "+watches;
}

//scale a value x in xRange to yRange. both only encompass natural nums
function scale(x, xRange, yRange) {
	return (Math.abs(x)/xRange)*yRange;
}

function play() {
	masterVolume.gain.value=1;
	stopAll();
	//playNote(osc1, melody1, beats_per_minute)
	//playNote(osc2a, melody1, beats_per_minute)
	
	//SINGLE FREQ TESTING
	playTone(osc1, theFreq)
}

function pause() {
	masterVolume.gain.value=0;
	stopAll();
}

/**updating musical parameters**/
function updateAudio() {
	osc1.frequency.value = theFreq;
}
