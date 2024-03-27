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
          # برجاء استبدال <WALLARM_MODE> أدناه بوضع فلترة الطلبات:
          # off لتعطيل معالجة الطلبات
          # monitoring لمعالجة الطلبات دون حظرها
          # safe_blocking لحظر الطلبات الضارة الصادرة عن عناوين IP مدرجة بالقائمة الرمادية فقط
          # block لمعالجة جميع الطلبات وحظر الطلبات الضارة
          wallarm_mode <WALLARM_MODE>;
          # wallarm_application 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # برجاء استبدال <APP_CONTAINER_PORT> أدناه برقم المنفذ
                  # الذي يقبل الحاوية الطلبات الواردة عليه،
                  # يجب أن تكون القيمة متطابقة مع ports.containerPort
                  # في تعريف حاوية التطبيق الرئيسية الخاصة بك
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```