# Configurando a resolução DNS dinâmica no NGINX

Se o nome de domínio for passado na diretiva `proxy_pass` do arquivo de configuração do NGINX, então o NGINX resolve o endereço IP do host apenas uma vez após a inicialização. Se o servidor DNS alterar o endereço IP do host, então o NGINX continuará usando o antigo endereço IP até que o NGINX seja recarregado ou reiniciado. Antes disso, o NGINX enviará solicitações para o endereço IP errado.

Por exemplo:

```bash
location / {
        proxy_pass https://demo-app.com;
        include proxy_params;
    }
```

Para a resolução DNS dinâmica, você pode definir uma diretiva `proxy_pass` como variável. Nesse caso, o NGINX usará o endereço DNS que está definido na diretiva [`resolver`](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver) ao calcular a variável.

!!! warning "Impacto da resolução DNS dinâmica no processamento de tráfego"
    * A configuração do NGINX com a diretiva `resolver` e a variável na diretiva `proxy_pass` retarda o processamento de solicitações, pois será o passo adicional de resolução DNS dinâmica no processamento de solicitações.
    * O NGINX re-resolve o nome de domínio quando seu tempo de vida (TTL) expira. Ao incluir o parâmetro `valid` na diretiva `resolver`, você pode instruir o NGINX a ignorar o TTL e re-resolver os nomes com uma frequência especificada.
    * Se o servidor DNS estiver inativo, o NGINX não processará o tráfego.

Por exemplo:

```bash
location / {
        resolver 172.43.1.2 valid=10s;
        set $backend https://demo-app.com$uri$is_args$args;
        proxy_pass $backend;
        include proxy_params;
    }
```

!!! info "Resolução DNS dinâmica no NGINX Plus"
    O NGINX Plus suporta a resolução dinâmica de nomes de domínio por padrão.