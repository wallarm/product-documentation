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
          # <WALLARM_MODE>をリクエストフィルタリングモードに置き換えてください:
          # off はリクエスト処理を無効にします
          # monitoring はリクエストを処理しますがブロックしません
          # safe_blocking はグレーリストに登録されたIPからの悪意あるリクエストだけをブロックします
          # block はすべてのリクエストを処理し、悪意あるものをブロックします
          wallarm_mode <WALLARM_MODE>;
          # wallarm_instance 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # <APP_CONTAINER_PORT>を、コンテナが受信リクエストを受け入れるポート番号に置き換えてください
                  # この値は、メインアプリコンテナの定義のports.containerPortと同じでなければなりません
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```