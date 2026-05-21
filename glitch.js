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
let randomBytesButton // randomize
let randombytes = false
let checkbox1 // rotationX
let checkbox2 // rotationY
let checkbox3 // rotationZ
let shapeSelect

let archiveEntry

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
let selectionsDOM = []
let pushButton
let clearButton

let fileInput

let textureImg

let rangeSize

function preload(){
	
	img = loadImage("data/images/gui.jpg")
	
}

function setup() {
	
	createCanvas(windowWidth, windowHeight, WEBGL)

	textureImg = createImage(1,1)
	
	//img.resize(width/2,0)
	//capture = createCapture(VIDEO)
	
	//capture.hide()
	guiHolder = createDiv() 
	    .class('guiHolder') // add class for styling via CSS 

	  createDiv()
	  	.parent(guiHolder)
	 
	  // use styled div as label 
	  createDiv('GLITCHEROO') 
	    .parent(guiHolder) // place inside gui div 
	    .class('label') // class for CSS
	
		createDiv() 
	    .parent(guiHolder) // place inside gui div 
	    .class('label') // class for CSS

	fileInput = createFileInput(handleImage)
			.parent(guiHolder)
			.class('button')

	randomByteDiv = createDiv()
		.parent(guiHolder)
		.class('randomByteDiv')
		
		//various inputs

	randomBytesButton = createButton("RANDOM BYTES!")
			.parent(randomByteDiv)
			.class('button')
			
	inputByte1 = createInput(floor(random(0,100))) // randomByte
		.parent(randomByteDiv)
		.style('margin-right:5px; margin-left: 10px;'
		)

	inputByte2 = createInput(floor(random(0,100))) // randomByte
		.parent(randomByteDiv)

	slideRangeSize = createSlider(1,300,50)
		.parent(guiHolder)
		.class('slider')

	shapeSelect = createSelect()
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
	
	
	archiveHolder = createDiv()
		.parent(guiHolder)
		.class('archiveHolder')

	archiveHolderNav = createDiv()
		.parent(archiveHolder)

	archiveHolderTextures = createDiv()
		.parent(archiveHolder)


	savedPatterns = createDiv('SAVED PATTERNS')
		.parent(archiveHolderNav)
		.style('padding:10px;')

	pushButton = createButton("SAVE")
		.parent(archiveHolderNav)
		.class('button')
	
	clearButton = createButton("CLEAR")
		.parent(archiveHolderNav)
		.class('button')

	saveFile = createButton('DOWNLOAD')
		.parent(archiveHolderNav)
		.class('button')
	
	
	pushButton.mousePressed(pushArchive)
	clearButton.mousePressed(clearArchive)

	// create <style> tag for custom css (note `backticks` for multi-line value!) 
  createElement('style', ` 
  *{ 
    outline: none; 
    box-sizing: border-box; 
  } 

	body{
		overflow: hidden;
		}	

    .guiHolder{ 
      background-color: black;
	  width: 25%;
	  height:95%;
      position: fixed;
      right: 10px; 
      top: 10px;
      border: 2px solid #fff; 
      padding: 20px;
	  overflow: hidden;
    } 

	.archiveHolder{
	  background-color: black;
	  height:226px;
      right: 50px; 
      top: 300px; 
      border: 2px solid #fff;
	  padding-top:20px;
      padding-left: 20px;
	  padding-bottom: 20px;
	  color:#fff; 
      font-family:sans-serif; 
	  overflow-y:auto;
      font-size:24pt;
	  text-align:center;
      padding:5px; 
	  float: left;
	}

	.randomByteDiv {

      	font-family:sans-serif; 
      	font-size:24pt;
      	padding:5px;
		justify-content: space-evenly;

	}

    .label{ 
      color:#fff; 
      font-family:sans-serif; 
      font-size:36pt;
      padding:5px; 
    } 
	
    .slider{ 
      width: 100%;
	  background: black;
    } 

    
    .button{
    	margin-bottom: 10px;
		background-color: black;
		color: #fff;
		border: 2px solid #fff;
		padding:7.5px;
		margin-right: 5px;
    }

	.button:hover {
    	margin-bottom: 10px;
		background-color: #fff;
		color: black;
		border: 2px solid #fff;x
		transition: 0.5s;
    }

	input[type=text]{
		width:25%;
	}

	.checkbox{
    	margin-bottom: 10px;
		font-family: sans-serif;
		font-size: 10pt;
		color: #fff;
		border: 2px solid #fff;
		padding:10px;
	}

	.archive {
		padding-bottom:0px;
		margin-right: 10px;
		border: 2px solid hidden;
		float:left;

	}
	
	.tempImg{
	
		width: 75px;
	
	}

	.tempImg:hover {
		padding-bottom:0px;
		border: 2px solid #fff;

		}

	.clearScreen {
		width:100px;
		height:
		color:white;
		display:none;
		position: relative;
		}

	.closeButton {
		margin: 5px;
		padding: 5px;
		background-color: black;
		font-family: sans-serif;
		font-size: 10pt;
		color: white;
		float:right;
		border: 0px;
		
	}

	.closeButton:hover {
		background-color:white;
		color:black;
		border: 0px;
	}

	.archiveHolderNav {
		position:fixed;
		top: 0;
	}

    `) 

	saveFile.mousePressed(function(){save(textureImg,'myPattern.jpg')})

	grabArchive()

}

function draw() {
	
	background(0)

	rangeSize = slideRangeSize.value()

	if (glitch.image){
		image(glitch.image, -width/2, -height/2); // display glitched image
	}

	Shape3D()

	if (mousePressed) {
		selectFunction()
	}

	if (randombytes == true) {

		glitchScreen()

	}


}

function glitchSample(){

	let getter
	
	if (mousePressed){
		getter = img.get(20,0,width/2,height)
	}

	//GLITCH!!!
	//noSmooth()
	//load the image and the type
	glitch.loadType("jpg")
	glitch.loadImage(getter)

	glitchScreen()

}

function mousePressed(){

}

function pushArchive(){

	let imageData = textureImg.canvas.toDataURL()

		archiveEntry = {
       	 image: imageData
    	}

	selections.push(archiveEntry)
    storeItem('selections', selections)

	grabArchive()
}


function clearArchive(index){
	
	selections.splice(index)
    storeItem('selections', selections)
	grabArchive()
			
}

function deleteTexture(index){
	
	selections.splice(index, 1)
    storeItem('selections', selections)
	grabArchive()
			
}


function glitchScreen() {

	//GUI STUFF
	
	//input values
	let randomByte1 = inputByte1.value()
	let randomByte2 = inputByte2.value()

	inputByte1.changed(glitchSample)
	inputByte2.changed(glitchSample)

	randomBytesButton.mousePressed(function(){let r1 = random(1,100); let r2 = random(1,100); inputByte1.value(floor(r1));
								   inputByte2.value(floor(r2)); randomByte1 = floor(r1); randomByte2 = floor(r2); glitchSample()})

	//the actual glitching
	glitch.resetBytes()
	glitch.replaceBytes(randomByte1, randomByte2); // find + replace all
	
	
	//build and display image
	glitch.buildImage(); // creates image from glitched data
	
	if(textureImg == undefined){
	textureImg  = glitch.image.get(0,0,rangeSize,rangeSize)
	}

}

function Shape3D(){
	translate(-width/2,-height/2)

	shapeNum = shapeSelect.value()


	//interactions
	if (mouseX < width/2){
		if (mouseIsPressed) {	
				positionX = mouseX - rangeSize/2
				positionY = mouseY - rangeSize/2

				textureImg  = glitch.image.get(positionX,positionY,rangeSize,rangeSize)


		}
	}



	slideRangeSize.changed(function(){ textureImg = glitch.image.get(positionX,positionY,rangeSize,rangeSize) })

	push()
	noStroke()
	texture(textureImg)
	translate(width/2+175,200)

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
		box(150)
	}
	
	if (shapeNum == 2) {
		cylinder(150)
	}
	
	if (shapeNum == 3){
		sphere(150)
	}

	if (shapeNum == 4){
		torus(100,100)
	}
	
	pop()
}

class Selection {
	
	constructor(x,y){
		
		this.x = x
		this.y = y
		this.rangeSize = rangeSize
		
		if (mouseIsPressed){
		this.selectionRange = glitch.image.get(positionX,positionY,this.rangeSize,this.rangeSize)
		}

		this.previewSize = 200
		this.archiveSize = 100

	}
	
	
}

function selectFunction(){
	
	push()
		noFill()
		
		if (mouseX < width/2 && mouseY < height) {
		strokeWeight(2)
		rect(mouseX-rangeSize/2,mouseY-rangeSize/2,rangeSize,rangeSize)
		}

	pop()
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

function grabArchive(){

	archiveHolderTextures.html("")

	let savedData = getItem('selections');

	if(savedData){
		selections = savedData

		let c = 1
		for(let entry of selections){

			let imageContainer = createDiv()
				imageContainer.class('archive')
				imageContainer.id(`texture-${c}`)
				imageContainer.parent(archiveHolderTextures)

				
				let clearScreen = createDiv()
					clearScreen.parent(imageContainer)
					clearScreen.class('clearScreen')
				
				let closeButton = createButton('x')
					closeButton.parent(clearScreen)
					closeButton.class('closeButton')

			let tempImg = createImg(entry.image)
				tempImg.parent(imageContainer)
				tempImg.class('tempImg')
			
			
			imageContainer.mouseOver(function(){
				clearScreen.style('display:inline')
			})

			imageContainer.mouseOut(function(){
				clearScreen.style('display:none')
			})

			let index = c - 1

			closeButton.mousePressed(function(){deleteTexture(index)})

			tempImg.mousePressed(function(){

				loadImage(entry.image, function(img){
					textureImg = img
				})

			})
			c++
		}
	}

}