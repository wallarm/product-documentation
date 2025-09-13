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
          # 以下の<WALLARM_MODE>をリクエストのフィルタリングモードに置き換えてください: 
          # off: リクエスト処理を無効化します
          # monitoring: リクエストは処理しますがブロックしません
          # safe_blocking: グレーリストに登録されたIPアドレスからの悪意のあるリクエストのみをブロックします
          # block: すべてのリクエストを処理し、悪意のあるものをブロックします
          wallarm_mode <WALLARM_MODE>;
          # wallarm_application 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # 以下の<APP_CONTAINER_PORT>をポート番号に置き換えてください
                  # コンテナが受信リクエストを受け付けるポート番号です
                  # 値はメインアプリケーションコンテナの定義にあるports.containerPort
                  # と同一である必要があります
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```