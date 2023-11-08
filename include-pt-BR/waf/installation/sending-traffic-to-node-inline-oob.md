Dependendo da abordagem de implantação sendo usada, realize as seguintes configurações:

=== "In-line"
    Atualize os alvos do seu balanceador de carga para enviar tráfego para a instância Wallarm. Para detalhes, consulte a documentação do seu balanceador de carga.
=== "Out-of-Band"
    Configure seu servidor web ou proxy (por exemplo, NGINX, Envoy) para espelhar o tráfego de entrada para o nó Wallarm. Para detalhes de configuração, recomendamos que se refira à documentação do seu servidor web ou proxy.

    Dentro do [link][exemplos-espelhando-servidor-web], você encontrará a configuração de exemplo dos servidores web e proxy mais populares (NGINX, Traefik, Envoy).