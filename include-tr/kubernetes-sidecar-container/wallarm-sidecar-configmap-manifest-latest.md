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
          # Lütfen aşağıdaki <WALLARM_MODE> ifadesini istek filtreleme moduyla değiştirin: 
          # işlemeyi devre dışı bırakmak için off
          # istekleri işlemek ama engellememek için monitoring
          # sadece gri listeye alınmış IP'lerden gelen kötü niyetli istekleri engellemek için safe_blocking
          # tüm istekleri işleyip kötü niyetli olanları engellemek için block
          wallarm_mode <WALLARM_MODE>;
          # wallarm_application 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # Lütfen aşağıdaki <APP_CONTAINER_PORT> ifadesini,
                  # konteynerin gelen istekleri kabul ettiği port numarasıyla değiştirin,
                  # değer, ana uygulama konteynerinizin tanımındaki ports.containerPort ile aynı olmalı 
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```