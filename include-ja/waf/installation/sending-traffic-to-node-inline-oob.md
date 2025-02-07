Depending on the deployment approach being used, perform the following settings:

=== "In-line"
    ロードバランサのターゲットを更新して、トラフィックをWallarmインスタンスへ送信するように設定します。詳細はロードバランサのドキュメントを参照してください。
=== "Out-of-Band"
    Webサーバまたはプロキシサーバ（例: NGINX, Envoy）を設定して、受信トラフィックをWallarmノードにミラーリングしてください。設定の詳細はWebサーバまたはプロキシサーバのドキュメントを参照することを推奨します。

    [link][web-server-mirroring-examples] 内に、最も普及しているWebおよびプロキシサーバ（NGINX, Traefik, Envoy）の例の設定が記載されています。