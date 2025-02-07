```yaml
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
          # Lütfen aşağıdaki <WALLARM_MODE> değerini istek filtreleme modu ile değiştirin:
          # off istek işlemesini devre dışı bırakmak için
          # monitoring istekleri işleyip engellememek için
          # safe_blocking yalnızca graylisted IP'lerden gelen zararlı istekleri engellemek için
          # block tüm istekleri işleyip zararlı olanları engellemek için
          wallarm_mode <WALLARM_MODE>;
          # wallarm_application 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # Lütfen aşağıdaki <APP_CONTAINER_PORT> değerini, kapsayıcının gelen istekleri kabul ettiği port numarası ile değiştirin,
                  # bu değer ana uygulama kapsayıcınızın tanımındaki ports.containerPort ile aynı olmalıdır
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```