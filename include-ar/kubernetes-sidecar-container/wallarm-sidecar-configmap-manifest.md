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
          # برجاء استبدال <WALLARM_MODE> في ما يلي بوضع تصفية الطلبات:
          # off لتعطيل معالجة الطلبات
          # monitoring لمعالجة الطلبات دون حظرها
          # safe_blocking لحظر الطلبات الضارة القادمة من عناوين IP المُدرجة بالقائمة الرمادية فقط
          # block لمعالجة كل الطلبات وحظر تلك الضارة منها
          wallarm_mode <WALLARM_MODE>;
          # wallarm_instance 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # برجاء استبدال <APP_CONTAINER_PORT> في ما يلي برقم المنفذ
                  # الذي يقبل الحاوية الطلبات الواردة عليه،
                  # يجب أن يكون القيمة مطابقة ل ports.containerPort
                  # في تعريف حاوية التطبيق الرئيسي الخاص بك
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```