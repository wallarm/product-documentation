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
          # الرجاء استبدال <WALLARM_MODE> أدناه بنمط تصفية الطلبات:
          # off لتعطيل معالجة الطلبات
          # monitoring لمعالجة الطلبات ولكن دون حظرها
          # safe_blocking لحظر الطلبات الضارة الواردة فقط من عناوين IP المدرجة في القائمة الرمادية
          # block لمعالجة كل الطلبات وحظر الضار منها
          wallarm_mode <WALLARM_MODE>;
          # wallarm_instance 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # الرجاء استبدال <APP_CONTAINER_PORT> أدناه برقم المنفذ
                  # الذي يستقبل عليه الحاوية الطلبات الواردة،
                  # يجب أن يكون القيمة مطابقة لports.containerPort
                  # في تعريف حاوية التطبيق الرئيسية لديك
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```