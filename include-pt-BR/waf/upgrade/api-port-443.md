Começando com a versão 4.0, o nó de filtragem carrega dados para a nuvem usando os endpoints da API `us1.api.wallarm.com:443` (NUvem EUA) e `api.wallarm.com:443` (Nuvem EU) em vez de `us1.api.wallarm.com:444` e `api.wallarm.com:444`.

Se você atualizar o nó da versão 3.x ou inferior e seu servidor com o nó implantado tiver acesso limitado aos recursos externos, e o acesso for concedido a cada recurso separadamente, então após a atualização a sincronização entre o nó de filtragem e a nuvem irá parar.

Para restaurar a sincronização, em sua configuração, altere a porta `444` para `443` para o endpoint da API para cada recurso.