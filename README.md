# redis-employee-site
## Sobre
Site e backend educacionais criados para o seminário de banco de dados com o SGBD escolhido sendo o Redis.

O site contem criação de contas de funcionarios e informações de trabalho para a empresa ficticia "EMPRESA FICTICIA", utilizando um banco de dados sqlite e usando o redis como um cache.

O backend infere um delay artificial de 2 segundos em todas as querys feitas no banco de dados para simular uma pesquisa "grande", enquanto o cache no redis tem seu tempo de resposta normal.

O site é servido usando flask

## Objetivo
Exemplificar de modo exagerado um caso de uso em que o redis pode servir como um cache, acelerando drasticamente pesquisas feitas frequentemente em um banco de dados.

## Créditos
- @G-Aleixo Backend
- @brasilicioh Fullstack
- @pc123456789n Frontend

## Link do site
Acesse o site [aqui](https://g-aleixo.github.io/redis-employee-site/).