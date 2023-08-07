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
          # 下記の<WALLARM_MODE>をリクエストフィルタモードに置き換えてください:
          # 処理の無効化のための off
          # リクエストを処理するがブロックせずに監視
          # グレーリストIPから発生した悪意のあるリクエストのみをブロックするsafe_blocking
          # すべてのリクエストを処理し、悪意のあるものをブロックするブロック
          wallarm_mode <WALLARM_MODE>;
          # wallarm_instance 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # 下記の<APP_CONTAINER_PORT>を、
                  # コンテナがインバウンドリクエストを受け入れるポート番号に置き換えてください。
                  # この価値は、メインアプリのコンテナの定義であるports.containerPortと同一でなくてはなりません
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```