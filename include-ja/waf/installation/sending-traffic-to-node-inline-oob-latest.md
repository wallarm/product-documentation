使用しているデプロイ手法に応じて、以下の設定を行ってください。

=== "インライン"
    ロードバランサーのターゲットを更新し、トラフィックをWallarmインスタンスに送信するようにします。詳細は、使用しているロードバランサーのドキュメントを参照してください。
=== "アウトオブバンド"
    1. Webまたはプロキシサーバー（例：NGINX、Envoy）を、受信トラフィックをWallarmノードにミラーリングするように設定します。設定の詳細については、Webまたはプロキシサーバーのドキュメントを参照することをお勧めします。

        この[リンク][web-server-mirroring-examples]に、主要なWebおよびプロキシサーバー（NGINX、Traefik、Envoy）の設定例が掲載されています。
    1. Wallarmフィルタリングノードが稼働しているマシンの`/etc/nginx/sites-enabled/default`ファイルに、次の設定を記述します。

        ```
        location / {
            include /etc/nginx/presets.d/mirror.conf;
            
            # 222.222.222.22をミラーリングサーバーのアドレスに変更してください
            set_real_ip_from  222.222.222.22;
            real_ip_header    X-Forwarded-For;
        }
        ```

        `set_real_ip_from`と`real_ip_header`のディレクティブは、Wallarm Consoleで[攻撃者のIPアドレスを表示する][real-ip-docs]ために必要です。