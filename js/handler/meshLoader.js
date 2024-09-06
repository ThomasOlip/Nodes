function loadJSON(callback) {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', 'js/model/meshData.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(null);
}

loadJSON(function(data) {
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x575757,
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio,
    });

    document.body.appendChild(app.view);

    function resize() {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', resize);

    let uiLayer = null;
    let linesVisible = true;

    class VertexButton extends PIXI.Graphics {
        constructor(vert) {
            super();
            this.vert = vert;
            this.id = vert.id;
            this.beginFill(0xFF7900);
            this.drawCircle(0, 0, 2.5);
            this.endFill();
            this.x = vert.x;
            this.y = vert.y;
        }

        update() {
            this.vert.x = this.x;
            this.vert.y = this.y;
        }

        setVisible(visible) {
            this.visible = visible;
        }
    }

    class EdgeButton extends PIXI.Graphics {
        constructor(edge, vertFrom, vertTo) {
            super();
            this.id = edge.id;
            this.vertFrom = vertFrom;
            this.vertTo = vertTo;
            this.lineStyle(1, 0x000000);
            this.moveTo(vertFrom.x, vertFrom.y);
            this.lineTo(vertTo.x, vertTo.y);
        }

        update() {
            this.clear();
            this.lineStyle(1, 0x000000);
            this.moveTo(this.vertFrom.x, this.vertFrom.y);
            this.lineTo(this.vertTo.x, this.vertTo.y);
        }

        setVisible(visible) {
            this.visible = visible;
        }
    }

    function createMesh(meshData) {
        const vertices = meshData.vertices;
        const edges = meshData.edges;
        const polygon = new PIXI.Graphics();
        const blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = meshData.blurAmount;
        polygon.filters = [blurFilter];
        polygon.alpha = meshData.opacity;

        app.stage.addChild(polygon);

        const buttonContainer = new PIXI.Container();
        app.stage.addChild(buttonContainer);

        const edgeButtons = [];
        const vertButtons = [];

        for (let i = 0; i < edges.length; i++) {
            const ebutton = new EdgeButton(edges[i], vertices[edges[i].from], vertices[edges[i].to]);
            edgeButtons.push(ebutton);
            buttonContainer.addChild(ebutton);
        }

        for (let i = 0; i < vertices.length; i++) {
            const vbutton = new VertexButton(vertices[i]);
            vertButtons.push(vbutton);
            vbutton.interactive = true;
            vbutton.cursor = 'pointer';

            vbutton
                .on('pointerdown', onDragStart)
                .on('pointerup', onDragEnd)
                .on('pointerupoutside', onDragEnd)
                .on('pointermove', onDragMove);

            buttonContainer.addChild(vbutton);
        }

        let dragging = null;
        let dragOffset = null;

        function onDragStart(event) {
            dragging = this;
            dragOffset = event.data.getLocalPosition(this.parent);
            dragOffset.x -= this.x;
            dragOffset.y -= this.y;
            this.beginFill(0xffffff);
            this.drawCircle(0, 0, 2.5);
            this.endFill();
        }

        function onDragEnd() {
            if (dragging) {
                this.beginFill(0xFF7900);
                this.drawCircle(0, 0, 2.5);
                this.endFill();
                dragging = null;
            }
            dragOffset = null;
        }

        function onDragMove(event) {
            if (dragging) {
                const newPosition = event.data.getLocalPosition(dragging.parent);
                dragging.x = newPosition.x - dragOffset.x;
                dragging.y = newPosition.y - dragOffset.y;
                vertButtons.forEach((vertButton) => vertButton.update());
                edgeButtons.forEach((edgeButton) => edgeButton.update());
                updatePolygon();
            }
        }

        function updatePolygon() {
            polygon.clear();
            polygon.beginFill(meshData.backgroundColor);
            polygon.moveTo(vertices[0].x, vertices[0].y);
            for (let i = 1; i < vertices.length; i++) {
                polygon.lineTo(vertices[i].x, vertices[i].y);
            }
            polygon.closePath();
            polygon.endFill();
        }

        updatePolygon();

        return { edgeButtons, vertButtons };
    }

    const meshes = [];
    for (let i = 0; i < data.meshes.length; i++) {
        const mesh = createMesh(data.meshes[i]);
        meshes.push(mesh);
    }

    window.addEventListener('keydown', function (event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            linesVisible = !linesVisible;
            meshes.forEach((mesh) => {
                mesh.edgeButtons.forEach(edge => edge.setVisible(linesVisible));
                mesh.vertButtons.forEach(vertex => vertex.setVisible(linesVisible));
            });

            if (!uiLayer) {
                uiLayer = new PIXI.Container();
                /* const uiBackground = new PIXI.Graphics();
                uiBackground.beginFill(0x000000, 0.5);
                uiBackground.drawRect(0, 0, app.screen.width, app.screen.height);
                uiBackground.endFill();
                uiLayer.addChild(uiBackground);
                */

                const uiText = new PIXI.Text('Nodes Setup', { fontFamily: 'Arial', fontSize: 22, fill: 0xffffff });
                uiText.x = app.screen.width / 2 - uiText.width / 2;
                uiText.y = 40;
                uiLayer.addChild(uiText);

                app.stage.addChild(uiLayer);
            }

            uiLayer.visible = !linesVisible;
        }
    });

    app.ticker.add(() => {});
});