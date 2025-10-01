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
          # Lütfen aşağıdaki <WALLARM_MODE> değerini istek filtreleme modu ile değiştirin: 
          # off istek işlemeyi devre dışı bırakır
          # monitoring istekleri işler ancak engellemez
          # safe_blocking yalnızca gri listeye alınmış IP'lerden gelen kötü amaçlı istekleri engeller
          # block tüm istekleri işler ve kötü amaçlı olanları engeller
          wallarm_mode <WALLARM_MODE>;
          # wallarm_instance 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # Lütfen aşağıdaki <APP_CONTAINER_PORT> değerini bağlantı noktası numarasıyla değiştirin
                  # konteynerin gelen istekleri kabul ettiği,
                  # değer ports.containerPort ile aynı olmalıdır
                  # ana uygulama konteynerinizin tanımında
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```