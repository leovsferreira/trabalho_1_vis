/*
A função startScatterChart(object) plota um scatter chart.

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
               circleSize: tamanho dos pontos || 1,
               dataSelectors: true se o usuário quer dois seletores de dados
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
              circleSize: 4,
              dataSelectors: true};

startLineChart(object);
*/
class ScatterChart {
    constructor(config) {
        this.config = config;
        this.svg = null;
        this.xScale = null;
        this.yScale = null;
        this.headersY = null;
        this.headersX = null;
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
        this.tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

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
        this.headersY = this.headers.filter(e => e !== this.yData);
        this.headersX = this.headers.filter(e => e !== this.xData);
        this.headersX.unshift(this.xData);
        this.headersY.unshift(this.yData);
        let i;
        for(i = 0; i < this.headers.length; i++) {
            if(this.headers[i] == this.yData) {
                this.headers[i] = this.headers[0];
                this.headers[0] = this.yData;
            }
        }
        console.log(this.headers, this.headersX, this.headersY)

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
                .attr('class', 'x axis')
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
        let self = this;
        this.svg.selectAll('circle')
                .data(this.dataPlaceholder)
                .join('circle')
                .attr('cx', (d) => this.xScale(d.cx))
                .attr('cy', (d) => this.yScale(d.cy))
                .attr('r' , (d) => d.r)
                .on('mouseover', function(e, i) {
                    self.tooltip.transition()
                                .duration(400)
                                .style('opacity', .9);
                    self.tooltip.html(`${self.yData}: ${Math.round(i.cy)} <br> ${self.xData}: ${Math.round(i.cx)}`)
                                .style("left", event.pageX - 262 + "px")
                                .style("top", event.pageY - 55 + "px")
                })  
                .on('mouseout', function(e) {
                    self.tooltip.transition()
                                .duration(400)
                                .style('opacity', 0);
                })
    }

    createSelectors() {
        let selection;
        let self = this;
        d3.select('#drop')
                .append('p')
                .text('y Axis: ')
                .append('select')
                .attr('id', 'dropdown')
                .on('change', function(d){
                  self.yData = document.getElementById('dropdown').value;
                  self.createScales()
                  self.yAxis = d3.axisLeft(self.yScale);
                  self.svg.selectAll('text.y-label')
                          .text(self.yData)
                  self.svg.selectAll('g.y.axis')
                          .transition()
                          .duration(400)
                          .call(self.yAxis)
                  self.svg.selectAll('circle')
                    .data(self.dataPlaceholder)
                    .join('circle')
                        .transition()
                        .duration(400)
                        .ease(d3.easeLinear)                
                        .attr('cx', (d) => self.xScale(d.cx))
                        .attr('cy', (d) => self.yScale(d.cy))
                })
                .selectAll('option')
                    .data(this.headersY)
                    .enter()
                    .append('option')
                    .attr('value', (d) => d)
                    .text((d) => d)
        
        d3.select('#drop-2')
                .append('p')
                .text('x Axis: ')
                .append('select')
                .attr('id', 'dropdown-2')
                .on('change', function(d){
                    self.xData = document.getElementById('dropdown-2').value;
                    self.createScales()
                    self.xAxis = d3.axisBottom(self.xScale);
                    self.svg.selectAll('text.x-label')
                            .text(self.xData)
                    self.svg.selectAll('g.x.axis')
                            .transition()
                            .duration(400)
                            .call(self.xAxis)
                    self.svg.selectAll('circle')
                            .data(self.dataPlaceholder)
                            .join('circle')
                                .transition()
                                .duration(400)
                                .ease(d3.easeLinear)                
                                .attr('cx', (d) => self.xScale(d.cx))
                                .attr('cy', (d) => self.yScale(d.cy))
                        })
                    .selectAll('option')
                        .data(this.headersX)
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
        this.headers = this.headers.filter(e => e !== 'date');

        console.log(this.headersX, this.headersY)
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
    if(object.dataSelector) chart.createSelectors();  
};