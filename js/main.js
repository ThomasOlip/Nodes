PIXI.settings.PREFER_ENV = 'WEBGL2';

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x555555,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio,
  });
document.body.appendChild(app.view);

document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

let vfData = null;
const uiNodeTemplateArray = [];
const uiNodeArray = [];
const nodes = {};
const connections = [];

const undoArray = [];
const redoArray = [];

const canvas = new PIXI.Container();
const container = new PIXI.Container();
const containerLinks = new PIXI.Graphics();
const connectionLine = new PIXI.Graphics();
const menuContainer = new PIXI.Container();
const selRect = new SelectionRectangle(app);
const dropDowmMenu = new DropDownMenu(app);

app.stage.addChild(canvas);
container.addChild(containerLinks);
container.addChild(connectionLine);
menuContainer.addChild(dropDowmMenu.container);
app.stage.addChild(container);
app.stage.addChild(menuContainer);

const dataControls = new DataControls(app, vfData, uiNodeArray, uiNodeTemplateArray, nodes, container);

dataControls.loadJSON();
dataControls.loadMenuData(dropDowmMenu);

app.uiControls = new UIControls(app, uiNodeArray, connections, uiNodeTemplateArray, container, containerLinks, connectionLine, selRect, dropDowmMenu);
const viewControls = new ViewControls(app, container, canvas);


const outputNode = nodes;
const outputCanvas = null;


const verts = [{"id": 0, "x": 100, "y": 100,"c": "true"},
              {"id": 1, "x": 2000, "y": 1000,"c": "true"},
              {"id": 2, "x": 1000, "y": 800,"c": "true"},
              {"id": 3, "x": 100, "y": 800,"c": "true"}
              ];


const graphicTest = Canvas.drawShape(verts, 0xFF00FF, 0x00ff00, 1, 1, 1);
graphicTest.blurX = 0;
graphicTest.blurY = 200;

const blurredSprite = null;
let gr0 = new PIXI.Graphics();
gr0.blurX = 1000;
gr0.blurY = 200;
gr0.beginFill(0x9897a2);
gr0.drawCircle(1100, 800, 400);
gr0.endFill();
gr0.beginFill(0x96a7e2, 0.5);
gr0.drawCircle(1400, 1000, 300);
gr0.endFill();
gr0.beginFill(0x08a7f, 0.7);
gr0.drawCircle(1800, 1500, 800);
gr0.endFill();

let gr1 = new PIXI.Graphics();
gr1.blurX = 120;
gr1.blurY = 0;
gr1.beginFill(0xff0000);
gr1.drawCircle(100, 100, 100);
gr1.endFill();
gr1.beginFill(0x96a7e2, 0.5);
gr1.drawCircle(400, 300, 300);
gr1.endFill();
gr1.beginFill(0x08a7f, 0.5);
gr1.drawCircle(800, 500, 500);
gr1.endFill();

let gr2 = new PIXI.Graphics();
gr2.blurX = 300;
gr2.blurY = 50;
gr2.beginFill(0xff00FF);
gr2.moveTo(100, 100);
gr2.lineTo(2200, 100);
gr2.lineTo(2300, 1800);
gr2.lineTo(350, 800);
gr2.beginHole();
gr2.moveTo(120,120);
gr2.lineTo(150,120);
gr2.lineTo(150,150);
gr2.endFill();

const blurMask = Canvas.applyBlurFilterOnGraphic(gr0, gr0.blurX, gr0.blurY);
const blurGraphics1 = Canvas.applyBlurFilterOnGraphic(gr1, gr1.blurX, gr1.blurY);
const blurGraphics2 = Canvas.applyBlurFilterOnGraphic(gr2, gr2.blurX, gr2.blurY);
const blurGraphics3 = Canvas.applyBlurFilterOnGraphic(graphicTest, graphicTest.blurX, graphicTest.blurY);

const maskedCanvas1 = Canvas.maskGraphicByGraphic(blurGraphics1, blurGraphics2);
const maskedCanvas2 = Canvas.maskGraphicByGraphic(blurMask, blurGraphics2);

const bitti = Canvas.getBitmapFromGraphicsObject(blurGraphics3);

canvas.addChild(bitti);

canvas.addChild(maskedCanvas1);
canvas.addChild(maskedCanvas2);

gr1.beginFill(0x54a76b);
gr1.drawCircle(400, 400, 100);
gr1.endFill();
gr1.beginFill(0xffaa7b);
gr1.drawCircle(500, 400, 300);
gr1.endFill();
gr1.beginFill(0xffa3333);
gr1.drawCircle(1100, 400, 300);
gr1.endFill();


function resize() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resize);
