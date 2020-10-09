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
              right: 10,
              xLabel: 'cities',
              xLabelPos: [470, 550],
              yLabel: 'deaths',
              yLabelPos: [20, 225],
              filePath: './data/corona_rj_data.csv',
              rows: [49, 42, 79, 65, 56, 6], 
              xData: 'city',
              yData: 'deaths',
              dataSelector: true};

startBarChart(object);