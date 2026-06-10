//for the glitch screen
let glitch
let capture
let img
let backgroundImg
let test

let firstPatternChosen = false;

let isRotating

let drawingIsSelected

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

let posX,posY
let Xcounter = 0
let Ycounter = 0

let floatingshapes = []
let drawings = []

let imageLoaded = false

function preload(){

	img = loadImage("data/images/what-do-parrots-look-like.jpg")
	
}

var Preview3D = function(p) {
  p.setup = function() {

    p.createCanvas(300, 300, p.WEBGL);
	
	previewGUI = p.createDiv()
		.style('background-color:white; color:black;font-family:Pixter; padding-left:5px; padding-top:10px;')

	checkbox1 = p.createButton("rotate")
		.class('button')
		.parent(previewGUI)

	shapeSelect = p.createSelect()
		.class('button')
		.parent(previewGUI)

	//dropdown for the 3d shape selection
  	shapeSelect.option('box',1);
  	shapeSelect.option('cylinder',2);
	shapeSelect.option('sphere',3);
	shapeSelect.option('torus',4);

	addShapeButton = p.createButton("send to background")
		.class('button')
		.parent(previewGUI)
		.mousePressed(addShape)

  };
 
  p.draw = function() {

	p.background(0)

	shapeNum = shapeSelect.value()

	p.push()
	p.noStroke()
	p.texture(textureImg)

	checkbox1.mousePressed(function(){

		isRotating = !isRotating

	})

	if (isRotating == true) {
		
		p.rotateX(frameCount*0.03)
		p.rotateY(frameCount*0.03)
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
		.style('background-color:white; width: auto; height: 60px; padding:5px;')
		.style('display:grid; grid-template-columns: auto auto auto; align-text: center')
	
	s.realfileInput = s.createDiv()
		.parent(selectGUI)
		.class('button')
		.style('font-size: 12pt; width:105px; position:absolute; left:0 height: auto;')

	s.fileInputText = s.createDiv('change image')
		.parent(s.realfileInput)
		.style('position: absolute; padding-left: 5px;')
	s.fileInput = s.createFileInput(s.handleImage)
		.parent(s.realfileInput)
		.style('position:relative; width: 105px; opacity: 0%')
	
	s.randomByteGrid = s.createDiv()
		.parent(selectGUI)
		.style('position:absolute; right:0; grid-template-columns: auto auto auto; align-items: left;')
		
	s.inputByteTitle = s.createDiv('replace bytes:')
			.parent(s.randomByteGrid)
			.style('font-family: Pixter; font-size: 12pt; padding-right: 5px;')

	s.randomBytesButtons = s.createDiv('')
		.parent(s.randomByteGrid)
		.style('display: flex; align-items: center; justify-contents: center;')

	s.randomBytesButton = s.createButton('')
			.parent(s.randomBytesButtons)
			.class('button')
			.style('display: flex; background-size: 100% 100%; width:25px;height:25px; background-image:url("data/icons/4x/random.png"); margin: 0; line-height: 0; margin-right:5px;')

	s.inputByte1 = s.createInput(floor(random(1,100))) // randomByte
		.parent(s.randomBytesButtons)

	s.inputByte2 = s.createInput(floor(random(1,100))) // randomByte
		.parent(s.randomBytesButtons)

	s.inputByte1.changed(s.glitchSample)
	s.inputByte2.changed(s.glitchSample)
	
	s.randomBytesButton.mousePressed(function(){let r1 = random(1,100); let r2 = random(1,100); s.inputByte1.value(floor(r1));
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

	if (!s.outside) {

    s.rectSizeX = s.mouseX - s.rectOriginX;
    s.rangeSize = abs(s.rectSizeX);

    textureImg = s.glitch.image.get(
        s.positionX,
        s.positionY,
        s.rangeSize,
        s.rangeSize
    );
	}

	textureImg  = s.glitch.image.get(s.positionX,s.positionY,s.rangeSize,s.rangeSize)
	}

	s.glitchSample = function(){

	img.resize(s.width,s.height)

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


var DrawingBoard = function(b,g,m) {

	b.brushSize = 10
	
  b.setup = function() {

    myDrawing = b.createCanvas(640, 300);

	g = createGraphics(640,300)

	m = createGraphics(640,300)

	b.DrawingBoardDiv = b.createDiv()
	.style('padding:0px;color:white; font-family:Pixter; position:absolute; top:0px;')
	
	b.drawingBoardTools = b.createDiv()
	.parent(b.DrawingBoardDiv)
	.style('position: absolute; top: 0px; align-text: center; margin-bottom: 5px; top: 30px; padding: 10px; width: 50px; height: 301px; padding-bottom: 10px;')

	freeDrawingCheckmark = b.createCheckbox('')
	.parent(b.drawingBoardTools)
	.style('background-image:url("data/icons/4x/free_draw_checked.png"); background-size: 100% 100%; width:32px; width: 32px; height: 32px; border: 2px solid white;')

	noiseDrawing = b.createCheckbox('')
	.parent(b.drawingBoardTools)
	.style('background-image:url("data/icons/4x/noise.png"); background-size: 100% 100%; width:32px; width: 32px; height: 32px; border: 2px solid white;')

	sizeSine = b.createCheckbox('')
	.parent(b.drawingBoardTools)
	.style('background-image:url("data/icons/4x/scale.png"); background-size: 100% 100%; width:32px; width: 32px; height: 32px; border: 2px solid white;')

	b.myPicker = b.createColorPicker('#98ECC5')
	.parent(b.drawingBoardTools)
	.style('position:absolute; bottom:10px;; left:10px;')

	b.drawingBoardOther = b.createDiv()
	.style('position:absolute; bottom:0; right:0;')

	clearSketch = b.createButton('clear sketch')
	.parent(b.drawingBoardOther)
	.class('button')
	saveSketch = b.createButton('save sketch')
	.parent(b.drawingBoardOther)
	.class('button')
	sendToWallpaper = b.createButton('send to background')
	.parent(b.drawingBoardOther)
	.class('button')
	.mousePressed(function(){

		newDrawing = new b.Drawing(random(width),random(height))
		drawings.push(newDrawing)
		print(drawings.length)

	})

	const blendModes = {
		none: BLEND,
		add: ADD,
		difference: DIFFERENCE,
		darkest: DARKEST,
		remove: REMOVE
	};
	
	blendModeSelect = b.createSelect('send to background')
	
	.parent(b.drawingBoardOther)
	.class('button')
	
	blendModeSelect.option('none', 'none');
	blendModeSelect.option('add', 'add');
	blendModeSelect.option('difference', 'difference');
	blendModeSelect.option('darkest', 'darkest');
	blendModeSelect.option('remove', 'remove');

	blendModeSelect.changed(() => {
	const mode = blendModeSelect.value();
	g.blendMode(blendModes[mode]);
	});

	b.background(b.myPicker.value())

	clearSketch.mousePressed(function(){b.background(b.myPicker.value()); g.clear()})

	saveSketch.mousePressed(function(){b.save(myDrawing,'myDrawing.jpg')})

	b.imageMode(CENTER)
	g.imageMode(CENTER)
	m.rectMode(CENTER)
	m.noFill()

	
};


b.draw = function() {

	bgColor = b.myPicker.color()

	m.clear()
	
	if(sizeSine.checked()){

		sizeSine.style('background-image:url("data/icons/4x/scale.png"); background-size: 100% 100%; width:32px; width: 32px; height: 32px;')
		b.brushSize = map(100 * abs(sin(frameCount*0.04)),0,100,1,100)
		
	} else {sizeSine.style('background-image:url("data/icons/4x/scale_checked.png"); background-size: 100% 100%; width:32px; width: 32px; height: 32px;')}
	
	if(freeDrawingCheckmark.checked()){

		freeDrawingCheckmark.style('background-image:url("data/icons/4x/drawing_board.png")')

		if(b.mouseIsPressed){
			
			if (
				b.mouseX < 50 ||
				b.mouseX > b.width ||
				b.mouseY < 0 ||
				b.mouseY > b.height ||
				drawingIsMinimized == true ||
				drawingIsSelected == false
			) {
				return;} else {
					
					if (
						textureImg &&
						textureImg.width > 0 &&
						textureImg.height > 0
					) {
						g.image(textureImg, b.mouseX, b.mouseY, b.brushSize, b.brushSize);
					}
				}
			}

			b.noCursor()

			m.clear()
			m.rect(b.mouseX,b.mouseY,b.brushSize,b.brushSize)

		} else {b.cursor(ARROW); freeDrawingCheckmark.style('background-image:url("data/icons/4x/free_draw_checked.png")') }
		
		if(noiseDrawing.checked()){

			noiseDrawing.style('background-image:url("data/icons/4x/noise.png")')
			
			let noiseX = b.width * noise(0.005 * frameCount);
			let noiseY = b.height * noise(0.003 * frameCount);
			
			if (
				textureImg &&
				textureImg.width > 0 &&
				textureImg.height > 0
			) {
				g.image(textureImg, noiseX, noiseY, b.brushSize, b.brushSize);
			}
		} else {noiseDrawing.style('background-image:url("data/icons/4x/noise_checked.png")')}
		
		b.background(bgColor)

		b.image(g,b.width/2,b.height/2)
		b.image(m,b.width/2,b.height/2)
		

	}
	
	
	
	b.Drawing = class Drawing {
		
		constructor(x,y){
			
			this.x = x
			this.y = y
			this.i = g.get()
			
		}
		
		display(){
			
			image(this.i,this.x,this.y)
			
		}
		
		
	}

	b.mouseWheel = function(event){

		print(b.brushSize);

		b.brushSize = abs(b.brushSize + event.delta)

	}
}


function setup() {
	
	createCanvas(windowWidth, windowHeight,WEBGL)
	
	let savedpositions = getItem('positions')
	
	Xcounter += 5
	Ycounter += 5

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
	    .class('guiHolder')
		.style('width:276px;')
		 // add class for styling via CSS
	
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
			.style('height: 200px; overflow:scroll;')


	archiveHolderTextures = createDiv()
				.parent(archiveHolder)



	pushButton = createButton("save")
		.parent(archiveHolderNav)
		.class('button')
	
	clearButton = createButton("clear")
		.parent(archiveHolderNav)
		.class('button')

	saveFile = createButton('download')
		.parent(archiveHolderNav)
		.class('button')
	
	click = 0
	
	pushButton.mousePressed(pushArchive)
	clearButton.mousePressed(function(){

		click += 1

		print(click)


		if (click == 1){
			clearButton.html("sure?")
		}

		
		if (click == 2){
			clearArchive()
			click = 0
			clearButton.html('clear')
		}
		
	})

	clearButton.mouseOut(function() {

		click = 0
		clearButton.html("clear")
		
	})

	previewHolder = createDiv().position(previewX, previewY).style('width:301px')
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

	selectHolder = createDiv().style('width:502px;')
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
		
	drawingBoard = createDiv().position(drawingX, drawingY).style('width:642px;')
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
		
	shapeCleanerButton = createButton("clear shapes")
		.parent(backgroundChanger)
		.class("button")
		.mousePressed(clearShapes)

		
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

	font-smooth: never;
	-webkit-font-smoothing : none;
  } 

  @font-face {
  	font-family:Pixter; /* set name */
  	src: url(data/fonts/Pixter-Display.ttf); /* url of the font */
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
      font-family:Pixter;
      font-size:12pt;
	  text-align:center;
	}

	.randomByteDiv {

      	font-family:Pixter; 
      	font-size:24pt;
      	padding:5px;
		justify-content: space-evenly;

	}
    
    .button{
    	margin-bottom: 10px;
		background-color: white;
		color: black;
		border: 2px solid black;
		margin-right: 5px;
		font-family:Pixter;
		font-size: 11pt;
    }

	.button:hover {
    	margin-bottom: 10px;
		background-color: black;
		color: white;
		border: 2px solid black;

    }

	input[type=text]{
		width:32px;
		border: 2px solid black;
		text-align: center;
		margin-right: 5px;
		font-family: Pixter;
	}

	.checkbox{
    	margin-bottom: 10px;
		font-family: Pixter;
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
		font-family: Pixter;
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
	
		background: white;
		font-family:Pixter;
		text-align:left;
		padding: 3px;}

	input[type="color"] {
	-webkit-appearance: none;
	border: none;
	width: 32px;
	height: 32px;
	}

	input[type="color"]::-webkit-color-swatch-wrapper {
		padding: 0;
		border: none;
	}
	
	input[type="color"]::-webkit-color-swatch {
		border: none;
	}

	input[type=checkbox]{

		position: absolute;
		width:32px;
		height:32px;
		opacity: 0%;

	}

	input[type="range"],
	meter,
	progress {
	margin-block-end: 20px;
	writing-mode: vertical-lr;
	}
		
	
	}

    `) 

	saveFile.mousePressed(function(){save(textureImg,'myPattern.jpg')})

	grabArchive()


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

	drawingIsSelected = true

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

drawingBoard.mouseOut(function(){

	drawingIsSelected = false;

})



}


function draw(){

	background(100)

	cursor(ARROW)

	push()
	
	translate(-width/2,-height/2);

	for(let s of floatingshapes){

		s.show()
	}

	for(let d of drawings){

		d.display()
	}

	
	if (floatingshapes.length >= 1 || drawings.length >= 1){
		
		shapeCleanerButton.style('display:inline')
		
	} else {shapeCleanerButton.style('display:none')}
	
	pop()
	
}

class movingShape{

	constructor(x,y){

		this.posX = x
		this.posY = y
		this.textureImg = textureImg
		this.Xcounter = 5
		this.Ycounter = 5
		this.width = width
		this.height = height
		this.shapeNum = shapeNum

	}

	show() {
	
	this.posX = this.posX + this.Xcounter
	this.posY = this.posY + this.Ycounter

	if (this.posX >= this.width){
		
		this.Xcounter = -this.Xcounter
		this.posX = this.width
	}
	
	if (this.posY >= this.height){
		
		this.Ycounter = -this.Ycounter
		this.posY = this.height
		
	}
	
	if (this.posX <= 0){
		
		this.Xcounter = -this.Xcounter
		this.posX = 0
		
	}
	
	if (this.posY <= 0){
		
		this.Ycounter = -this.Ycounter
		this.posY = 0
		
	}

	push()
	translate(this.posX,this.posY)
	texture(this.textureImg)
	noStroke()
	rotateX(frameCount * 0.03)
	rotateY(frameCount * 0.03)

	if (this.shapeNum == 1) {
		box(100)
	}
	
	if (this.shapeNum == 2) {
		cylinder(50)
	}
	
	if (this.shapeNum == 3){
		sphere(50)
	}

	if (this.shapeNum == 4){
		torus(50,50)
	}

	pop()

	}

}

function addShape(){

	if(textureImg.width > 1) {
	floatingshapes.push(new movingShape(random(width), random(height)))
	print(floatingshapes.length)
	}
}

function clearShapes(){

	floatingshapes = []
	drawings = []

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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}