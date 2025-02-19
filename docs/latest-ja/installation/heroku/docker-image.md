```markdown
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[node-token-types]:                 ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[doc-stat-service]:                 ../../admin-en/configure-statistics-service.md
[aio-docs]:                         ../nginx/all-in-one.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md#available-filtration-modes
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Heroku上でWallarmを実行

Wallarmは[Heroku](https://www.heroku.com/)クラウドプラットフォーム上にデプロイされたWebアプリケーションやAPIを保護します。本ガイドでは、WallarmノードをHeroku上で実行してリアルタイムにトラフィックを解析する手順を説明します。

現時点では、WallarmからHeroku向けの公式Dockerイメージは存在しません。本ガイドでは、[オールインワンインストーラー][aio-docs]を使用して自身でDockerイメージを作成し実行する方法を解説します。

## 必要条件

* ホストシステムに[Docker](https://docs.docker.com/engine/install/)がインストールされていること
* Heroku用のWallarm DockerイメージをプッシュするためのDockerアカウント
* ホストシステムに[Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)がインストールされていること
* HerokuのWebダイノ上で実行されるアプリケーションまたはAPI
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleへの管理者アクセス
* オールインワンWallarmインストーラーをダウンロードするための`https://meganode.wallarm.com`へのアクセス
* US Wallarm Cloudを利用する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudを利用する場合は`https://api.wallarm.com`へのアクセス
* 以下のIPアドレスへのアクセス（攻撃検知ルールの更新および[API仕様書][api-spec-enforcement-docs]の取得、また[allowlisted, denylisted, graylisted][ip-lists-docs]の国、地域、またはデータセンターの正確なIPを取得するため）

    --8<-- "../include/wallarm-cloud-ips.md"

## Step 1: Wallarm Docker設定の準備

Heroku上にWallarmのDockerイメージをデプロイするため、まずイメージビルドプロセス用の必要な設定ファイルを作成します。以下の手順に従ってください。

1. ローカルシステム上にWallarmのDocker設定専用のディレクトリを作成し、そのディレクトリに移動します。
1. NGINXと[Wallarmの設定][waf-directives-instr]を含む`nginx.conf`ファイルを作成します。Dockerイメージは[NGINX互換のオールインワンインストーラー][aio-docs]をベースにしているため、NGINXが適切に構成されていることを確認してください。

    以下は、Wallarmノードをmonitoringモードで実行する基本設定のテンプレートです。

    ```
    daemon off;
    worker_processes auto;
    load_module /opt/wallarm/modules/bullseye-1180/ngx_http_wallarm_module.so;
    pid /tmp/nginx.pid;
    include /etc/nginx/modules-enabled/*.conf;

    events {
      worker_connections 768;
      use epoll;
      accept_mutex on;
    }

    http {
      gzip on;
      gzip_comp_level 2;
      gzip_min_length 512;
      gzip_proxied any; # Heroku router sends Via header

      proxy_temp_path /tmp/proxy_temp;
      client_body_temp_path /tmp/client_temp;
      fastcgi_temp_path /tmp/fastcgi_temp;
      uwsgi_temp_path /tmp/uwsgi_temp;
      scgi_temp_path /tmp/scgi_temp;

      sendfile on;
      tcp_nopush on;
      tcp_nodelay on;
      keepalive_timeout 65;
      types_hash_max_size 2048;
      server_tokens off;

      # server_names_hash_bucket_size 64;
      # server_name_in_redirect off;

      include /etc/nginx/mime.types;
      default_type application/octet-stream;

      access_log /var/log/nginx/access.log;
      error_log /var/log/nginx/error.log;

      # Main Heroku app
      server {
        listen $PORT default_server;
        server_name _;
        wallarm_mode monitoring;
        
        location / {
          proxy_pass http://unix:/tmp/nginx.socket;

          # Heroku apps are always behind a load balancer, which is why we trust all IPs
          set_real_ip_from 0.0.0.0/0;
          real_ip_header X-Forwarded-For;
          real_ip_recursive off;
          proxy_redirect off;
          proxy_set_header Host $http_host;
          proxy_set_header "Connection" "";
        }

        error_page 403 /403.html;
        location = /403.html {
            root /usr/share/nginx/html;
            internal;
        }
      }

      # Wallarm status helper (localhost-only)
      server {
        listen 127.0.0.8:$PORT;
        server_name localhost;
        allow 127.0.0.0/8;
        deny all;
        wallarm_mode off;
        disable_acl "on";
        access_log off;
        location ~/wallarm-status$ {
          wallarm_status on;
        }
      }
    }
    ```
1. Wallarm Dockerイメージ用の指示が記載された`entrypoint.sh`ファイルを作成します。

    ```
    #!/bin/bash

    set -e

    log() {
        local msg="$1"
        local level="$2"
        if [ -z "$level" ]; then
            level="INFO"
        fi
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $msg"
    }

    log "Script execution started."

    # Ensure necessary directories exist for supervisord.
    log "Ensuring necessary directories exist for supervisord."
    mkdir -p /opt/wallarm/var/log/wallarm
    mkdir -p /opt/wallarm/run/supervisor

    if [ ! -z "$WALLARM_API_TOKEN" ]; then
        log "WALLARM_API_TOKEN is set, checking configuration."
        if [[ $DYNO == web.* ]]; then
            log "Heroku dyno type [$DYNO] is 'web', proceeding with Wallarm configuration."
            # Propagate env vars
            log "Propagating environment variables from /opt/wallarm/env.list."
            set -a
            source /opt/wallarm/env.list
            if [ -s /etc/wallarm-override/env.list ]; then
                log "Propagating environment variables from /etc/wallarm-override/env.list."
                source /etc/wallarm-override/env.list
            fi
            set +a

            # Register Wallarm node in the Cloud.
            log "Registering Wallarm node in the cloud."
            /opt/wallarm/register-node

            # Configure PORT in nginx config.
            log "Replacing \$PORT in Nginx configuration with value $PORT."
            sed -i "s/\$PORT/${PORT}/g" /etc/nginx/nginx.conf

            # Verify that PORT was replaced successfully.
            log "Checking if the PORT in Nginx configuration was successfully replaced."
            if cat /etc/nginx/nginx.conf | grep -q "listen ${PORT}"; then
                    log "Successfully replaced PORT in Nginx configuration with value $PORT."
            else
                    log "Failed to replace PORT in Nginx configuration!" "ERROR"
                    exit 1
            fi

            # Export $PORT as $NGINX_PORT (required for the `export-metrics` script).
            log "Exporting PORT as NGINX_PORT for Wallarm metrics."
            export NGINX_PORT="$PORT"
            export -n TT_MEMTX_MEMORY

            if [ ! -z "$NGINX_PORT" ]; then
                    sed -i -r "s#http://127.0.0.8/wallarm-status#http://127.0.0.8:$NGINX_PORT/wallarm-status#" \
                    /opt/wallarm/etc/collectd/wallarm-collectd.conf.d/nginx-wallarm.conf
            fi

            # Start all Wallarm services and NGINX under supervisord.
            log "Starting all Wallarm services and NGINX under supervisord."
            /opt/wallarm/usr/bin/python3.10 /opt/wallarm/usr/bin/supervisord -c /opt/wallarm/etc/supervisord.conf --loglevel=debug
            # Check if supervisord started successfully.
            log "Checking if supervisord process is running."
            if pgrep -f "supervisord" > /dev/null; then
                log "supervisord process started successfully."
            else
                log "Failed to start supervisord process!" "ERROR"
                exit 1
            fi

            # Check the status of services managed by supervisord.
            log "Checking the status of all services managed by supervisord every 10s during 3 minutes."
            timeout=0

            while (/opt/wallarm/usr/bin/supervisorctl -c /opt/wallarm/etc/supervisord.conf status | grep -qv "RUNNING");
            do
                log "One or more services failed to start!" "ERROR"
                log "Waiting 10s and check it again"
                sleep 10s
                timeout=$(( timeout + 10 ))

                if [ $timeout -ge 180 ];
                then
                  log "One or more services failed to start!" "ERROR"
                  /opt/wallarm/usr/bin/supervisorctl -c /opt/wallarm/etc/supervisord.conf status
                  exit 1
                fi
            done

            log "All services are running successfully."
            log "Wallarm configuration completed."

        else
            log "Heroku dyno type [$DYNO] is not 'web', skipping Wallarm configuration."
        fi
    else
        log "WALLARM_API_TOKEN is not set, executing CMD."
    fi

    # Execute the CMD command.
    log "Executing command: $@"
    exec "$@"
    log "Script execution finished."
    ```

1. 次のコマンドを実行して、`entrypoint.sh`ファイルのパーミッションを`-rwxr-xr-x`に設定します。

    ```
    chmod 755 entrypoint.sh
    ```
1. Wallarmがリクエストをブロックした際に表示する、見やすいエラーページを表示する`403.html`ファイルを作成します。以下の内容をコピーしてください。

    ```html
    <!doctype html> <html> <head> <meta charset=utf-8> <meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" name=viewport> <title>Forbidden</title> <link rel="shortcut icon" type="image/x-icon" href="https://www.herokucdn.com/favicon.ico"> <style>html, body {
      font-family: sans-serif;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
      background-color: #F7F8FB;
      height: 100%;
      -webkit-font-smoothing: antialiased;
    }

    body {
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .message {
      text-align: center;
      align-self: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0px 20px;
      max-width: 450px;
    }

    .message__title {
      font-size: 22px;
      font-weight: 100;
      margin-top: 15px;
      color: #47494E;
      margin-bottom: 8px;
    }

    p {
      -webkit-margin-after: 0px;
      -webkit-margin-before: 0px;
      font-size: 15px;
      color: #7F828B;
      line-height: 21px;
      margin-bottom: 4px;
    }

    .btn {
      text-decoration: none;
      padding: 8px 15px;
      border-radius: 4px;
      margin-top: 10px;
      font-size: 14px;
      color: #7F828B;
      border: 1px solid #7F828B;
    }

    .hk-logo, .app-icon {
      fill: #DBE1EC;
    }

    .info {
      fill: #9FABBC;
    }

    body.friendly {
      background: -webkit-linear-gradient(-45deg, #8363a1 0%, #74a8c3 100%);
      background: linear-gradient(135deg, #8363a1 0%, #74a8c3 100%);
    }

    body.friendly .message__title {
      color: #fff;
    }

    body.friendly p {
      color: rgba(255, 255, 255, 0.6);
    }

    body.friendly .hk-logo, body.friendly .app-icon {
      fill: rgba(255, 255, 255, 0.9);
    }

    body.friendly .info {
      fill: rgba(255, 255, 255, 0.9);
    }

    body.friendly .btn {
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.9);
    }

    .info_area {
      position: fixed;
      right: 12px;
      bottom: 12px;
    }

    .logo {
      position: fixed;
      left: 12px;
      bottom: 12px;
    }

    </style> <base target=_parent /> </head> <body> <div class=spacer></div> <div class=message> <svg width=49 height=51 xmlns="http://www.w3.org/2000/svg"><path d="M3.9468 10.0288L20.5548.995c2.4433-1.3267 5.45-1.3267 7.8936 0l16.6078 9.0338C47.4966 11.3585 49 13.8102 49 16.4666V34.534c0 2.6537-1.5034 5.1082-3.9438 6.438l-16.6078 9.0307c-2.4435 1.3297-5.4503 1.3297-7.8937 0L3.9467 40.972C1.5035 39.642 0 37.1876 0 34.534V16.4667c0-2.6564 1.5034-5.108 3.9468-6.4378z" class=app-icon fill-rule=evenodd /></svg> <div class=message__title> Your request has been blocked </div> <p> If you think this is a mistake, please get in touch with the app's support team. </p> </div> <div class=logo> <svg width=85 height=24 xmlns="http://www.w3.org/2000/svg"><g class=info fill-rule=evenodd><path d="M27.8866 16.836h2.373v-3.504h2.919v3.504h2.373V8.164h-2.373v3.2227h-2.919V8.164h-2.373v8.672zm10.4888 0h6.4666V14.949h-4.0935v-1.6054h2.7764v-1.8282h-2.7765v-1.4062h3.8918V8.164h-6.265v8.672zm8.8396 0h2.3256V13.824h.6526L51.89 16.836h2.5154l-1.863-3.3165c1.151-.3867 1.7325-1.1718 1.7325-2.5312 0-2.086-1.3765-2.8242-3.631-2.8242h-3.429v8.672zm2.3256-4.793v-1.9805h1.0204c.973 0 1.4.2578 1.4.9844 0 .7264-.427.996-1.4.996h-1.0204zM60.8363 17c2.112 0 4.307-1.3242 4.307-4.5 0-3.1758-2.195-4.5-4.307-4.5-2.124 0-4.319 1.3242-4.319 4.5 0 3.1758 2.195 4.5 4.319 4.5zm0-1.875c-1.2458 0-1.946-1.0313-1.946-2.625 0-1.5938.7002-2.5664 1.946-2.5664 1.234 0 1.934.9726 1.934 2.5664 0 1.5938-.7 2.625-1.934 2.625zm6.7157 1.711h2.373v-2.6954l.6764-.7734 2.0764 3.4687h2.6816l-3.2155-5.25 2.9543-3.422h-2.7527l-2.4205 3.1407V8.164h-2.373v8.672zm13.4552.1288c2.563 0 3.6782-1.3125 3.6782-3.6093V8.164H82.36v5.1798c0 1.1953-.3798 1.7343-1.329 1.7343-.9493 0-1.3408-.539-1.3408-1.7342V8.164h-2.373v5.1915c0 2.2968 1.127 3.6093 3.69 3.6093zM2.4444 0C.9214 0 0 .8883 0 2.3226v19.3548C0 23.1068.9215 24 2.4444 24h17.1112C21.0736 24 22 23.1117 22 21.6774V2.3226C21.995.8883 21.0735 0 19.5556 0H2.4444zm16.8973 1.9c.4025.0045.7583.3483.7583.7214v18.7572c0 .3776-.3558.7214-.7583.7214H2.6583c-.4025 0-.7583-.3438-.7583-.7214V2.6214c0-.3777.3558-.7214.7583-.7214h16.6834z"/><path d="M16.43 20h-2.2527v-6.8048c0-.619-.1917-.838-.3786-.9666-1.131-.7667-4.3855-.0334-6.3458.7333l-1.553.6475L5.9048 4h2.2814v6.3333c.4314-.1333.973-.2714 1.524-.3857 2.4206-.5143 4.1987-.3762 5.3586.4048.6375.4286 1.3612 1.2714 1.3612 2.8428V20zM11.57 8h2.6675c1.4042-1.75 1.9732-3.35 2.1925-4h-2.6623c-.3967.95-1.1223 2.55-2.1977 4zM5.9 20v-5.6l2.43 2.8L5.9 20z"/></g></svg> </div> </body> </html>
    ```

1. WallarmのDockerイメージのビルドプロセスを記述する`Dockerfile`を作成します。

    ```dockerfile
    FROM ubuntu:22.04

    ARG VERSION="5.0.2"

    ENV PORT=3000
    ENV WALLARM_LABELS="group=heroku"
    ENV WALLARM_API_TOKEN=
    ENV WALLARM_API_HOST="us1.api.wallarm.com"
    ENV TT_MEMTX_MEMORY=268435456

    RUN apt-get -qqy update && apt-get -qqy install nginx curl && apt-get clean

    # Download and unpack the Wallarm all-in-one installer
    RUN curl -o /install.sh "https://meganode.wallarm.com/$(echo "$VERSION" | cut -d '.' -f 1-2)/wallarm-$VERSION.x86_64-glibc.sh" \
            && chmod +x /install.sh \
            && /install.sh --noexec --target /opt/wallarm \
            && rm -f /install.sh

    # Set Tarantool's $PORT variable explicitly as it conflicts with Heroku's $PORT
    RUN sed -i '/^\[program:tarantool\]$/a environment=PORT=3313' /opt/wallarm/etc/supervisord.conf
    
    # Run supervisord in background. Our foreground process is the Heroku app itself
    RUN sed -i '/nodaemon=true/d' /opt/wallarm/etc/supervisord.conf
    
    # Add NGINX to supervisord
    RUN printf "\n\n[program:nginx]\ncommand=/usr/sbin/nginx\nautorestart=true\nstartretries=4294967295\n" | tee -a /opt/wallarm/etc/supervisord.conf

    # Heroku runs everything under an unprivileged user (dyno:dyno), so we need to grant it access to Wallarm directories
    RUN find /opt/wallarm -type d -exec chmod 777 {} \;

    # Copy NGINX configuration
    COPY nginx.conf /etc/nginx/nginx.conf
    
    # Herokuesque 403 error page
    COPY 403.html /usr/share/nginx/html/403.html

    # Add entrypoint.sh
    COPY entrypoint.sh /entrypoint.sh

    # Let entrypoint modify the config under dyno:dyno and redirect NGINX logs to console
    RUN chmod 666 /etc/nginx/nginx.conf \
            && chmod 777 /etc/nginx/ \
            && ln -sf /dev/stdout /var/log/nginx/access.log \
            && ln -sf /dev/stderr /var/log/nginx/error.log

    ENTRYPOINT ["/entrypoint.sh"]
    ```

## Step 2: Heroku用のWallarm Dockerイメージをビルド

前に作成したディレクトリ内で、以下のコマンドを実行してください。

```
docker build -t wallarm-heroku:5.0.2 .
docker login
docker tag wallarm-heroku:5.0.2 <DOCKERHUB_USERNAME>/wallarm-heroku:5.0.2
docker push <DOCKERHUB_USERNAME>/wallarm-heroku:5.0.2
```

## Step 3: Heroku上でビルド済みDockerイメージを実行

イメージをHerokuにデプロイするには、以下の手順に従ってください。

1. 次の操作を行うため、アプリケーションディレクトリのルートに移動します。
1. アプリケーションのランタイムに固有な必要な依存関係をインストールする`Dockerfile`を作成します。Node.jsアプリケーションの場合、以下のテンプレートを使用してください。

    ```dockerfile
    FROM <DOCKERHUB_USERNAME>/wallarm-heroku:5.0.2

    ENV NODE_MAJOR=20

    # Install NodeJS v20 from NodeSource
    RUN apt-get update \
        && apt-get install -qqy ca-certificates curl gnupg \
        && mkdir -p /etc/apt/keyrings \
        && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
        && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
        && apt-get update \
        && apt-get install nodejs -qqy \
        && apt-get clean

    ADD . /opt/webapp
    WORKDIR /opt/webapp
    
    # Install dependencies and build the app
    RUN npm install --omit=dev 
    ENV npm_config_prefix /opt/webapp

    # Note that in private spaces the `run` section of heroku.yml is ignored
    # See: https://devcenter.heroku.com/articles/build-docker-images-heroku-yml#known-issues-and-limitations
    CMD ["npm", "run", "start"]
    ```
1. 以下の内容で`heroku.yml`構成ファイルを作成します。

    ```yaml
    build:
      docker:
        web: Dockerfile
    ```
1. アプリケーションが`$PORT`ではなく`/tmp/nginx.socket`でリッスンするように調整してください。なぜなら、NGINXが`$PORT`を使用しているためです。例えば、以下のような設定になります。

    ```js hl_lines="4-5"
// app.js
const app = require('express')()

let port = process.env.PORT || 3000 // If Wallarm is not configured, listen on $PORT
if(process.env.WALLARM_API_TOKEN) port = '/tmp/nginx.socket' // Wallarm is configured

app.listen(port, (err) => {
    if (err) throw err
    console.log(`> App is listening on ${port}`)
})

app.get('/', (req, res) => {
    res.send('This app is protected by Wallarm')
})
    ```
1. WallarmノードインスタンスをWallarm Cloudにリンクするために、[適切なタイプ][node-token-types]のフィルタリングノードトークンを生成してください。

    === "API token"
        1. Wallarm Console → **Settings** → **API tokens** へ移動し、[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)から操作します。
        1. `Deploy`ソースロールのAPIトークンを見つけるか作成します。
        1. このトークンをコピーします。
        1. Wallarmノードを追加するノードグループ名を、次の環境変数で指定してください。

        ```
        heroku config:set WALLARM_LABELS=group=<NODE_GROUP_NAME>
        ```
    === "Node token"
        1. Wallarm Console → **Nodes** に移動し、[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)から操作します。
        1. **Wallarm node**タイプのフィルタリングノードを作成し、生成されたトークンをコピーします。
1. ノードをCloudに接続するためのパラメータを、関連する環境変数で設定します。

    === "US Cloud"
        ```
        heroku config:set WALLARM_API_TOKEN=<NODE_TOKEN>
        ```
    === "EU Cloud"
        ```
        heroku config:set WALLARM_API_HOST=api.wallarm.com
        heroku config:set WALLARM_API_TOKEN=<NODE_TOKEN>
        ```
1. アプリケーションをプッシュして再起動をトリガーし、Wallarmノードをデプロイしてください。

    ```
    git add Dockerfile heroku.yml app.js
    git commit -m "Add Wallarm Docker"
    heroku stack:set container
    git push heroku <BRANCH_NAME>
    ```

## Step 4: デプロイのテスト

デプロイが正常に機能することを確認するため、[Path Traversal][ptrav-attack-docs]脆弱性を利用したテスト攻撃を実行してください。

```
curl http://<HEROKU_APP_DOMAIN>/etc/passwd
```

ノードはデフォルトで**monitoring**の[filtration mode][filtration-mode-docs]で動作するため、Wallarmノードは攻撃をブロックせずに記録します。攻撃が記録されたかを確認するには、Wallarm Console → **Attacks**に進んでください。

![Attacks in the interface][attacks-in-ui-image]

## Debug

WallarmベースのDockerイメージに問題が発生した場合、Herokuのログを確認してエラーメッセージを特定してください。

```
heroku logs --tail
```

デプロイ中に支援が必要な場合は、[Wallarm support team](mailto:support@wallarm.com)までお問い合わせください。
```