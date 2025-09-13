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
          # 以下の<WALLARM_MODE>をリクエストフィルタリングモードに置き換えてください：
          # offはリクエスト処理を無効化します
          # monitoringはリクエストを処理しますがブロックしません
          # safe_blockingはグレーリスト化されたIPからの悪意のあるリクエストのみをブロックします
          # blockはすべてのリクエストを処理し、悪意のあるものをブロックします
          wallarm_mode <WALLARM_MODE>;
          # wallarm_instance 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # 以下の<APP_CONTAINER_PORT>をポート番号に置き換えてください
                  # そのポートはコンテナが受信リクエストを受け付けるポートです、
                  # 値はメインアプリコンテナの定義のports.containerPortと
                  # 同一である必要があります
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```