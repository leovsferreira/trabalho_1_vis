class LineChart {
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
        this.x = [Infinity, -Infinity],
        this.y = [Infinity, -Infinity], 
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
        this.line
        
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
            x: new Date(d[this.xData]),
            y: +d[this.yData]
        }});
    
        this.y = d3.extent(this.dataPlaceholder, d => {
          return d.y;
        });
        let firstDay = this.dataPlaceholder[0].x;
        let lastDay = this.dataPlaceholder[this.dataPlaceholder.length - 1].x;
        this.yScale = d3.scaleLinear().range([this.height - this.bottom, this.top]).domain([0, this.y[1]]).nice();
        this.xScale = d3.scaleTime().range([this.left, this.width - this.right]).domain([firstDay, lastDay]);
      };
    
    createAxis() {
        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis = d3.axisLeft(this.yScale);
        this.svg.append('g')
                .attr('transform', `translate(0,${this.height - this.bottom})`)
                .call(this.xAxis.ticks(this.width / (this.dataPlaceholder.length / 4)).tickSizeOuter(0))
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

    createLine() {
        this.line = d3.line()
                      .curve(d3.curveBasis)
                      .defined(d => !isNaN(d.x))
                      .x((d) => this.xScale(d.x))
                      .y((d) => this.yScale(d.y))

        this.svg.append('path')
                .datum(this.dataPlaceholder)
                .attr('class', 'line-data')
                .attr('fill', 'none')
                .attr('stroke', '#cd0a0a')
                .attr('stroke-width', '1.8')
                .attr('d', this.line)
    }

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
    }

    createSelector() {
        let selection;
        let self = this;
        d3.select('#drop')
                .append('select')
                .attr('id', 'dropdown')
                .on('change', function(d){
                    self.yData = document.getElementById('dropdown').value;
                    self.createScales()
                    self.line = d3.line()
                        .curve(d3.curveBasis)
                        .defined(d => !isNaN(d.x))
                        .x((d) => self.xScale(d.x))
                        .y((d) => self.yScale(d.y))
                    self.yAxis = d3.axisLeft(self.yScale);
                    self.svg.selectAll('text.y-label')
                        .text(self.yData)
                    self.svg.selectAll('g.y.axis')
                        .transition()
                        .duration(400)
                        .call(self.yAxis)
                    self.svg.selectAll('path.line-data')
                            .datum(self.dataPlaceholder)
                            .transition()
                            .duration(400)
                            .attr('d', self.line)
                })
                .selectAll('option')
                  .data(this.headers)
                  .enter()
                  .append('option')
                  .attr('value', (d) => d)
                  .text((d) => d)
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
};

async function startLineChart(object) {
    let chart = new LineChart(object);
    await chart.loadCSV();
    chart.createScales();
    chart.createAxis();
    chart.createLine();
    chart.createAxisLabels();
    if(object.dataSelector) chart.createSelector();
};
  