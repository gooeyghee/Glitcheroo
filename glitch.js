//for the glitch screen
let glitch
let capture
let img
let backgroundImg
let test

let selectX
let selectY

let patternsX
let patternsY

let previewX
let previewY

let drawingX
let drawingY

let g

let	clickX
let	clickY

let zIndex = 0
let isSelected = false

//inputs!!!
let randomBytesButton // randomize
let randombytes = false
let checkbox1 // rotationX
let checkbox2 // rotationY
let checkbox3 // rotationZ
let shapeSelect

let previewIsMinimized = false;
let selectIsMinimized = false;
let drawingIsMinimized = false;
let patternsIsMinimized = false;

let firstPatternChosen = false;

let inputByte1;
let inputByte2;

let rectOriginX, rectOriginY, rectSizeX, rectSizeY;

let archiveEntry

//position of the pixel range
let positionX
let positionY

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

var Preview3D = function(p) {
  p.setup = function() {

    p.createCanvas(300, 300, p.WEBGL);
	p.frameRate(120)
	
	previewGUI = p.createDiv()
		.style('background-color:white; color:black;font-family:Neue Haas Unica;')

	p.createDiv("Rotate:").parent(previewGUI).style('float:left')

	checkbox1 = p.createCheckbox("X",true)
		.class('checkbox')
		.parent(previewGUI)

	checkbox2 = p.createCheckbox("Y",true)
		.class('checkbox')
		.parent(previewGUI)
	
	checkbox3 = p.createCheckbox("Z",true)
		.class('checkbox')
		.parent(previewGUI)

	shapeSelect = p.createSelect()
		.class('button')
		.parent(previewGUI)

	//dropdown for the 3d shape selection
  	shapeSelect.option('box',1);
  	shapeSelect.option('cylinder',2);
	shapeSelect.option('sphere',3);
	shapeSelect.option('torus',4);

  };
 
  p.draw = function() {

	p.background(0)

	shapeNum = shapeSelect.value()


	p.push()
	p.noStroke()
	p.texture(textureImg)

	if (checkbox1.checked()){
		p.rotateX(frameCount*0.03)
	}

	if (checkbox2.checked()){
		p.rotateY(frameCount*0.03)
	}

	if (checkbox3.checked()){
		p.rotateZ(frameCount*0.03)
	}

	//Telling it what shape to generate
	if (shapeNum == 1) {
		p.box(150)
	}
	
	if (shapeNum == 2) {
		p.cylinder(100)
	}
	
	if (shapeNum == 3){
		p.sphere(100)
	}

	if (shapeNum == 4){
		p.torus(50,50)
	}
	
	p.pop()
  };
};

var Select3D = function(s) {

	s.setup = function() {

	textureImg = s.createImage(1,1)
	s.createCanvas(500, 500);

	img.resize(s.width,s.height)
	s.glitch = new Glitch(this)
	s.glitch.loadQuality(1)
	//glitch.pixelate(1)
	
	//toggles random bytes animation on and off
	
	s.frameRate(30)

	selectGUI = s.createDiv()
		.style('background-color:white;padding:5px;')
	s.fileInput = s.createFileInput(s.handleImage)
		.parent(selectGUI)
		.style('position:relative;')
	
	randomByteDiv = s.createDiv()
		.parent(selectGUI)
		
	randomBytesButton = s.createButton("")
			.parent(randomByteDiv)
			.class('button')
			.style('background-size: 100% 100%; width:50px;height:50px;background-image:url("data/icons/4x/random.png");')
			
	s.inputByte1 = s.createInput(floor(random(0,100))) // randomByte
		.parent(randomByteDiv)
		.style('margin-right:5px; margin-left: 10px;')

	s.inputByte2 = s.createInput(floor(random(0,100))) // randomByte
		.parent(randomByteDiv)

	s.inputByte1.changed(s.glitchSample)
	s.inputByte2.changed(s.glitchSample)
	
	randomBytesButton.mousePressed(function(){let r1 = random(1,100); let r2 = random(1,100); s.inputByte1.value(floor(r1));
		s.inputByte2.value(floor(r2)); randomByte1 = floor(r1); randomByte2 = floor(r2); s.glitchSample()})

	//load the glitched image
	s.glitchSample()

  }
 
  s.draw = function() {

	s.background(0)

	if (s.glitch.image){
		s.image(s.glitch.image,0,0,s.width,s.height); // display glitched image
	}

	if (randombytes == true) {

		s.glitchScreen()

	}

	s.push()
	s.noFill()
	s.strokeWeight(2)
	s.stroke(255)
	s.blendMode(DIFFERENCE)
	s.rect(s.rectOriginX,s.rectOriginY,s.rectSizeX)
	s.pop()

	if (selectionHit()){

		s.cursor('grab')

	} else {s.cursor(CROSS)}

  }

  s.mousePressed = function() {

	draggingPreview = false;

	//if (dist(s.mouseX,s.mouseY,s.positionX,s.positionY) < s.rangeSize){
	if (selectionHit()){
		cursor('grab')
		draggingPreview = true;
		s.offX = s.mouseX - s.rectOriginX
		s.offY = s.mouseY - s.rectOriginY

	} else {

	s.outside = true

	if(s.mouseX <= s.width && s.mouseY <= s.height && s.mouseX > 0 && s.mouseY > 0){

		s.rectSizeX = 0
		s.rectOriginX = s.mouseX
		s.rectOriginY = s.mouseY
		s.rangeSize = 1

		s.positionX = s.rectOriginX
		s.positionY = s.rectOriginY
		s.rangeSize = 1
		s.outside = false
	
	}

}

}

 function selectionHit(){

	let hit = false
	if (s.mouseX >= s.rectOriginX
		&& s.mouseX <= s.rectOriginX + s.rectSizeX 
		&& s.mouseY >= s.rectOriginY 
		&& s.mouseY <= s.rectOriginY + s.rectSizeX){

			hit = true
		
		}

	return hit
 }

  s.mouseDragged = function() {

	if (
		s.mouseX < 0 ||
		s.mouseX > s.width ||
		s.mouseY < 0 ||
		s.mouseY > s.height ||
		selectIsMinimized == true ||
		isSelected == false
	) {
		return false;
	}

	if(draggingPreview && !s.outside){
		s.rectOriginX = s.mouseX - s.offX //- abs(s.mouseX - s.rectOriginX)
		s.rectOriginY = s.mouseY - s.offY//- abs(s.mouseY - s.rectOriginY)
		textureImg  = s.glitch.image.get(s.rectOriginX,s.rectOriginY,s.rectSizeX,s.rectSizeX)

		return false
	}

	if (firstPatternChosen == false && !s.outside){

	s.rectOriginX = s.rectOriginX
	s.rectOriginY = s.rectOriginY
	s.rectSizeX = s.mouseX - s.rectOriginX

	firstPatternChosen = true

	} else {
		
		
		if(!s.outside){

			s.rectOriginX = s.rectOriginX
			s.rectOriginY = s.rectOriginY
			s.rectSizeX = s.mouseX - s.rectOriginX
			s.rangeSize = s.rectSizeX

		}


		

	}

	textureImg  = s.glitch.image.get(s.positionX,s.positionY,s.rangeSize,s.rangeSize)
	}

	s.glitchSample = function(){

	let getter
	
	if (s.mousePressed){
		getter = img.get(0,0,s.width,s.height)
	}

	//GLITCH!!!
	//noSmooth()
	//load the image and the type
	s.glitch.loadType("jpg")
	s.glitch.loadImage(getter)

	s.glitchScreen()

	}

	s.glitchScreen = function() {

	//GUI STUFF
	
	//input values
	let randomByte1 = s.inputByte1.value()
	let randomByte2 = s.inputByte2.value()

	//the actual glitching
	s.glitch.resetBytes()
	s.glitch.replaceBytes(randomByte1, randomByte2); // find + replace all
	
	
	//build and display image
	s.glitch.buildImage(); // creates image from glitched data
	
	if(textureImg == undefined){
	textureImg  = s.glitch.image.get(0,0,rangeSize,rangeSize)
	}
	}

	s.Selection = class Selection{
	
	constructor(x,y){
		
		this.x = x
		this.y = y
		this.rangeSize = rangeSize
		
		if (mouseIsPressed){
		this.selectionRange = s.glitch.image.get(positionX,positionY,this.rangeSize,this.rangeSize)
		}

		this.previewSize = 200
		this.archiveSize = 100

	}
	
}

s.handleImage = function(file) {
  // Check the p5.File's type.
  if (file.type === 'image') {
    
// Create an image using using the p5.File's data.
    img = loadImage(file.data, s.glitchSample);

  } else {
    img = null;
  }
}
}

var DrawingBoard = function(b,g) {

  b.setup = function() {

    myDrawing = b.createCanvas(640, 300);

	b.background(0)

	g = createGraphics(640,300)

	b.frameRate(120)

	DrawingBoardDiv = b.createDiv()
	.style('background-color:black;padding:0px;color:white;font-family:Neue Haas Unica')

	freeDrawingCheckmark = b.createCheckbox('free draw')
	.parent(DrawingBoardDiv)
	noiseDrawing = b.createCheckbox('let me draw it for you')
	.parent(DrawingBoardDiv)
	sizeSine = b.createCheckbox('oscillate size')
	.parent(DrawingBoardDiv)

	size = b.createSlider(0, 100, 10)
	.parent(DrawingBoardDiv)

	clearSketch = b.createButton('clear sketch')
	.parent(DrawingBoardDiv)
	.class('button')
	saveSketch = b.createButton('save sketch')
	.parent(DrawingBoardDiv)
	.class('button')

	myPicker = b.createColorPicker('black');

	myPicker.changed(function(){b.background(myPicker.value())})

	clearSketch.mousePressed(function(){b.background(myPicker.value()); g.clear()})

	saveSketch.mousePressed(function(){b.save(myDrawing,'myDrawing.jpg')})


	b.imageMode(CENTER)
     
  };
 
  b.draw = function() {

	let v = size.value()

	v = map(v,0,100,1,100)

	if(sizeSine.checked()){

		size.value(map(100 * abs(sin(frameCount*0.04)),0,100,1,100))

	}

	if(freeDrawingCheckmark.checked()){
	if(b.mouseIsPressed){

		if (
		b.mouseX < 0 ||
		b.mouseX > b.width ||
		b.mouseY < 0 ||
		b.mouseY > b.height
		) {
		return;} else {

		if (
		textureImg &&
		textureImg.width > 0 &&
		textureImg.height > 0
		) {
			g.image(textureImg, b.mouseX, b.mouseY, v, v);
		}
	}
}
		b.cursor("data/icons/4x/pencil.png",0.1,20)
	} else {b.cursor(ARROW);}

	if(noiseDrawing.checked()){

		let noiseX = b.width * noise(0.005 * frameCount);
		let noiseY = b.height * noise(0.003 * frameCount);

		if (
		textureImg &&
		textureImg.width > 0 &&
		textureImg.height > 0
		) {
			g.image(textureImg, noiseX, noiseY, v, v);
		}
		}

		b.image(g,b.width/2,b.height/2)
	}


	}



function setup() {
	
	createCanvas(windowWidth, windowHeight)
	
	let savedpositions = getItem('positions')

	if (savedpositions) {

		selectX = savedpositions.selectX
		selectY = savedpositions.selectY
		drawingX = savedpositions.drawingX
		drawingY = savedpositions.drawingY
		patternsX = savedpositions.patternsX
		patternsY = savedpositions.patternsY
		previewX = savedpositions.previewX
		previewY = savedpositions.previewY

	} else { 

		selectX = 10
		selectY = 10
		drawingX = 500
		drawingY = 10
		patternsX = 650
		patternsY = 10
		previewX = 300
		previewY = 300


	 }

	patternsIsMinimized = getItem('patternsIsMinimized') ?? false
	drawingIsMinimized  = getItem('drawingIsMinimized') ?? false
	selectIsMinimized   = getItem('selectIsMinimized') ?? false
	previewIsMinimized  = getItem('previewIsMinimized') ?? false


	//img.resize(width/2,0)
	//capture = createCapture(VIDEO)

	//capture.hide()

	patternHolder = createDiv()
		.position(patternsX, patternsY)
	    .class('guiHolder') // add class for styling via CSS
		.style('width:275px;')
	
	patternWindow = createDiv().parent(patternHolder).class('window').style('position:sticky')

		patternMinimize = createButton('')
			.parent(patternWindow)
			.style("background-image:url('data/icons/4x/minimize.png')")
			.class('minimize')
	
		savedPatterns = createDiv('saved patterns')
		.parent(patternHolder)
		.class ('windowTitle')
		.draggable(patternHolder)

	patternContents = createDiv()
		.parent(patternHolder)
		patternContents.style(
        'display',
        patternsIsMinimized ? 'none' : 'block'
    );

	patternMinimize.style(
		
		'background-image',
		
		patternsIsMinimized ? 'url("data/icons/4x/plus.png")' : 'url("data/icons/4x/minimize.png")' )
	
	archiveHolderNav = createDiv()
			.parent(patternContents)
			.class('archiveHolderNav')

	archiveHolder = createDiv()
			.parent(patternContents)
			.class('archiveHolder')
			.style('height:350px;overflow:scroll;')


	archiveHolderTextures = createDiv()
				.parent(archiveHolder)



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

	previewHolder = createDiv().position(previewX, previewY).style('width:300px')
		.class('guiHolder')

		previewWindow = createDiv().parent(previewHolder).class('window')

			previewMinimize = createButton('')
			.parent(previewWindow)
			previewMinimize.style(
		
		'background-image',
		
		previewIsMinimized ? 'url("data/icons/4x/plus.png")' : 'url("data/icons/4x/minimize.png")' )
			.class('minimize')

			previewTitle = createDiv("preview")
			.parent(previewHolder)
			.draggable(previewHolder)
			.class('windowTitle')

		previewContents = createDiv().parent(previewHolder)
	  	  	previewP5 = new p5(Preview3D, previewContents.elt);
			previewContents.style(
        'display',
        previewIsMinimized ? 'none' : 'block'
    );

	selectHolder = createDiv().style('width:500px;')
		.position(selectX, selectY)
		.class('guiHolder')

		selectWindow = createDiv()
			.parent(selectHolder)
			.class("window")

			selectTitle = createDiv("glitcher")
				.parent(selectHolder)
				.draggable(selectHolder)
				.class('windowTitle')

			selectMinimize = createButton('')
				.parent(selectWindow)
				.style("background-image:url('data/icons/4x/minimize.png')")
				.class('minimize')
		
		selectContents = createDiv().parent(selectHolder)
			selectP5 = new p5(Select3D, selectContents.elt);
			 selectContents.style(
        'display',
        selectIsMinimized ? 'none' : 'block'
	)

	selectMinimize.style(
		
		'background-image',
		
		selectIsMinimized ? 'url("data/icons/4x/plus.png")' : 'url("data/icons/4x/minimize.png")' )

	storeItem('selectIsMinimized',selectIsMinimized)
		
	drawingBoard = createDiv().position(drawingX, drawingY).style('width:640px;')
		.class('guiHolder')

		drawingWindow = createDiv()
			.parent(drawingBoard)
			.class('window')

			drawingBoardTitle = createDiv("drawing board")
				.parent(drawingBoard)
				.draggable(drawingBoard)
				.class('windowTitle')
		
			drawingMinimize = createButton('')
				.parent(drawingWindow)
				drawingMinimize.style(
		
					'background-image',
					drawingIsMinimized ? 'url("data/icons/4x/plus.png")' : 'url("data/icons/4x/minimize.png")' )
				.class('minimize')
				
		
		drawingBoardContents = createDiv().parent(drawingBoard)
			drawingP5 = new p5(DrawingBoard, drawingBoardContents.elt)
			drawingBoardContents.style(
			'display',
			drawingIsMinimized ? 'none' : 'block'
			);
				
	backgroundChanger = createDiv()
		.style('position:absolute; bottom:0; right:0;')
		
	backgroundChangerButton = createFileInput(handleImage)
		.parent(backgroundChanger)
		
		// create <style> tag for custom css (note `backticks` for multi-line value!) 
  createElement('style', ` 
  *{ 
    outline: none; 
    box-sizing: border-box;
	-ms-overflow-style: none;  /* IE and Edge */
  	scrollbar-width: none;  /* Firefox */

	-webkit-user-select: none; /* Safari */
	-ms-user-select: none; /* IE 10 and IE 11 */
	user-select: none; /* Standard syntax */
  } 

  @font-face {
  	font-family:Neue Haas Unica; /* set name */
  	src: url(data/fonts/NeueHaasUnicaPro-Regular.otf); /* url of the font */
	}

	body{
		overflow: hidden;
		}	

    .guiHolder{ 
		background-color:black;
		border: 1px solid black;
		filter: drop-shadow(3px 3px 0.5px black);
    } 

	.archiveHolder{
	  background-color: black;
	  color:#fff; 
      font-family:Neue Haas Unica;
      font-size:12pt;
	  text-align:center;
	}

	.randomByteDiv {

      	font-family:Neue Haas Unica; 
      	font-size:24pt;
      	padding:5px;
		justify-content: space-evenly;

	}

    .label{ 
      color:#fff; 
      font-family:Neue Haas Unica; 
      font-size:36pt;
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
		margin-right: 5px;
		font-family:Neue Haas Unica;
    }

	.button:hover {
    	margin-bottom: 10px;
		background-color: #fff;
		color: black;
		border: 2px solid #fff;x
		transition: 0.5s;
    }

	input[type=text]{
		width:30%;
	}

	.checkbox{
    	margin-bottom: 10px;
		font-family: Neue Haas Unica;
		font-size: 10pt;
		padding:10px;
		float:left;
	}

	.archive {
		padding-bottom:0px;
		margin: 5px;
		border: 2px solid hidden;
		float:left;
		width:75px;
		height:75px;
		position:relative;
	}
	
	.tempImg{
	
		width: 100%;
	
	}

	.tempImg:hover {
		padding-bottom:0px;
		border: 2px solid #fff;

		}

	.clearScreen {
		color:white;
		display:none;
		position: absolute;
		top: 0px;
		right: 0px;
		}

	.closeButton {
		margin: 5px;
		padding: 5px;
		background-color: black;
		font-family: Neue Haas Unica;
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
		top: 0;
		text-align:center;
		padding-top:15px;
	}

	.imageContainer {
	
		width:100px;
		height:100px;
	}

	.window {
	
		position: relative; 
		float:left; 
		padding:5px; 
		display: flex; 
		align-items: center; 
		justify-content: center;
	
	}

	.minimize {
	
		background-size: 100% 100%;
		width:18px;
		height:18px;
	
	}

	.windowTitle {
	
		background: #6495ED;
		font-family:Neue Haas Unica;
		text-align:left; 
		padding: 3px;

	input[type="color"] {
	-webkit-appearance: none;
	border: none;
	width: 32px;
	height: 32px;
	}

	input[type="color"]::-webkit-color-swatch-wrapper {
		padding: 0;
	}
	
	input[type="color"]::-webkit-color-swatch {
		border: none;
	}
	
	}

    `) 

	saveFile.mousePressed(function(){save(textureImg,'myPattern.jpg')})

	grabArchive()

	 let savedBackground = getItem('backgroundImage');

  if (savedBackground) {
    loadImage(savedBackground, function(img) {
      backgroundImg = img;
    });

	
	
}


selectMinimize.mousePressed(function() {
    selectIsMinimized = !selectIsMinimized;

    selectContents.style(
        'display',
        selectIsMinimized ? 'none' : 'block'
	)

	selectMinimize.style(
		
		'background-image',
		
		selectIsMinimized ? 'url("data/icons/4x/plus.png")' : 'url("data/icons/4x/minimize.png")' )

	storeItem('selectIsMinimized',selectIsMinimized)

});



previewMinimize.mousePressed(function() {
    previewIsMinimized = !previewIsMinimized;

    previewContents.style(
        'display',
        previewIsMinimized ? 'none' : 'block'
    );

	previewMinimize.style(
		
		'background-image',
		
		previewIsMinimized ? 'url("data/icons/4x/plus.png")' : 'url("data/icons/4x/minimize.png")' )

	storeItem('previewIsMinimized',previewIsMinimized)
})

drawingMinimize.mousePressed(function() {
    drawingIsMinimized = !drawingIsMinimized;

    drawingBoardContents.style(
        'display',
        drawingIsMinimized ? 'none' : 'block'
    );

	drawingMinimize.style(
		
		'background-image',
		
		drawingIsMinimized ? 'url("data/icons/4x/plus.png")' : 'url("data/icons/4x/minimize.png")' )

	storeItem('drawingIsMinimized',drawingIsMinimized)

})

patternMinimize.mousePressed(function() {
    patternsIsMinimized = !patternsIsMinimized;

    patternContents.style(
        'display',
        patternsIsMinimized ? 'none' : 'block'
    );

	patternMinimize.style(
		
		'background-image',
		
		patternsIsMinimized ? 'url("data/icons/4x/plus.png")' : 'url("data/icons/4x/minimize.png")' )
	
	storeItem('patternsIsMinimized',patternsIsMinimized)

})

drawingBoard.mousePressed(function(){

	windowIsSelected = true

	zIndex += 1

	drawingBoard.style('z-index:' + zIndex)

})

previewHolder.mousePressed(function(){

	windowIsSelected = true

	zIndex += 1

	previewHolder.style('z-index:' + zIndex)

})

patternHolder.mousePressed(function(){

	zIndex += 1

	patternHolder.style('z-index:' + zIndex)

})

selectHolder.mousePressed(function(){

	isSelected = true

	zIndex += 1

	selectHolder.style('z-index:' + zIndex)

})

selectHolder.mouseOut(function(){

	isSelected = false

})


}

function draw(){

	if (backgroundImg){
		image(backgroundImg,0,0,width,height)
	} else {background(244,226,121)}

	cursor(ARROW)

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
				tempImg.parent()
				loadImage(entry.image, function(img){
					textureImg = img
				})

			})
			c++
		}
	}

}

function handleImage(file) {
  if (file.type === 'image') {

    storeItem('backgroundImage', file.data);

    loadImage(file.data, function(img) {
      backgroundImg = img;
    });

  }
}

function mouseDragged(){

	storeItem('positions', {

		selectX: selectHolder.position().x,
		selectY: selectHolder.position().y,
		patternsX: patternHolder.position().x,
		patternsY: patternHolder.position().y,
		drawingX: drawingBoard.position().x,
		drawingY: drawingBoard.position().y,
		previewX: previewHolder.position().x,
		previewY: previewHolder.position().y

	})


}