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
          # リクエスト処理を無効にするにはoff
          # リクエストを処理するがブロックしない場合は監視
          # グレイリストに登録されたIPからの悪意あるリクエストのみをブロックにするための安全なブロッキング
          # すべてのリクエストを処理し、悪意のあるものをブロックするblock
          wallarm_mode <WALLARM_MODE>;
          # wallarm_application 1;
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          location / {
                  # 以下の<APP_CONTAINER_PORT>をコンテナが着信リクエストを受け入れるポート番号に置き換えてください。
                  # 値は主要なアプリケーションコンテナの定義内のports.containerPortと一致しなければなりません。
                  proxy_pass http://localhost:<APP_CONTAINER_PORT>;
                  include proxy_params;
          }
      }
```