# Acesso à API Wallarm via Proxy

Essas instruções descrevem os passos para configurar o acesso à API Wallarm via servidor de proxy.

* `https://api.wallarm.com/` para o Cloud EU
* `https://us1.api.wallarm.com/` para o Cloud US

Para configurar o acesso, atribua novos valores às variáveis de ambiente que definem o servidor de proxy utilizado no arquivo `/etc/environment`:

* `https_proxy` para definir um proxy para o protocolo HTTPS
* `http_proxy` para definir um proxy para o protocolo HTTP
* `no_proxy` para definir a lista de recursos que o proxy não deve ser usado

## Valores do https_proxy e http_proxy

Atribua os valores da sequência `<scheme>://<proxy_user>:<proxy_pass>@<host>:<port>` às variáveis `https_proxy` e `http_proxy`:

* `<scheme>` define o protocolo usado. Deve corresponder ao protocolo que a variável de ambiente atual configura o proxy
* `<proxy_user>` define o nome de usuário para autorização de proxy
* `<proxy_pass>` define a senha para autorização de proxy
* `<host>` define um host do servidor de proxy
* `<port>` define uma porta do servidor de proxy

## Valor do no_proxy

Para a variável `no_proxy`, atribua o array de endereços IP e/ou domínios dos recursos para os quais o proxy não deve ser usado:

* `127.0.0.1`, `127.0.0.8`, `127.0.0.9` e `localhost` para operação correta do nó Wallarm
* endereços adicionais no formato: `"<res_1>, <res_2>, <res_3>, <res_4>, ..."` onde `<res_1>`, `<res_2>`, `<res_3>` e `<res_4>` são os endereços IP e/ou domínios

## Exemplo do arquivo /etc/environment

Um exemplo do arquivo `/etc/environment` abaixo demonstra a seguinte configuração:

* Solicitações HTTPS e HTTP são direcionadas ao host `1.2.3.4` com a porta `1234`, usando o nome de usuário `admin` e a senha `01234` para autorização no servidor de proxy.
* O proxy é desativado para as solicitações enviadas para `127.0.0.1`, `127.0.0.8`, `127.0.0.9` e `localhost`.

```bash
https_proxy=http://admin:01234@1.2.3.4:1234
http_proxy=http://admin:01234@1.2.3.4:1234
no_proxy="127.0.0.1, 127.0.0.8, 127.0.0.9, localhost"
```