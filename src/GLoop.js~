const { map_range } = require('./maprange.js');
import * as TWEEN from 'tween'; 

class GLoop {
    constructor(type='gloop'){

	self = this;
	// self.grain = grain;

	this.seqpointer= [0.2, 0.4, 0.77, 0.3];
	this.seqfreqScale= [2];
	this.seqwindowSize= [0.5]; 
	this.seqoverlaps= [0.2];
	this.seqwindowRandRatio= [0]; 
	this.seqtime = [8000];
	this.count = 0; 

	// console.log(self.grain.audioCtx); 
	
    }

    update = function(){
	TWEEN.update(); 
    }
    
    start = function(){

	this.paramsInit = {
	    pointer: this.seqpointer[this.count % this.seqpointer.length],
	    freqScale: this.seqfreqScale[this.count % this.seqfreqScale.length],
	    windowSize: this.seqwindowSize[this.count % this.seqwindowSize.length],
	    overlaps: this.seqoverlaps[this.count % this.seqoverlaps.length],
	    windowRandRatio: this.seqwindowRandRatio[this.count % this.seqwindowRandRatio.length],
	    time: this.seqtime[this.count % this.seqtime.length]
	}


	let paramsEnd = {
	    pointer: this.seqpointer[(this.count+1) % this.seqpointer.length],
	    freqScale: this.seqfreqScale[(this.count+1) % this.seqfreqScale.length],
	    windowSize: this.seqwindowSize[(this.count+1) % this.seqwindowSize.length],
	    overlaps: this.seqoverlaps[(this.count+1) % this.seqoverlaps.length],
	    windowRandRatio: this.seqwindowRandRatio[(this.count+1) % this.seqwindowRandRatio.length],
	    time: this.seqtime[(this.count+1) % this.seqtime.length]
	}
	
	const tween = new TWEEN.Tween(this.paramsInit, false)
	      .to(paramsEnd, 16000) 
	      .easing(TWEEN.Easing.Quadratic.InOut)
	      .onUpdate(() => {
		  //cosa.pointer = params.pointer; 
		  // cosa.pointer = map_range(params.pointer, 0, 1, 0, cosa.buffer.duration)
		  // cosa.freqScale = params.freqScale;
		  // console.log(paramsInit.pointer); 
		  // sself.grain.pointer = map_range(paramsInit.pointer, 0, 1, 0, self.grain.buffer.duration);  
	      })
	      .onComplete(() => {
		  //console.log(cosa.pointer); 
		  // console.log(aCtx);
		  //cosa.windowRandRatio = 0.1; 
		  //rand = Math.random()
		  //freq = Math.floor(Math.random() * 2) + 1; 
		  //twCount++;
		  // console.log(twCount, rand);
		 
		  this.start(); 
		  console.log(paramsEnd); 
		  this.count++; 
	      })
	      .start()
    }
}	

module.exports = { GLoop } 

/*
function grainTwLoop(pntr = 0, frqScl = 1, wndwSz = 0.5, vrlps = 0.5, wndwRndRt = 0, time = 8000){
    const tween = new TWEEN.Tween(params, false)
	  .to({pointer: rand, freqScale: freq}, time) 
	  .easing(TWEEN.Easing.Quadratic.InOut)
	  .onUpdate(() => {
	      //cosa.pointer = params.pointer; 
	      cosa.pointer = map_range(params.pointer, 0, 1, 0, cosa.buffer.duration)
	      // cosa.freqScale = params.freqScale; 
	  })
	  .onComplete(() => {
	      console.log(cosa.pointer); 
	      // console.log(aCtx);
	      cosa.windowRandRatio = 0.1; 
	      rand = Math.random()
	      freq = Math.floor(Math.random() * 2) + 1; 
	      twCount++;
	      console.log(twCount, rand); 
	  })
	  .start()
}

*/
