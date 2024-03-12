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
          wallarm_mode {{ .Values.wallarm.mode | quote }};
          # wallarm_instance 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  proxy_pass http://localhost:{{ .Values.wallarm.app_container_port }};
                  include proxy_params;
          }
      }
```