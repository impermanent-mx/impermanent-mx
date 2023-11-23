
class GrainTw {
    constructor(grain, type='seq'){
	self = this;
	this.grain = grain;
	this.pointer = 0;
	this.freqScale = 1;
	this.windowSize = 0.5;
	this.overlaps = 0.5;
	this.windowRandRatio = 0;
	this.time = 2000; 
    }
    // Agregué los paréntesis para ver si funciona así 
    
    set = function grainTwLoop({pntr = 0, frqScl = 1, wndwSz = 0.5, vrlps = 0.5, wndwRndRt = 0, time = 5000}){
    }

    start = function(){
	const tween = new TWEEN.Tween(params, false)
	      .to({pointer: rand}, time) 
	      .easing(TWEEN.Easing.Quadratic.InOut)
	      .onUpdate(() => {
		  // console.log(params.pointer)
	      })
	      .onComplete(() => {	      
		  rand = Math.random()
		  grainTwLoop()
		  twCount++;
		  console.log(twCount, rand); 
	      })
	      .start()
    }
    
}

export { grainTw }
