```
apiVersion: v1
kind: ConfigMap
metadata:
  name: wallarm-sidecar-nginx-conf
data:
  default: |
      server {
          listen 80 default_server;
          listen [::]:80 default_server ipv6only=on;
          server_name localhost;
          root /usr/share/nginx/html;
          index index.html index.htm;
          # Substitua <WALLARM_MODE> abaixo pelo modo de filtragem de solicitações:
          # 'off' para desabilitar o processamento de solicitações
          # 'monitoring' para processar, mas não bloquear solicitações
          # 'safe_blocking' para bloquear apenas as solicitações maliciosas originadas de IPs na lista cinza
          # 'block' para processar todas as solicitações e bloquear as maliciosas
          wallarm_mode <WALLARM_MODE>;
          # wallarm_instance 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # Substitua <APP_CONTAINER_PORT> abaixo pelo número da porta
                  # na qual o contêiner aceita solicitações de entrada,
                  # o valor deve ser idêntico ao ports.containerPort
                  # na definição do seu contêiner de aplicativo principal
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```
