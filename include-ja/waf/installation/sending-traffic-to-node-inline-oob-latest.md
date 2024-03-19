使用されているデプロイメントアプローチに応じて、以下の設定を行ってください：

=== "インライン"
    ロードバランサーのターゲットを更新し、トラフィックをWallarmインスタンスに送信するようにしてください。詳細については、ロードバランサーのドキュメントを参照してください。
=== "アウトオブバンド"
    1. Webサーバーやプロキシサーバー（例：NGINX、Envoy）を構成し、受信トラフィックをWallarmノードにミラーリングします。構成の詳細については、Webサーバーまたはプロキシサーバーのドキュメントを参照することをお勧めします。

        以下の[リンク][web-server-mirroring-examples]内に、最も人気のあるWebおよびプロキシサーバー（NGINX、Traefik、Envoy）の例の構成が見つかります。
    1. ノードを含むインスタンスの`/etc/nginx/sites-enabled/default`ファイルに次の構成を設定します：

        ```
        location / {
            include /etc/nginx/presets.d/mirror.conf;
            
            # 222.222.222.22をミラーリングサーバーのアドレスに変更
            set_real_ip_from  222.222.222.22;
            real_ip_header    X-Forwarded-For;
        }
        ```

        `set_real_ip_from`および`real_ip_header`ディレクティブは、Wallarmコンソールが[攻撃者のIPアドレスを表示する][real-ip-docs]ために必要です。