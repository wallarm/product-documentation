Wallarmデプロイメントアプローチ（[インライン][inline-docs]または[アウト・オブ・バンド][oob-docs]）に応じて、Wallarm Cloudにインスタンスを登録するために使用されるコマンドが異なります。

=== "インライン"
    クラウドインスタンスのノードは、[cloud-init.py][cloud-init-spec]スクリプトを介してクラウドに接続します。このスクリプトは提供されたトークンを使用してノードをWallarm Cloudに登録し、監視[モード][wallarm-mode]をグローバルに設定し、`--proxy-pass`フラグに基づいて正当なトラフィックを転送するようにノードを設定します。NGINXを再起動すると、セットアップが完了します。

    クラウドイメージから作成されたインスタンスで`cloud-init.py`スクリプトを次のように実行します：

    === "US Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'` はノードグループ名を設定します（既存のもの、または存在しない場合は作成されます）。APIトークンを使用している場合にのみ適用されます。
    * `<TOKEN>` はトークンのコピーされた値です。
    * `<PROXY_ADDRESS>` は、Wallarmノードが正当なトラフィックをプロキシするアドレスです。アプリケーションインスタンス、ロードバランサー、DNS名など、アーキテクチャに応じて変わります。
=== "アウト・オブ・バンド"
    クラウドインスタンスのノードは、[cloud-init.py][cloud-init-spec]スクリプトを介してクラウドに接続します。このスクリプトは提供されたトークンを使用してノードをWallarm Cloudに登録し、監視[モード][wallarm-mode]をグローバルに設定し、NGINXの`location /`ブロックに[`wallarm_force`][wallarm_force_directive]ディレクティブを設定して、ミラーリングされたトラフィックのコピーのみを分析します。NGINXを再起動すると、セットアップが完了します。

    クラウドイメージから作成されたインスタンスで`cloud-init.py`スクリプトを次のように実行します：

    === "US Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'` はノードグループ名を設定します（既存のもの、または存在しない場合は作成されます）。APIトークンを使用している場合にのみ適用されます。
    * `<TOKEN>` はトークンのコピーされた値です。