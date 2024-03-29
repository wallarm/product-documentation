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
          # يرجى استبدال <WALLARM_MODE> أدناه بوضع فلترة الطلبات: 
          # off لتعطيل معالجة الطلبات
          # monitoring لمعالجة الطلبات دون حظرها
          # safe_blocking لحظر الطلبات الضارة القادمة من عناوين IP المدرجة في القائمة الرمادية فقط
          # block لمعالجة جميع الطلبات وحظر الضارة منها
          wallarm_mode <WALLARM_MODE>;
          # wallarm_application 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # يرجى استبدال <APP_CONTAINER_PORT> أدناه برقم المنفذ
                  # الذي يقبل الحاوية طلبات واردة عليه،
                  # يجب أن تكون القيمة مطابقة لports.containerPort
                  # في تعريف حاوية تطبيقك الرئيسية
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```