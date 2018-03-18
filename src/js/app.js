import Thing from './thing';

class Cloud {
  constructor() {
    // create canvas

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    document.body.appendChild(this.canvas);

    this.time = 0;
    this.numberofparticles = 4000;
    this.ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.createparticles();
    this.update();
    this.bindmouse();
  }
  

  createparticles() {
  	let self = this;
  	for (var i = 0; i < this.numberofparticles; i++) {
      let radius = Math.sqrt(200*200*Math.random());
      let angle = 2*Math.PI*Math.random();

      let x = this.width/2 + radius*Math.sin(angle);
      let y = this.height/2 + radius*Math.cos(angle);
  		this.particles.push(
  			new Thing(self.ctx,x,y)
  		);
  	}
  }

  update() {
  	let self = this;
    this.time++;
    this.ctx.clearRect(0,0,this.width,this.height);
    this.particles.forEach((p) => {
      p.calculateForces(self.mouseX,self.mouseY);
    	p.update(self.time);
    	p.draw();
    });
    window.requestAnimationFrame(this.update.bind(this));
  }

  bindmouse() {
  	let self = this;
  	this.canvas.addEventListener('mousemove',function(e) {
  		console.log(e.clientX,e.clientY);
  		self.mouseX = e.clientX;
  		self.mouseY = e.clientY;
  	});
  }
}

let cloud = new Cloud();
