const { map_range } = require('./maprange.js');
import * as TWEEN from 'tween'; 

class GLoop {
    constructor(grain, seqpointer = [0.5], seqfreqscale = [1], seqwindowsize = [0.1], seqoverlaps = [0.25], seqwindowrandratio = [0], seqtime = [8000], tweenloop = true, type='gloop'){

	self = this;
	// self.grain = grain;
	this.grain = grain; 
	this.seqpointer = seqpointer;
	this.seqfreqScale = seqfreqscale;
	this.seqwindowSize= seqwindowsize; 
	this.seqoverlaps = seqoverlaps;
	this.seqwindowRandRatio= seqwindowrandratio; 
	this.seqtime = seqtime;
	this.count = 0;
	this.tweenloop = tweenloop; 
	
    }

    set = function(seqpointer = [0.5], seqfreqscale = [1], seqwindowsize = [0.1], seqoverlaps = [0.25], seqwindowrandratio = [0], seqtime = [8000], tweenloop = true){
	
	this.seqpointer = seqpointer;
	this.seqfreqScale = seqfreqscale;
	this.seqwindowSize= seqwindowsize; 
	this.seqoverlaps = seqoverlaps;
	this.seqwindowRandRatio= seqwindowrandratio; 
	this.seqtime = seqtime;
	this.count = 0;
	this.tweenloop = tweenloop;
	
    }

    update = function(){
	TWEEN.update(); 
    }

    loop = function(loop){
	this.tweenloop = loop; 
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
	      .to(paramsEnd, 8000) 
	      .easing(TWEEN.Easing.Quadratic.InOut)
	      .onUpdate(() => {
		  
		  this.grain.grain.pointer = map_range(this.paramsInit.pointer, 0, 1, 0, this.grain.grain.buffer.duration); 
		  this.grain.grain.freqScale = this.paramsInit.freqScale;
		  this.grain.grain.windowSize = this.paramsInit.windowSize;
		  this.grain.grain.overlaps = this.paramsInit.overlaps;
		  this.grain.grain.windowRandRatio = this.paramsInit.windowRandRatio; 
		 
	      })
	      .onComplete(() => {
		 
		  console.log("cambio"); 
		 
		  if(this.tweenloop){
		      this.start();
		  }

		  this.count++;
		  
	      })
	      .start()
    }
}	

module.exports = { GLoop } 
