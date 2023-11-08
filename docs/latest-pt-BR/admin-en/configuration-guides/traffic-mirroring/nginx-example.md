# Exemplo de configuração do NGINX para espelhamento de tráfego

A partir do NGINX 1.13, você pode espelhar o tráfego para um backend adicional. Este artigo fornece um exemplo de configuração necessária para o NGINX [espelhar o tráfego](overview.md) e para o nó processar o tráfego espelhado.

## Passo 1: Configure o NGINX para espelhar o tráfego

Para o NGINX espelhar o tráfego:

1. Configure o módulo [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) definindo a diretiva `mirror` no bloco `location` ou `server`.
    
    O exemplo abaixo espelhará as solicitações recebidas em `location /` para `location /mirror-test`.
1. Para enviar o tráfego espelhado para o nó Wallarm, liste os cabeçalhos a serem espelhados e especifique o endereço IP da máquina com o nó na `location` para qual a diretiva `mirror` aponta.

```
location / {
        mirror /mirror-test;
        mirror_request_body on;
        root   /usr/share/nginx/html;
        index  index.html index.htm; 
    }
    
location /mirror-test {
        internal;
        #proxy_pass http://111.11.111.1$request_uri;
        proxy_pass http://222.222.222.222$request_uri;
        proxy_set_header X-SERVER-PORT $server_port;
        proxy_set_header X-SERVER-ADDR $server_addr;
        proxy_set_header HOST $http_host;
        proxy_set_header X-Forwarded-For $realip_remote_addr;
        proxy_set_header X-Forwarded-Port $realip_remote_port;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
        proxy_set_header X-Scheme $scheme;
        proxy_set_header X-Request-ID $request_id;
    }
```

## Passo 2: Configure o nó Wallarm para filtrar o tráfego espelhado

--8<-- "../include-pt-BR/wallarm-node-configuration-for-mirrored-traffic.md"