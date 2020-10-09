/*
A função startLineChart(object) plota um line chart onde,
preferenciamente, o eixo x deve representar um eixo para dados contínuos (tempo).

Esta função recebe um object:
let object = { div: "id para o elemento html onde o gráfico será renderizado",
               width: largura do gráfico,
               height: altura do gráfico,
               top: margem do topo em relação a altura definida,
               left: margem à esquerda em relação a largura definida,
               bottom: margem de baixo em relação a altura definida,
               right: margem à direira em relação a largura definida,
               xLabel: "label do eixo x",
               xLabelPos: [inteiro em relação a width, inteiro em relação a height],
               yLabel: "label do eixo y",
               yLabelPos: [inteiro em relação a width, inteiro em relação a height],
               filePath: "path_to_csv",
               rows: [uma array de linhas que serão selecionadas para visualização, com exceção do header, se houver] || null = todas as linhas,
               xData: "de acordo com o header, representa a coluna do dado a ser exibido pelo eixo x",
               yData: "de acordo com o header, representa a coluna do dado a ser exibido pelo eixo y",
               lineWidth: grossura da linha || 1.8,
               dataSelector: true se o usuário quer um seletor de dados
             }

Rodar em index.js

let object = {div: '#main',
              width: 900,
              height: 600,
              top: 20,
              left: 90,
              bottom: 200,
              right: 10,
              xLabel: 'dates',
              xLabelPos: [470, 500],
              yLabel: 'death_rate',
              yLabelPos: [20, 225],
              filePath: './data/niteroi_series.csv',
              rows: null, 
              xData: 'date',
              yData: 'death_rate',
              lineWidth: 4,
              dataSelector: true};

startLineChart(object);
*/
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
        this.rows = this.config.rows || null;
        this.xData = this.config.xData;
        this.yData = this.config.yData;
        this.lineWidth = this.config.lineWidth || 1.8;
        this.line = null;
        
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
            x: new Date (d[this.xData]),
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
                .attr('stroke-width', `${this.lineWidth}`)
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
  