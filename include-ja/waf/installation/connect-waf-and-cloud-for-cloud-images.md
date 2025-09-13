選択したWallarmのデプロイ方法（[インライン][inline-docs]または[アウトオブバンド][oob-docs]）に応じて、Wallarm Cloudにインスタンスを登録するために使用するコマンドが異なります。

=== "インライン"
    クラウドインスタンスのノードは、[cloud-init.py][cloud-init-spec]スクリプトを介してWallarm Cloudに接続します。このスクリプトは、提供されたトークンを使用してノードをWallarm Cloudに登録し、監視[モード][wallarm-mode]にグローバルに設定し、`--proxy-pass`フラグに基づいて正規トラフィックをプロキシするようノードを設定します。NGINXを再起動するとセットアップが完了します。

    クラウドイメージから作成したインスタンスで、次のように`cloud-init.py`スクリプトを実行します。

    === "US Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'`はノードグループ名（既存のもの。存在しない場合は作成されます）を設定します。APIトークンを使用する場合にのみ適用されます。
    * `<TOKEN>`は、コピーしたトークンの値です。
    * `<PROXY_ADDRESS>`は、Wallarmノードが正規トラフィックをプロキシする宛先アドレスです。アーキテクチャに応じて、アプリケーションインスタンスのIP、ロードバランサ、DNS名などを指定できます。
=== "アウトオブバンド"
    クラウドインスタンスのノードは、[cloud-init.py][cloud-init-spec]スクリプトを介してWallarm Cloudに接続します。このスクリプトは、提供されたトークンを使用してノードをWallarm Cloudに登録し、監視[モード][wallarm-mode]にグローバルに設定し、さらにNGINXの`location /`ブロックで[`wallarm_force`][wallarm_force_directive]ディレクティブを設定して、ミラーされたトラフィックのコピーのみを解析するようにします。NGINXを再起動するとセットアップが完了します。

    クラウドイメージから作成したインスタンスで、次のように`cloud-init.py`スクリプトを実行します。

    === "US Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'`はノードグループ名（既存のもの。存在しない場合は作成されます）を設定します。APIトークンを使用する場合にのみ適用されます。
    * `<TOKEN>`は、コピーしたトークンの値です。