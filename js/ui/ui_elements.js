class LabeledButton {
    constructor(app, x, y, width, height, label) {
        this.container = new PIXI.Container();
        this.container.position.set(x, y);
        this.width = width;
        this.height = height;

        this.color = 0x545454;

        this.background = new PIXI.Graphics();
        this.background.beginFill(this.color);
        this.background.drawRoundedRect(0, 0, this.width, this.height, 5);
        this.background.endFill();
        this.container.addChild(this.background);

        this.text = new PIXI.Text(label, { fontSize: 14, fill: 0xffffff });
        this.text.position.set(5, height * 0.5 - this.text.height * 0.5 + 1);
        this.container.addChild(this.text);

        this.container.interactive = true;
        this.container.cursor = 'pointer';
        this.container.on('pointerdown', () => {
            console.log('Button clicked');

            if(this.colorPicker) {
                this.colorPicker.destroy({ children: true });
                this.colorPicker = null;
            } else {
                this.colorPicker = new ColorPicker(app);
                this.colorPicker.position.set(200, 0);
                this.container.addChild(this.colorPicker);

            }


        });
        this.container.on('pointerover', () => {
            this.container.alpha = .8;
        });
        this.container.on('pointerout', () => {
            this.container.alpha = 1;
        });
    }
    changeColor(color){
        this.color = color;
        this.background.clear();
        this.background.beginFill(color);
        this.background.drawRoundedRect(100, 0, this.width -100, this.height, 5);
        this.background.endFill();
    }
    setInactive(){
        this.background.clear();
    }
}

class CircularButton extends PIXI.Container{
    constructor(app, x, y, radius, defaultColor, hoverColor, name) {
        super();
        this.app = app;
        this.name = name;
        this.position.set(x, y);

        this.radius = radius;
        this.defaultColor = defaultColor;
        this.hoverColor = hoverColor;

        this.button = new PIXI.Graphics();
        this.button.beginFill(this.defaultColor);
        this.button.drawCircle(0, 0, this.radius);
        this.button.endFill();
        this.addChild(this.button);

        this.interactive = true;
        this.cursor = 'pointer';

        this.on('pointerover', this.onPointerOver.bind(this));
        this.on('pointerout', this.onPointerOut.bind(this));
        this.on('pointerdown', this.onPointerDown.bind(this));
    }

    onPointerOver() {
        this.button.tint = this.hoverColor;
    }

    onPointerOut() {
        this.button.tint = this.defaultColor;
    }

    onPointerDown() {
        console.log('Button clicked: ' + this.name);
    }
    addOutline(){
        this.button.lineStyle(1, 0x000000);
        this.button.drawCircle(0, 0, this.radius);
        this.button.endFill();        
    }
}


class Checkbox {
    constructor(app, x, y, label) {
        this.app = app;
        this.container = new PIXI.Container();
        this.container.position.set(x, y);

        this.background = new PIXI.Graphics();
        this.background.beginFill(0xeeeeee);
        this.background.drawRoundedRect(0, 0, 20, 20, 5);
        this.background.endFill();
        this.container.addChild(this.background);

        this.tick = new PIXI.Graphics();
        this.tick.lineStyle(2, 0x000000);
        this.tick.moveTo(4, 10);
        this.tick.lineTo(9, 14.5);
        this.tick.lineTo(16, 6);
        this.tick.visible = false;
        this.container.addChild(this.tick);

        this.container.interactive = true;
        this.container.cursor = 'pointer';
        this.container.on('pointerdown', this.toggleCheckbox.bind(this));
        this.container.on('pointerover', () => {
            this.container.alpha = .8;
        });
        this.container.on('pointerout', () => {
            this.container.alpha = 1;
        });
    }

    setToggle(bool){
        this.tick.visible = bool;
    }

    toggleCheckbox() {
        this.tick.visible = !this.tick.visible;
    }
}

class Slider {
    constructor(app, x, y, width, minValue, maxValue, value, label) {
        this.app = app;
        this.container = new PIXI.Container();
        this.container.position.set(x, y);

        this.value = value;
        console.log(this.value);
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.width = width;

        this.background = new PIXI.Graphics();
        this.background.beginFill(0x545454);
        this.background.drawRoundedRect(0, 0, width, 25, 5);
        this.background.endFill();
        this.container.addChild(this.background);

        this.handle = new PIXI.Graphics();
        this.handleColor = 0x777777;
        this.handle.drawRect(0, 0, 0, 25);
        this.handle.endFill();
        this.background.addChild(this.handle);

        this.label = new PIXI.Text(label, {
            fontSize: 14,
            fill: 0xffffff
        });
        this.label.position.set(5, 2);
        this.background.addChild(this.label);

        this.valueText = new PIXI.Text(this.value, {
            fontSize: 14,
            fill: 0xffffff
        });
        this.valueText.position.set(width - 5, 2);
        this.valueText.anchor.set(1, 0);
        this.background.addChild(this.valueText);

        this.container.interactive = true;
        this.container.cursor = 'pointer';
        this.container.on('pointerdown', this.onSliderDown.bind(this));
        this.container.on('pointerover', () => {
            this.container.alpha = .8;
        });
        this.container.on('pointerout', () => {
            this.container.alpha = 1;
        });
        this.onSliderMove = this.onSliderMove.bind(this);
        this.onSliderUp = this.onSliderUp.bind(this);

        this.setSliderPosition(this.value); // Set initial value
    }

    onSliderDown(event) {
        this.container.on('pointermove', this.onSliderMove);
        this.container.on('pointerup', this.onSliderUp);
        this.container.on('pointerupoutside', this.onSliderUp);

        this.updateSliderPosition(event);
    }

    onSliderMove(event) {
        this.updateSliderPosition(event);
    }

    onSliderUp() {
        this.container.off('pointermove', this.onSliderMove);
        this.container.off('pointerup', this.onSliderUp);
        this.container.off('pointerupoutside', this.onSliderUp);
    }

    updateSliderPosition(event) {
        const newPosition = event.data.getLocalPosition(this.container.parent);
        const clampedX = Math.max(0, Math.min(this.width, newPosition.x - this.container.x));
        const value = Math.round(this.minValue + (clampedX / this.width) * (this.maxValue - this.minValue));

        this.handle.clear();
        this.handle.beginFill(this.handleColor);
        this.handle.drawRoundedRect(0, 0, clampedX, 25, 5);
        this.handle.endFill();

        this.valueText.text = value.toString();
    }

    setSliderPosition(value) {
        //const value = Math.round(this.minValue + (clampedX / this.width) * (this.maxValue - this.minValue));
        const clampedX = Math.round((value - this.minValue) * (this.width / (this.maxValue - this.minValue)));

        this.handle.clear();
        this.handle.beginFill(this.handleColor);
        this.handle.drawRoundedRect(0, 0, clampedX, 25, 5);
        this.handle.endFill();

        this.valueText.text = value;
    }
}


class Box extends PIXI.Container {
    constructor(app, x, y, width, height, title) {
        super();
        this.app = app;

        this.widthX = width;
        this.heightY = height;

        this.background = new PIXI.Graphics();
        this.drawBackground();
        this.addChild(this.background);

        this.headerButton = new PIXI.Container();
        this.headerButton.interactive = true;
        this.headerButton.cursor = 'pointer';
        this.headerButton.name = "unselected";
        this.addChild(this.headerButton);

        this.header = new PIXI.Graphics();

        this.header.beginFill(0x1D1D1D);

        const offset = 1;
        const hwidthX = this.widthX;
        const hheight = 30;
        const hradius = 4;
        this.header.moveTo(offset, hradius + offset);
        this.header.quadraticCurveTo(offset, offset, offset + hradius, offset);

        this.header.lineTo(hwidthX - hradius - offset , offset);
        this.header.quadraticCurveTo(hwidthX - offset, offset, hwidthX - offset, hradius + offset);
        this.header.lineTo(hwidthX - offset, hheight);
        this.header.lineTo(offset, hheight);
        this.header.lineTo(offset, hradius + offset);
        this.header.endFill();

        const margin = 1;
        const marginGraphics = new PIXI.Graphics();
        marginGraphics.beginFill(0xFFFFFF, 0);
        marginGraphics.drawRect(hwidthX, 0, margin, hheight);
        marginGraphics.endFill();

        this.headerButton.addChild(this.header);
        this.headerButton.addChild(marginGraphics);


        this.headerButton.addChild(this.header);

/* 
        this.headerButton.on('pointerdown', this.onPointerDown.bind(this));
        this.headerButton.on('pointerup', this.onPointerUp.bind(this));
        this.headerButton.on('pointerupoutside', this.onPointerUp.bind(this));
        this.headerButton.on('pointermove', this.onPointerMove.bind(this));
 */        
        this.titleText = new PIXI.Text(title, { fontSize: 16, fill: 0xE6E6E6 });
        this.titleText.position.set(10, 3);
        this.header.addChild(this.titleText);

        this.isDragging = false;
        this.pointerData = null;
        this.initialPointerPos = { x: 0, y: 0 };
        this.pointerStartPos = new PIXI.Point();
        this.containerStartPos = new PIXI.Point();
    }
/*
    onPointerDown(event) {
        if (event.target === this.headerButton) {
            this.pointerData = event.data;
            this.initialPointerPos = this.pointerData.getLocalPosition(this.container.parent);
            this.containerStartPos.copyFrom(this.container.position);
            this.pointerStartPos.copyFrom(this.pointerData.global);

            //console.log("containerstart " + this.containerStartPos.x);
            //console.log("pointerstart" + this.pointerStartPos.x);
            //console.log("initialPointerPos" + this.initialPointerPos.x);
            
        } else {
            this.isDragging = true;
            this.pointerData = event.data;
            this.container.alpha = 0.8;
        }
    }

    onPointerMove() {
        if (this.isDragging) {
            const newPosition = this.pointerData.getLocalPosition(this.container.parent);
            //console.log("newPosition: " + newPosition.x);
            const deltaX = newPosition.x - this.initialPointerPos.x;
            const deltaY = newPosition.y - this.initialPointerPos.y;
            //console.log("deltaX " + deltaX);

            this.container.position.x += deltaX;
            this.container.position.y += deltaY;
            this.initialPointerPos = newPosition.clone();
        } else if (this.pointerData) {
            const newPosition = this.pointerData.getLocalPosition(this.container.parent);
            const deltaX = (this.pointerData.global.x - this.pointerStartPos.x) / this.container.parent.scale.x;
            const deltaY = (this.pointerData.global.y - this.pointerStartPos.y) / this.container.parent.scale.x;
            
            //console.log(typeof(deltaX));

            //console.log("newPosition: " + newPosition.x);
            //console.log("deltaX " + deltaX);
            //console.log("initialPointerPos " + this.initialPointerPos.x);
            //console.log("this.containerStartPos.x " + this.containerStartPos.x);
            //console.log("this.containerStartPos.x + deltax " + this.containerStartPos.x + deltaX);

             this.container.position.set(
                this.containerStartPos.x + deltaX,
                this.containerStartPos.y + deltaY
            );

            //console.log(this.container.position.x);
            //console.log(this.container.x);

        }
    }

    onPointerUp() {
        this.isDragging = false;
        this.pointerData = null;
        this.container.alpha = 1;
    }
*/
    drawBackground(height, color, lineThickness) {
        this.background.clear();
        this.background.lineStyle(lineThickness, color);
        this.background.beginFill(0x30302F);
        this.background.drawRoundedRect(0, 0, this.width, height, 5);
        this.background.endFill();
    }
}


class Nodeport extends PIXI.Container {
    constructor(app, label, dataType, name, index){
        super();
        this.label = label;
        this.name = name;
        this.index = index;
        this.dataType = dataType;
        this.multiple = false;
        this.hoverColor = 0xFF0000;
        this.buttonColor = 0xEEEEEE;
        this.setColor();
        this.button = new CircularButton(app, 0, 0, 6, this.buttonColor, this.hoverColor, this.name);
        this.addChild(this.button);
    }
    setColor(){
        switch(this.label){
            case "Vertices":
                this.buttonColor = 0xAAFFCC;
            break;
            case "Mask":
                this.buttonColor = 0xFFAACC;
            break;
            case "Canvas":
                this.buttonColor = 0xFFAACC;
            break;
        }
    }
}