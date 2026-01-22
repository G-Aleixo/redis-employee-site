# redis-employee-site
## Sobre
Site e backend educacionais criados para o seminário de banco de dados com o SGBD escolhido sendo o Redis.

O site contem criação de contas de funcionarios e informações de trabalho para a empresa ficticia "Renan's Software", utilizando um banco de dados sqlite e usando o redis como um cache.

O backend infere um delay artificial de 2 segundos em todas as querys feitas no banco de dados para simular uma pesquisa "grande", enquanto o cache no redis tem seu tempo de resposta normal.

O site usa flask e o gunicorn.

## Objetivo
Exemplificar de modo exagerado um caso de uso em que o redis pode servir como um cache, acelerando drasticamente pesquisas feitas frequentemente em um banco de dados.

## Créditos
- @G-Aleixo Backend
- @brasilicioh Fullstack
- @PC123456789N Frontend
- @TheLazyCompiler Apoio moral

## Link do site
Acesse o site [aqui](https://g-aleixo.github.io/redis-employee-site/).

## Rodar localmente
Para rodar o site localmente, baixe o repositório, entre nele e instale as bibliotecas necessárias usando o comando ```pip install -r requirements.txt```, e rode usando o flask ou gunicorn com os seguintes comandos.
- ```flask --app src/app.py run``` ou
- ```gunicorn src.app:app```

Para usar um servidor redis coloque a variável de ambiente ```REDIS_URL``` com o link do servidor redis que será usado.

Após isso entre no link que o flask/gunicorn deu e acesse o site.