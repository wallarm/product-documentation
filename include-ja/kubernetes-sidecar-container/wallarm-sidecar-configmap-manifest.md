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
          # 以下の<WALLARM_MODE>をリクエストフィルトレーションモードに置き換えてください:
          # offはリクエスト処理を無効にします
          # monitoringはリクエストを処理しますがブロックしません
          # safe_blockingはgraylisted IPからの悪意あるリクエストのみをブロックします
          # blockはすべてのリクエストを処理し悪意のあるリクエストをブロックします
          wallarm_mode <WALLARM_MODE>;
          # wallarm_instance 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # 以下の<APP_CONTAINER_PORT>をコンテナが着信リクエストを受け付けるポート番号に置き換えてください,
                  # 値はメインアプリコンテナ定義のports.containerPortと同一である必要があります
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```