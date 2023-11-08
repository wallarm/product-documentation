As regras de filtragem e proxy são configuradas no arquivo `/etc/kong/nginx-wallarm.template`.

Para ver informações detalhadas sobre como trabalhar com arquivos de configuração do NGINX, prossiga para a [documentação oficial do NGINX](https://nginx.org/en/docs/beginners_guide.html).

As diretrizes do Wallarm definem a lógica de operação do nó de filtragem do Wallarm. Para ver a lista de diretivas Wallarm disponíveis, prossiga para a página de [opções de configuração do Wallarm](../admin-en/configure-parameters-en.md).

**Exemplo de arquivo de configuração**

Vamos supor que você precise configurar o servidor para funcionar nas seguintes condições:
* Apenas o tráfego HTTP é processado. Não há solicitações HTTPS processadas.
* Os seguintes domínios recebem as solicitações: `example.com` e `www.example.com`.
* Todas as solicitações devem ser encaminhadas para o servidor `10.80.0.5`.
* Todas as solicitações recebidas são consideradas menores que 1MB em tamanho (configuração padrão).
* O processamento de uma solicitação não demora mais de 60 segundos (configuração padrão).
* O Wallarm deve operar no modo de monitoramento.
* Os clientes acessam o nó de filtragem diretamente, sem um balanceador de carga HTTP intermediário.

Para atender as condições listadas, o conteúdo do arquivo de configuração deve ser o seguinte:

```

    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # os domínios para os quais o tráfego é processado
      server_name example.com; 
      server_name www.example.com;

      # ativar o modo de monitoramento do processamento de tráfego
      wallarm_mode monitoring; 
      # wallarm_instance 1;

      location / {
        # definindo o endereço para o encaminhamento de solicitações
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }

```