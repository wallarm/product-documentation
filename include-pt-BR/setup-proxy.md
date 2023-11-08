!!! info
    Esta etapa de configuração é destinada a usuários que usam seu próprio servidor proxy para a operação das aplicações web protegidas.
    
    Se você não usa um servidor proxy, ignore esta etapa da configuração.

Você precisa atribuir novos valores às variáveis de ambiente, que definem o servidor proxy usado, para configurar o nó Wallarm para usar seu servidor proxy.

Adicione novos valores das variáveis de ambiente ao arquivo `/etc/environment`:
*   Adicione `https_proxy` para definir um proxy para o protocolo https.
*   Adicione `http_proxy` para definir um proxy para o protocolo http.
*   Adicione `no_proxy` para definir a lista de recursos que o proxy não deve ser usado.

Atribua os valores de string `<scheme>://<proxy_user>:<proxy_pass>@<host>:<port>` às variáveis `https_proxy` e `http_proxy`.
* `<scheme>` define o protocolo usado. Deve corresponder ao protocolo que a variável de ambiente atual configura o proxy.
* `<proxy_user>` define o nome de usuário para autorização do proxy.
* `<proxy_pass>` define a senha para autorização do proxy.
* `<host>` define um host do servidor proxy.
* `<port>` define uma porta do servidor proxy.

Atribua um valor de array `"<res_1>, <res_2>, <res_3>, <res_4>, ..."` onde `<res_1>`, `<res_2>`, `<res_3>`, e `<res_4>` são os endereços IP e/ou domínios, à variável `no_proxy` para definir uma lista de recursos que o proxy não deve ser usado. Este array deve consistir de endereços IP e/ou domínios.

!!! warning "Recursos que precisam ser acessados sem um proxy"
   Adicione os seguintes endereços IP e domínio à lista de recursos que devem ser acessados sem um proxy para o sistema operar corretamente: `127.0.0.1`, `127.0.0.8`, `127.0.0.9`, e `localhost`.
   Os endereços IP `127.0.0.8` e `127.0.0.9` são usados para a operação do nó de filtragem Wallarm.

O exemplo do conteúdo correto do arquivo `/etc/environment` abaixo demonstra a seguinte configuração:
*   Solicitações HTTPS e HTTP são encaminhadas via proxy para o host `1.2.3.4` com a porta `1234`, usando o nome de usuário `admin` e a senha `01234` para autorização no servidor proxy.
*   O proxy é desativado para as solicitações enviadas para `127.0.0.1`, `127.0.0.8`, `127.0.0.9`, e `localhost`.

```
https_proxy=http://admin:01234@1.2.3.4:1234
http_proxy=http://admin:01234@1.2.3.4:1234
no_proxy="127.0.0.1, 127.0.0.8, 127.0.0.9, localhost"
```