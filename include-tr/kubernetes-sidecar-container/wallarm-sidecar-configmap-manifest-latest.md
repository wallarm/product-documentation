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
          # off istek işlemeyi devre dışı bırakmak için
          # monitoring istekleri işlemek ancak engellememek için
          # safe_blocking yalnızca gri listeye alınmış IP'lerden gelen kötü amaçlı istekleri engellemek için
          # block tüm istekleri işlemek ve kötü amaçlı olanları engellemek için
          wallarm_mode <WALLARM_MODE>;
          # wallarm_application 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # Lütfen aşağıdaki <APP_CONTAINER_PORT> değerini
                  # konteynerin gelen istekleri kabul ettiği bağlantı noktası numarasıyla değiştirin,
                  # değer ports.containerPort ile birebir aynı olmalıdır
                  # ana uygulama konteynerinizin tanımında
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }