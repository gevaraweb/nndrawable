var nndraw = {};

nndraw.Layer = function(count, form, StrokeColor, FillColor) {
    this.count = count;
    this.form = (form !== undefined) ? form.toLowerCase() : "circle";
    if (this.form != "circle" && this.form != "rectangle") this.form = "circle";
    this.form = form;
    this.StrokeColor = (StrokeColor !== undefined) ? StrokeColor : '#000000';
    this.FillColor = (FillColor !== undefined) ? FillColor : '#228B22';
}

nndraw.Layer.prototype = {
    constructor: nndraw.Layer
}



nndraw.NN = function() {
    this.dim_layers = [];
    this.layers = [];
    this.div = null;
    this.ctx = null;
}

nndraw.NN.prototype = {

    constructor: nndraw.NN,

    layers: [],
    add: function(layer) {
        this.layers.push(layer)
    },
    radius: 18,
    lineWidth: 1,
    rx: 84,
    ry: 7,
    _html: "",

    canvasFillColor: '#f494f4',

    DrawCircle: function(ctx, centerX, centerY, radius, lineWidth, strokeStyle, fillStyle, mode) {
        mod = (mode !== undefined) ? mode : "canvas";
        lineWidth = (lineWidth !== undefined) ? lineWidth : this.lineWidth;
        strokeStyle = (strokeStyle !== undefined) ? strokeStyle : "#000000";
		fillStyle = (fillStyle !== undefined) ? fillStyle : "#228B22";
        if (mod == "canvas") {
            ctx.beginPath();
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.stroke();
            ctx.fillStyle = fillStyle;
            ctx.lineWidth = (lineWidth !== undefined) ? lineWidth : 1;
            ctx.fill();
        } else {
            this._html +=
                '\t<circle cx="' + centerX + '" cy="' + centerY + '" r="' + radius + '" fill="' + fillStyle + '" stroke-width="' + lineWidth + '" stroke="' + strokeStyle + '"/>\n';
        }
    },

    DrawRect: function(ctx, centerX, centerY, width, height, lineWidth, strokeStyle, fillStyle, mode) {
        mod = (mode !== undefined) ? mode : "canvas";
        lineWidth = (lineWidth !== undefined) ? lineWidth : this.lineWidth;
        strokeStyle = (strokeStyle !== undefined) ? strokeStyle : "#000000";
		fillStyle = (fillStyle !== undefined) ? fillStyle : "#228B22";		
        if (mod == "canvas") {
            ctx.beginPath();
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
            ctx.fillStyle = fillStyle;
            ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);
            ctx.strokeRect(centerX - width / 2, centerY - height / 2, width, height);
            ctx.closePath();
        } else {
            this._html +=
                '\t<rect x="' + String(centerX - width / 2) + '" y="' + String(centerY - height / 2) + '" width="' + width + '" height="' + height + '" fill="' + fillStyle + '" stroke-width="' + lineWidth + '" stroke="' + strokeStyle + '"/>\n';
        }
    },

    DrawLine: function(ctx, x1, y1, x2, y2, lineWidth, strokeStyle, mode) {
        lineWidth = (lineWidth !== undefined) ? lineWidth : this.lineWidth;
        strokeStyle = (strokeStyle !== undefined) ? strokeStyle : "#000000";
        mod = (mode !== undefined) ? mode : "canvas";
        if (mod == "canvas") {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = strokeStyle;
            ctx.stroke();
            ctx.closePath();
        } else {
            this._html += '\t<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke-width="' + lineWidth + '" stroke="' + strokeStyle + '"/>\n';
        }
    },

    CreateCanvas: function(sizex, sizey, canvasFillColor, mode) {
        mod = (mode !== undefined) ? mode : "canvas";
        if (mod == "canvas") {
            this.canvas = document.createElement('canvas');
            this.div.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = sizex;
            this.canvas.height = sizey;
            this.canvas.style.backgroundColor = canvasFillColor;
        } else {}
    },

    draw: function(div, mode) {
        console.log('Start draw neural_network');
        this.div = div;
        this._html = "";
        this.dim_layers = [];
        mod = (mode !== undefined) ? mode : "canvas";

        let R, maxCountX, maxCountY, sizex, sizey, countx, county, rx, ry, hx, hy;
        let arr_form = [],
            arr_StrokeColor = [],
            arr_FillColor = [];
        for (let s = 0; s < this.layers.length; s++) {
            this.dim_layers.push(this.layers[s].count);
            arr_form.push(this.layers[s].form);
            arr_StrokeColor.push(this.layers[s].StrokeColor);
            arr_FillColor.push(this.layers[s].FillColor);
        }

        maxCountX = this.dim_layers.length;
        maxCountY = Math.max(...this.dim_layers);

        R = this.radius;
        rx = this.rx, ry = this.ry;
        hx = 25;
        hy = 25;
        sizex = maxCountX * 2 * R + 2 * hx + (maxCountX - 1) * rx;
        sizey = maxCountY * 2 * R + 2 * hy + (maxCountY - 1) * ry;

        this.CreateCanvas(sizex, sizey, this.canvasFillColor, mode);

        for (let jj = 0; jj < this.dim_layers.length; jj++) {

            let count = this.dim_layers[jj];
            let x_center = hx + R + jj * (2 * R + rx);
            let bloky = count * 2 * R + ry * (count - 1);
            let biasy = (sizey - bloky) / 2;

            let count_next = this.dim_layers[jj + 1];

            for (let j = 0; j < count; j++) {
                let y_center = biasy + R + 2 * R * j + ry * j;

                for (let jjj = 0; jjj < count_next; jjj++) {
                    let bloky_next = count_next * 2 * R + ry * (count_next - 1);
                    let biasy_next = (sizey - bloky_next) / 2;
                    let x_next = hx + R + (jj + 1) * (2 * R + rx);
                    let y_next = biasy_next + R + 2 * R * jjj + ry * jjj;

                    if (jj < this.dim_layers.length - 1) this.DrawLine(this.ctx, x_center, y_center, x_next, y_next, this.lineWidth, this.lineStrokeColor, mode);
                }

                if (arr_form[jj] == "rectangle") {
                    this.DrawRect(this.ctx, x_center, y_center, R, R, this.lineWidth, arr_StrokeColor[jj], arr_FillColor[jj], mode);
                } else {
                    this.DrawCircle(this.ctx, x_center, y_center, R, this.lineWidth, arr_StrokeColor[jj], arr_FillColor[jj], mode);
                }
            }

        }
        if (mod != "canvas") {
            div.innerHTML = '<svg width="' + sizex + '" height="' + sizey + '">' + this._html + '</svg>';
            div.style.width = sizex + "px";
            div.style.height = sizey + "px";
            div.style.backgroundColor = this.canvasFillColor;
        }
    }

}