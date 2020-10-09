class ScatterChart {
    constructor(config) {
        this.config = config;
        this.svg = null;
        this.xScale = null;
        this.yScale = null;
        this.headers = null;
        this.yAxis = null;
        this.xAxis = null;
        this.selection = null;
        this.dataPlaceholder = null;
        this.maxY = null;
        this.maxX = null;
        this.width = this.config.width;
        this.height = this.config.height;
        this.left = this.config.left;
        this.right = this.config.right;
        this.top = this.config.top;
        this.bottom = this.config.bottom;
        this.yLabel = this.config.yLabel;
        this.xLabel = this.config.xLabel;
        this.xLabelPos = this.config.xLabelPos;
        this.yLabelPos = this.config.yLabelPos;
        this.filePath = this.config.filePath;
        this.circleSize = this.config.circleSize || 1;
        this.rows = this.config.rows || null;
        this.xData = this.config.xData;
        this.yData = this.config.yData;
        this.x = [Infinity, -Infinity],
        this.y = [Infinity, -Infinity],
        this.cx = null;
        this.cy = null;
      
        this.createSvg();
    };

    createSvg() {
        this.svg = d3.select(this.config.div)
            .append('svg')
            .attr('x', 10)
            .attr('y', 10)
            .attr('width', this.width)
            .attr('height', this.height);
    };

    createScales() {

        this.dataPlaceholder = this.data.map(d => {
            return {
              cx: +d[this.xData],
              cy: +d[this.yData],
              r: +this.circleSize
            }
          });

        this.cx = d3.extent(this.dataPlaceholder, d => {
            return d.cx;
        });
        this.cy = d3.extent(this.dataPlaceholder, d => {
            return d.cy;
        });

        this.maxY = d3.max(this.cy);
        this.maxX = d3.max(this.cx);
        this.yScale = d3.scaleLinear().range([this.height - this.bottom, this.top]).domain([0, this.maxY]).nice();
        this.xScale = d3.scaleLinear().range([this.left, this.width - this.right]).domain([0, this.maxX]).nice(); 
      };

    createAxis() {
        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis = d3.axisLeft(this.yScale);
        this.svg.append('g')
                .attr('transform', `translate(0,${this.height - this.bottom})`)
                .call(this.xAxis)

        this.svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', `translate(${this.left},0)`)
                .call(this.yAxis);
    };

    createAxisLabels() {
        this.svg.append('text')
                .attr('class', 'y-label')
                .attr('x', -this.yLabelPos[1])
                .attr('y', this.yLabelPos[0])
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .text(this.yLabel)
    
        this.svg.append('text')
                .attr('class', 'x-label')
                .attr('x', this.xLabelPos[0])
                .attr('y', this.xLabelPos[1])
                .attr('text-anchor', 'middle')
                .text(this.xLabel)
      };

    createCircles() {
        this.svg.selectAll('circle')
                .data(this.dataPlaceholder)
                .join('circle')
                .attr('cx', d => this.xScale(d.cx))
                .attr('cy', d => this.yScale(d.cy))
                .attr('r' , d => d.r)
    }

    async loadCSV() {
        let newData = [];
        let i;
        this.data = await d3.csv(this.filePath);
        this.headers = this.data.columns;
        this.headers = this.headers.filter(item => item !=  this.xData);
        for(i = 0; i < this.headers.length; i++) {
            if(this.headers[i] == this.yData) {
                if(i != 0) {
                    this.headers[i] = this.headers[0];
                    this.headers[0] = this.yData;
                }
            }
        }
        
        if(this.rows) {
            for(i = 0; i < this.rows.length; i++) {
                newData.push(this.data[this.rows[i] - 1]);
            };
            this.data = newData;
        };
    };
}

async function startScatterChart(object) {
    let chart = new ScatterChart(object);
    await chart.loadCSV();
    chart.createScales();
    chart.createAxis();
    chart.createAxisLabels();
    chart.createCircles();  
};