Os seguintes arquivos contêm as configurações do NGINX e do nó de filtragem:

* `/etc/nginx/nginx.conf` define a configuração do NGINX
* `/etc/nginx/conf.d/wallarm.conf` define a configuração global do nó de filtragem Wallarm
* `/etc/nginx/conf.d/wallarm-status.conf` define a configuração do serviço de monitoramento do nó de filtragem

Você pode criar seus próprios arquivos de configuração para definir o funcionamento do NGINX e do Wallarm. Recomenda-se criar um arquivo de configuração separado com o bloco `server` para cada grupo de domínios que devem ser processados da mesma forma.

Para ver informações detalhadas sobre como trabalhar com os arquivos de configuração do NGINX, consulte a [documentação oficial do NGINX](https://nginx.org/en/docs/beginners_guide.html).

As diretivas Wallarm definem a lógica de funcionamento do nó de filtragem do Wallarm. Para ver a lista de diretivas Wallarm disponíveis, consulte a página [Opções de configuração do Wallarm](configure-parameters-en.md).

**Exemplo de arquivo de configuração**

Vamos supor que você precise configurar o servidor para trabalhar nas seguintes condições:
* Apenas o tráfego HTTP é processado. Não há pedidos HTTPS processados.
* Os seguintes domínios recebem os pedidos: `example.com` e `www.example.com`.
* Todas as solicitações devem ser passadas para o servidor `10.80.0.5`.
* Todos os pedidos recebidos são considerados menores que 1MB em tamanho (configuração padrão).
* O processamento de uma solicitação não leva mais que 60 segundos (configuração padrão).
* Wallarm deve operar no modo de monitoramento.
* Os clientes acessam o nó de filtragem diretamente, sem um balanceador de carga HTTP intermediário.

!!! info "Criando um arquivo de configuração"
    Você pode criar um arquivo de configuração NGINX personalizado (por exemplo, `example.com.conf`) ou modificar o arquivo de configuração NGINX padrão (`default.conf`).
    
    Ao criar um arquivo de configuração personalizado, certifique-se de que o NGINX ouça as conexões de entrada na porta livre.

Para atender as condições listadas, o conteúdo do arquivo de configuração deve ser o seguinte:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # os domínios para os quais o tráfego é processado
      server_name example.com; 
      server_name www.example.com;

      # ligar o modo de monitoramento do processamento de tráfego
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # definindo o endereço para o encaminhamento de solicitações
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```