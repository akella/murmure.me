import {vec2} from 'gl-matrix';


function setmag(t, e, n) {
  var i = e[0],
    o = e[1],
    r = i * i + o * o;
  return r > 0 && (r = 1 / Math.sqrt(r), t[0] = e[0] * r * n, t[1] = e[1] * r * n), t;
}
function limit(t, e, n) {
  var i = e[0],
    o = e[1],
    r = i * i + o * o;
  return r > n * n && (r = 1 / Math.sqrt(r), t[0] = e[0] * n, t[1] = e[1] * n), t;
}

export default class Thing {
  constructor(ctx,x,y) {
    this.ctx = ctx;
    this.pos = vec2.fromValues(x,y);
    this.original = vec2.fromValues(x,y);
    this.shifted = vec2.fromValues(x+Math.random()*2,y+Math.random()*2);
    this.vel = vec2.fromValues(0,0);
    this.acc = vec2.fromValues(0,0);
    this.maxForce = 0.05;
    this.maxSpeed = 5;
  }

  calculateForces(x,y) {
  	// calc runaway
  	let runawayForce = this.runaway(x,y);
  	let goinhomeForce = this.goinghomeForce();

  	// calc going home
  	this.applyForce(runawayForce);
  	this.applyForce(goinhomeForce);
  }

  applyForce(force) {
  	this.acc = vec2.add(this.acc,this.acc,force);
  }

  runaway(x,y) {
  	let dist = vec2.create();
  	let mouse = vec2.fromValues(x,y);
  	vec2.subtract(dist,mouse,this.pos);

  	if(vec2.length(dist)<100) {
  		//
  		setmag(dist,dist,this.maxSpeed);
  		dist = vec2.scale(dist,dist,-1);

  		let runawayforce = vec2.create();

  		vec2.subtract(runawayforce,dist,this.vel);
  		limit(runawayforce,runawayforce,this.maxForce);
  		return runawayforce;
  	}


  	return vec2.fromValues(0,0);
  }

  goinghomeForce() {
  	let dist = vec2.create();
  	dist = vec2.subtract(dist,this.original,this.pos);
  	let length = vec2.length(dist);
  	let speedkoeff = 8;
  	if(length<100) {
  		speedkoeff = this.maxSpeed * length/100;
  		setmag(dist,dist,speedkoeff);
  	}
  	let force = vec2.create();
  	vec2.subtract(force,dist,this.vel);

  	limit(force,force,this.maxForce);
  	return force;



  	// return vec2.fromValues(0,0);
  }



  update(time) {
  	// this.pos[0] = this.original[0] + Math.sin(time/10)*20;
  	vec2.add(this.pos,this.pos,this.vel);
  	vec2.add(this.vel,this.vel,this.acc);
  	vec2.scale(this.acc,this.acc,0);
  }

  draw() {

  	this.ctx.beginPath();

  	// this.ctx.arc(this.pos[0],this.pos[1],10,0,2*Math.PI);
  	this.ctx.moveTo(this.pos[0],this.pos[1]);
  	this.ctx.lineTo(this.shifted[0],this.shifted[1]);

  	this.ctx.stroke();
  	this.ctx.closePath();
  }
}
