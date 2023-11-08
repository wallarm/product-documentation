[link-allowed-hosts]:               http://nginx.org/en/docs/http/server_names.html

!!! info "Valores válidos para a variável `ALLOWED_HOSTS`"
    A variável `ALLOWED_HOSTS` aceita os seguintes formatos de host:

    * nomes totalmente qualificados (por exemplo, `node.example.local`)
    * um valor iniciado com um ponto (por exemplo, `.example.local`) que é reconhecido como um wildcard de subdomínio
    * um valor de `*` que corresponde a qualquer coisa (neste caso, todas as requisições são registradas pelo nó FAST)
    * o conjunto de vários valores, por exemplo: `"(node.example.local|example.com)"`
    * expressão regular na [sintaxe suportada pelo NGINX](http://nginx.org/en/docs/http/server_names.html#regex_names)

    Para mais informações sobre os valores da variável `ALLOWED_HOSTS`, prossiga para este [link][link-allowed-hosts].
