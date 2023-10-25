```
apiVersion: v1
tür: ConfigMap
metadata:
  ad: wallarm-sidecar-nginx-conf
data:
  default: |
      server {
          listen 80 default_server;
          listen [::]:80 default_server ipv6only=on;
          server_name localhost;
          root /usr/share/nginx/html;
          index index.html index.htm;
          # Lütfen <WALLARM_MODE> değerini aşağıdaki talep filtreleme modu ile değiştirin: 
          # İşlem yapmayı devre dışı bırakmak için off
          # İstekleri işlemek ama engellememek için monitoring
          # Sadece gri listeye alınan IP'lerden gelen kötü niyetli istekleri engellemek için safe_blocking
          # Tüm istekleri işleyin ve kötü niyetli olanları engelleyin için block
          wallarm_mode <WALLARM_MODE>;
          # wallarm_instance 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # Lütfen <APP_CONTAINER_PORT> değerini aşağıdaki port numarası ile değiştirin
                  # konteynerin gelen istekleri kabul ettiği port numarası,
                  # değer, ana uygulama konteynerinizin tanımındaki ports.containerPort ile aynı olmalıdır
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  proxy_params dahil eder;
          }
      }
```