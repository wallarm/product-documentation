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
          # 以下の <WALLARM_MODE> をリクエストのフィルタリングモードで置き換えてください:
          # off でリクエスト処理を無効化
          # monitoring でリクエストを処理するがブロックしない
          # safe_blocking でグレイリストされたIPからの悪意のあるリクエストのみをブロック
          # block ですべてのリクエストを処理し、悪意のあるリクエストをブロック
          wallarm_mode <WALLARM_MODE>;
          # wallarm_application 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # 以下の <APP_CONTAINER_PORT> をコンテナが受信リクエストを受け入れるポート番号で置き換えてください
                  # この値は、メインアプリコンテナの定義の ports.containerPort と同じでなければなりません
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```