class DropDownMenu {
    constructor(app){
        this.app = app;
        this.features = null;
        this.container = new PIXI.Container();
        this.mainButton = this.createAddButton(10, 10);
        this.container.addChild(this.mainButton);
        this.container.interactive = true;

        this.subMenuContainer = new PIXI.Container();
        this.subMenuContainer.position.set(this.mainButton.width, 0);
        this.container.addChild(this.subMenuContainer);

        this.subMenuContainer.visible = false;
        this.mainButton.on('pointerdown', this.showSubMenu.bind(this));
        this.container.on('pointerout', this.hideSubMenu.bind(this));
    }
    addFeatures(){
        for (let i = 0; i < this.features.length; i++){
            console.log(this.features[i]);
            const button = this.createButton(this.features[i].Type, 0, i * 30);
            this.subMenuContainer.addChild(button);
        }
    }

    createButton(label, x, y) {
        const button = new PIXI.Graphics();
        button.beginFill(0x282828);
        button.drawRect(0, 0, 200, 30);
        button.endFill();
        button.name = label;
        button.interactive = true;
        button.cursor = 'pointer';
        button.position.set(x, y);
    
        const buttonText = new PIXI.Text("Add " + label + " Node", { fontSize: 14, fill: 0xefefef });
        buttonText.position.set(10, 4);
    
        button.addChild(buttonText);

        button.on('pointerover', function() {
            button.clear();
            button.beginFill(0x3f3f3f);
            button.drawRect(0, 0, 200, 30);
            button.endFill();
            button.addChild(buttonText);
        });

        button.on('pointerout', function() {
            button.clear();
            button.beginFill(0x282828);
            button.drawRect(0, 0, 200, 30);
            button.endFill();
            button.addChild(buttonText);
        });
        button.on('click', function() {this.app.uiControls.addNode(label); this.subMenuContainer.visible = false;}.bind(this));
    
        return button;
    }

    showSubMenu() {
        this.subMenuContainer.visible = true;
        this.subMenuContainer.x = 50;
        this.subMenuContainer.y = 10;
    }
    showSubMenuRMB(point) {
        this.subMenuContainer.visible = true;
        this.subMenuContainer.x = point.x;
        this.subMenuContainer.y = point.y;
    }
    hideSubMenu() {
        this.subMenuContainer.visible = false;
    }
    createAddButton(x, y){
        const button = new PIXI.Graphics();
        button.beginFill(0x282828);
        button.drawRoundedRect(0, 0, 40, 40, 5);
        button.endFill();
        button.lineStyle(4, 0xE5E5E5);
        button.moveTo(20, 4);
        button.lineTo(20, 36);
        button.moveTo(4, 20);
        button.lineTo(36, 20);
        button.interactive = true;
        button.cursor = 'pointer';
        button.position.set(x, y);
    
        button.on('pointerover', function(){button.alpha = .8});
        button.on('pointerout', function(){button.alpha = 1});
    
        return button;     
    }
}

