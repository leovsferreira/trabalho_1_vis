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
        this.rows = this.config.rows;
        this.xData = this.config.xData;
        this.yData = this.config.yData;
      
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
        this.dataPlaceholder = this.data.map((d) => {
          return {
            x: +d[this.xData],
            y: +d[this.yData]
        }});
        this.maxY = d3.max(this.dataPlaceholder.map(d => d.y))
        this.maxX = d3.max(this.dataPlaceholder.map(d => d.x))
        this.yScale = d3.scaleLinear().range([this.height - this.bottom, this.top]).domain([0, this.maxY]).nice();
        this.xScale = d3.scaleLinear().range([this.left, this.width - this.right]).domain([0, this.maxX]).nice();
      };

    createAxis() {
        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis = d3.axisLeft(this.yScale);
        this.svg.append('g')
                .attr('transform', `translate(0,${this.height - this.bottom})`)
                .call(this.xAxis)
                    .selectAll('text')
                    .style('text-anchor', 'end')
                    .attr('dx', '-.8em')
                    .attr('dy', '-.55em')
                    .attr('transform', 'rotate(-90)' );


        this.svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', `translate(${this.left},0)`)
                .call(this.yAxis);
    };

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
    
};