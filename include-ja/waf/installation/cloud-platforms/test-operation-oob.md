1. Webサーバーやトラフィックをミラーリングするプロキシサーバーのアドレス、もしくはWallarmノードのマシンへのテスト[Path Traversal][ptrav-attack-docs]攻撃を含むリクエスト：

    ```
    curl http://<アドレス>/etc/passwd
    ```
2. [US Cloud](https://us1.my.wallarm.com/search) または [EU Cloud](https://my.wallarm.com/search)のWallarmコンソールを開き、**イベント**セクションで攻撃がリストに表示されていることを確認します。
   ![インタフェースの攻撃][attacks-in-ui-image]

 Wallarm OOBはモニタリングモードで動作するため、Wallarmノードは攻撃をブロックせず、登録します。