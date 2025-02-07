``` markdown
選択されたWallarm展開方式（[in-line][inline-docs]または[Out-of-Band][oob-docs]）に応じて、Wallarm Cloudにインスタンスを登録するための異なるコマンドを使用します。

=== "インライン"
    クラウドインスタンスのノードは[cloud-init.py][cloud-init-spec]スクリプトを介してCloudに接続します。このスクリプトは提供されたトークンを使用してノードをWallarm Cloudに登録し、グローバルに監視[mode][wallarm-mode]に設定し、`--proxy-pass`フラグに基づいて正当なトラフィックを転送するようにノードを設定します。NGINXを再起動して設定を完了します。

    以下のように、クラウドイメージから作成されたインスタンス上で`cloud-init.py`スクリプトを実行します：

    === "USクラウド"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
        ```
    === "EUクラウド"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'`はノードグループ名を設定します（既存の場合も、存在しない場合は作成されます）。これはAPIトークン使用時にのみ適用されます。
    * `<TOKEN>`はトークンのコピーされた値です。
    * `<PROXY_ADDRESS>`はWallarmノードが正当なトラフィックをプロキシする宛先アドレスです。アーキテクチャに応じて、アプリケーションインスタンスのIP、ロードバランサー、またはDNS名などを指定できます。

=== "アウトオブバンド"
    クラウドインスタンスのノードは[cloud-init.py][cloud-init-spec]スクリプトを利用してCloudに接続します。このスクリプトは提供されたトークンを用いてノードをWallarm Cloudに登録し、グローバルに監視[mode][wallarm-mode]に設定し、NGINXの`location /`ブロックに[`wallarm_force`][wallarm_force_directive]ディレクティブを設定して、ミラーリングされたトラフィックのコピーのみを解析するようにします。NGINXを再起動して設定を完了します。

    以下のように、クラウドイメージから作成されたインスタンス上で`cloud-init.py`スクリプトを実行します：

    === "USクラウド"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
        ```
    === "EUクラウド"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'`はノードグループ名を設定します（既存の場合も、存在しない場合は作成されます）。これはAPIトークン使用時にのみ適用されます。
    * `<TOKEN>`はトークンのコピーされた値です。
```