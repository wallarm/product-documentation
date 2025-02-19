```yaml
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
          # 以下の<WALLARM_MODE>をリクエストフィルトレーションモードに置き換えてください：
          # offはリクエスト処理を無効化します
          # monitoringはリクエストを処理しますが、ブロックはしません
          # safe_blockingはgraylisted IPから発生する悪意あるリクエストのみをブロックします
          # blockはすべてのリクエストを処理し、悪意あるリクエストをブロックします
          wallarm_mode <WALLARM_MODE>;
          # wallarm_application 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # 以下の<APP_CONTAINER_PORT>をコンテナが受け入れるリクエストのポート番号に置き換えてください
                  # コンテナがリクエストを受け入れるポート番号です，
                  # 値はメインアプリコンテナの定義内のports.containerPortと同一である必要があります
                  # メインアプリコンテナの定義部分です
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```