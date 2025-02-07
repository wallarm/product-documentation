Depending on the deployment approach being used, perform the following settings:  
使用しているデプロイメントアプローチに応じて、以下の設定を行います：

=== "In-line"
    ロードバランサのターゲットを更新し、トラフィックをWallarmインスタンスに送信します。詳細については、お使いのロードバランサのドキュメントをご参照ください。
=== "Out-of-Band"
    1. Webまたはプロキシサーバ（例: NGINX, Envoy）を設定して、受信トラフィックをWallarmノードにミラーリングします。構成の詳細については、お使いのWebまたはプロキシサーバのドキュメントをご参照いただくことを推奨します。

        [こちら][web-server-mirroring-examples]に、最も一般的なWebおよびプロキシサーバ（NGINX, Traefik, Envoy）の例となる構成が記載されています。
    1. ノードが存在するインスタンスの`/etc/nginx/sites-enabled/default`ファイルに以下の構成を設定します:

        ```
        location / {
            include /etc/nginx/presets.d/mirror.conf;
            
            # 222.222.222.22をミラーリングサーバのアドレスに変更します
            set_real_ip_from  222.222.222.22;
            real_ip_header    X-Forwarded-For;
        }
        ```

        Wallarm Consoleが攻撃者のIPアドレスを表示するためには、`set_real_ip_from`および`real_ip_header`ディレクティブが必要です。[詳細はこちら][real-ip-docs]をご参照ください。