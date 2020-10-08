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

Documentação:

A função startBarChart(object) plota um bar chart .
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
               yData "de acordo com o header, representa a coluna do dado a ser exibido pelo eixo y"
             }
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
              rows: [1, 2, 3, 4, 5, 6], 
              xData: 'city',
              yData: 'deaths'};

startBarChart(object);
