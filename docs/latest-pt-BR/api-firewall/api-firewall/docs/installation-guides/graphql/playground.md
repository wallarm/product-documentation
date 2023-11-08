# GraphQL Playground no API Firewall

O Wallarm API Firewall equipa os desenvolvedores com o [GraphQL Playground](https://github.com/graphql/graphql-playground). Este guia explica como executar o playground.

O GraphQL Playground é um ambiente de desenvolvimento integrado (IDE) em navegador especificamente para GraphQL. Ele é projetado como uma plataforma visual onde os desenvolvedores podem, sem esforço, escrever, examinar e mergulhar nas inúmeras possibilidades de consultas, mutações e assinaturas do GraphQL.

O playground busca automaticamente o esquema da URL definida em `APIFW_SERVER_URL`. Essa ação é uma consulta de introspecção que revela o esquema GraphQL. Portanto, é necessário garantir que a variável `APIFW_GRAPHQL_INTROSPECTION` esteja definida como `true`. Fazer isso permite esse processo, evitando possíveis erros nos logs do API Firewall.

Para ativar o Playground no API Firewall, você precisa usar as seguintes variáveis de ambiente:

| Variável de ambiente | Descrição |
| -------------------- | ----------- |
| `APIFW_GRAPHQL_INTROSPECTION` | Permite consultas de introspecção, que revelam a estrutura do seu esquema GraphQL. Certifique-se de que esta variável esteja definida como `true`. |
| `APIFW_GRAPHQL_PLAYGROUND` | Alterna o recurso do playground. Por padrão, ele está definido como `false`. Para habilitar, mude para `true`. |
| `APIFW_GRAPHQL_PLAYGROUND_PATH` | Designa o caminho onde o playground estará disponível. Por padrão, ele é o caminho raiz `/`. |

Uma vez configurado, você pode acessar a interface do playground a partir do caminho designado em seu navegador:

![Playground](https://github.com/wallarm/api-firewall/blob/main/images/graphql-playground.png?raw=true)