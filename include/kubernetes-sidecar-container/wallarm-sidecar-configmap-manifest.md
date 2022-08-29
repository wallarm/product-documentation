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
          # Please replace <WALLARM_MODE> below by the request filtration mode: 
          # off to disable request processing
          # monitoring to process but not block requests
          # safe_blocking to block only those malicious requests originated from graylisted IPs
          # block to process all requests and block the malicious ones
          wallarm_mode <WALLARM_MODE>;
          # wallarm_instance 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # Please replace <APP_CONTAINER_PORT> below by the port number
                  # on which the container accepts incoming requests,
                  # the value must be identical to ports.containerPort
                  # in definition of your main app container
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```
