//for the glitch screen
let glitch
let capture
let img
let test

//inputs!!!
let input1 //randombyte1
let input2 // randombyte2
let input3 // textureX
let input4 // textureY
let random // randomize
let randombytes = false
let checkbox1 // rotationX
let checkbox2 // rotationY
let checkbox3 // rotationZ
let shapeSelect

//position of the pixel range
let positionX
let positionY

//image size
let imagesize // self-explanatory

//3D Shapes
let shapeNum = 1 // for the shapes toggle

//archiving patterns
let selection
let selections = []
let pushButton
let clearButton

let fileInput


let rangeSize

function preload(){
	
	img = new loadImage("data/images/gui.jpg")
	
}

function setup() {
	
	createCanvas(windowWidth, windowHeight, WEBGL)
	
	noSmooth()
	
	img.resize(width/2,0)
	//capture = createCapture(VIDEO)
	
	//capture.hide()

	guiHolder = createDiv() 
	    .class('guiHolder') // add class for styling via CSS 

	  createDiv()
	  	.parent(guiHolder)
	 
	  // use styled div as label 
	  createDiv('3D GLITCHER') 
	    .parent(guiHolder) // place inside gui div 
	    .class('label') // class for CSS
	
		createDiv() 
	    .parent(guiHolder) // place inside gui div 
	    .class('label') // class for CSS
	
	//various inputs
	inputByte1 = createInput(6) // randomByte
		.parent(guiHolder)
		.class('button')
	inputByte2 = createInput(7) // randomByte
		.parent(guiHolder)
		.class('button')
	slideRangeSize = createSlider(1,300,50)
		.parent(guiHolder)
		.class('slider')
	random = createButton("RANDOM BYTES!")
		.parent(guiHolder)
		.class('button')

	shapeSelect = createSelect()
		.parent(guiHolder)
		.class('button')

	fileInput = createFileInput(handleImage)
		.parent(guiHolder)
		.class('button')


	//dropdown for the 3d shape selection
  	shapeSelect.option('box',1);
  	shapeSelect.option('cylinder',2);
	shapeSelect.option('sphere',3);
	shapeSelect.option('torus',4);

	glitch = new Glitch(this)
	glitch.loadQuality(1)
	//glitch.pixelate(1)
	
	//toggles random bytes animation on and off
	random.mousePressed(switchRandomBytes)
	
	frameRate(30)

	//load the glitched image
	glitchSample()


	//rotation
	fill(255)
	//text("Z",width/4-20,100)
	checkbox1 = createCheckbox("Rotate X",true)
		.parent(guiHolder)
		.class('checkbox')

	checkbox2 = createCheckbox("Rotate Y",true)
	  	.parent(guiHolder)
		.class('checkbox')
	
	checkbox3 = createCheckbox("Rotate Z",true)
	 	.parent(guiHolder)
		.class('checkbox')

	pushButton = createButton("PUSH")
		.parent(guiHolder)
		.class('button')
	
	clearButton = createButton("CLEAR")
		.parent(guiHolder)
		.class('button')
	
	pushButton.mousePressed(pushArchive)
	clearButton.mousePressed(clearArchive)

	// create <style> tag for custom css (note `backticks` for multi-line value!) 
  createElement('style', ` 
  *{ 
    outline: none; 
    box-sizing: border-box; 
  } 
    .guiHolder{ 
      background-color: black;
	  width: 25%;
      position: fixed;
      right: 50px; 
      top: 50px; 
      border: 2px solid #fff; 
      border-radius: 10px; 
      padding: 20px;
    } 
    .label{ 
      color:#fff; 
      font-family:sans-serif; 
      font-size:36pt;
      padding:5px; 
    } 
    .slider{ 
      width: 100%;
    } 
    
    .button{
    	width: 100%;
    	margin-bottom: 10px;
		background-color: black;
		color: #fff;
		border: 2px solid #fff;
		border-radius: 20px;
		padding:10px;
    }

	.button:hover {
    	width: 100%;
    	margin-bottom: 10px;
		background-color: #fff;
		color: black;
		border: 2px solid #fff;
		border-radius: 20px;
		padding:10px;
		transition: 0.5s;
    }

	.input{
	}

	.checkbox{
	    width: 100%;
    	margin-bottom: 10px;
		background-color: black;
		font-family: sans-serif;
		font-size: 10pt;
		color: #fff;
		border: 2px solid #fff;
		border-radius: 20px;
		padding:10px;
	}

    `) 
}

function draw() {
	
	background(0)

	rangeSize = slideRangeSize.value()
	
	glitchScreen()
	Shape3D()

	if (mousePressed) {
		selectFunction()
	}

}

function glitchSample(){

	let getter = img.get(20,0,width/2,height)

	//GLITCH!!!
	
	//load the image and the type
	glitch.loadType("jpg")
	glitch.loadImage(getter)

}

function mousePressed(){

}

function pushArchive(){
	
		tempSelection = new Selection(850,300 + selections.length * 125)
		selections.push(tempSelection)
	
}

function clearArchive(){
	
		selections.splice(-1)
	
}


function glitchScreen() {

	//GUI STUFF
	
	//input values
	let randomByte1 = inputByte1.value()
	let randomByte2 = inputByte2.value()


	//the actual glitching
	glitch.resetBytes(3)
	glitch.replaceBytes(randomByte1, randomByte2); // find + replace all
	
	if (randombytes == true){
	glitch.randomBytes(3)
	}
	
	//build and display image
	glitch.buildImage(); // creates image from glitched data
	image(glitch.image, -width/2, -height/2); // display glitched image
}

function Shape3D(){
	translate(-width/2,-height/2)

	shapeNum = shapeSelect.value()


	//interactions
	if (mouseX < width/2){
		if (mouseIsPressed) {	
				positionX = mouseX - rangeSize/2
				positionY = mouseY - rangeSize/2
		}
	}
	
	let textureImg = glitch.image.get(positionX,positionY,rangeSize,rangeSize)
	
	push()
	noStroke()
	texture(textureImg)
	translate(width/2,height/2)

	if (checkbox1.checked()){
		rotateX(frameCount*0.04)
	}

	if (checkbox2.checked()){
		rotateY(frameCount*0.04)
	}

	if (checkbox3.checked()){
		rotateZ(frameCount*0.03)
	}

	//Telling it what shape to generate
	if (shapeNum == 1) {
		box(200)
	}
	
	if (shapeNum == 2) {
		cylinder(200)
	}
	
	if (shapeNum == 3){
		sphere(200)
	}

	if (shapeNum == 4){
		torus(100,100)
	}
	
	pop()
}

function switchRandomBytes(){
	
	if (randombytes == true){
		randombytes = false
	} else {
		randombytes = true
	}
	
}

class Selection {
	
	constructor(x,y){
		
		this.x = x
		this.y = y
		this.rangeSize = rangeSize
		
		this.selectionRange = glitch.image.get(positionX-rangeSize/2,positionY-rangeSize/2,this.rangeSize,this.rangeSize)
		
		this.previewSize = 200
		this.archiveSize = 100

		// 🔥 create DOM element
		let dataURL = this.selectionRange.canvas.toDataURL();

		this.domImg = createImg(dataURL);
		this.domImg.size(this.archiveSize, this.archiveSize);
		this.domImg.parent(guiHolder);
		this.domImg.class('button'); // optional styling
	}
	
	show(){
		

		image(this.selectionRange,this.x,this.y,this.archiveSize,this.archiveSize)
		
		if(dist(mouseX,mouseY,this.x,this.y) <= rangeSize){
		
			if (mousePressed){
				
				texture(this.selectionRange)
				
			}
			
			push()
			noFill()
			strokeWeight(5)
			rect(this.x,this.y,this.previewSize,this.previewSize)
			pop()
			
		}
	}
	
	showPreview(){
		
		image(this.selectionRange,this.x,this.y,this.previewSize,this.previewSize)
	}
	
}

function selectFunction(){

	selection = new Selection()
	
	print(selections.length)

	for(let s of selections){
		
			s.show()
			
	}
	
	push()
		noFill()
		
		if (mouseX < width/2 && mouseY < height) {
		strokeWeight(5)
		rect(mouseX-rangeSize/2,mouseY-rangeSize/2,rangeSize,rangeSize)
	
		}

	pop()
	
	selection.x = width/2
	selection.y = 0
	selection.showPreview()

}

function handleImage(file) {
  // Check the p5.File's type.
  if (file.type === 'image') {
    
// Create an image using using the p5.File's data.
    img = loadImage(file.data, glitchSample);

  } else {
    img = null;
  }
}