/*
deve ser possível atualizar o dado e a modificacao
deve ser realcada por transicoes

deve ser possivel inicializar um grafico passando:
  1 - um id de um elemento HTML
  2 - um certo dado

parametros de config
  1 - largura e altura do gráfico
  2 - dimensoes da margem
  3 - escolher os labels de x e y
*/
let object = {div: '#main',
              width: 900,
              height: 600,
              top: 20,
              left: 90,
              bottom: 200,
              right: 30,
              xLabel: 'confirmed_per_100k_inhabitants',
              xLabelPos: [470, 500],
              yLabel: 'deaths',
              yLabelPos: [20, 225],
              filePath: './data/niteroi_series.csv',
              rows: null, 
              xData: 'confirmed_per_100k_inhabitants',
              yData: 'deaths',
              circleSize: 4,
              dataSelector: true
            };

startScatterChart(object);