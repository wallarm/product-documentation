Mantenha o tom de polidez da linguagem.Certifique-se de que o arquivo resultante tem exatamente as mesmas URLs que o arquivo original:

Traduza o seguinte artigo de documentação da Wallarm.com do inglês para o português brasileiro:

=== "Linux"
    ```bash
    /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <nome da métrica sem o nome do host> -H <FQDN do host com o nó de filtro no qual a utilidade está rodando>
    ```
=== "Docker"
    ```bash
    docker exec <nome do contêiner> /usr/bin/collectd-nagios -s /var/run/wallarm-collectd-unixsock -n <nome da métrica sem o nome do host> -H <ID do contêiner>
    ```