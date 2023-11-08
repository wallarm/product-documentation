As regras de filtragem e proxy são configuradas no arquivo `/etc/kong/nginx-wallarm.template`.

Para ver informações detalhadas sobre como trabalhar com os arquivos de configuração do NGINX, vá para a [documentação oficial do NGINX](https://nginx.org/en/docs/beginners_guide.html).

As diretrizes do Wallarm definem a lógica de operação do nó de filtragem do Wallarm. Para ver a lista de diretrizes do Wallarm disponíveis, vá para a página de [opções de configuração do Wallarm](../admin-en/configure-parameters-en.md).

**Exemplo de arquivo de configuração**

Vamos supor que você precisa configurar o servidor para trabalhar nas seguintes condições:
* Apenas o tráfego HTTP é processado. Não há solicitações HTTPS sendo processadas.
* Os seguintes domínios recebem as solicitações: `example.com` e `www.example.com`.
* Todas as solicitações devem ser direcionadas para o servidor `10.80.0.5`.
* Todas as solicitações recebidas são consideradas menores que 1MB em tamanho (configuração padrão).
* O processamento de uma solicitação não deve demorar mais do que 60 segundos (configuração padrão).
* O Wallarm deve operar no modo de monitoramento.
* Os clientes acessam o nó de filtragem diretamente, sem um balanceador de carga HTTP intermediário.

Para atender às condições listadas, o conteúdo do arquivo de configuração deve ser o seguinte:

```
    server {
      listen 80;
      listen [::]:80 ipv6only=on;

      # os domínios para os quais o tráfego é processado
      server_name example.com; 
      server_name www.example.com;

      # ativar o modo de monitoramento do processamento de tráfego
      wallarm_mode monitoring; 
      # wallarm_application 1;

      location / {
        # definir o endereço para o encaminhamento da solicitação
        proxy_pass http://10.80.0.5; 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }
```