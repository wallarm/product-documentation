1. ロードバランサまたはWallarmノードを持つマシンのいずれかのアドレスへのテスト[Path Traversal][ptrav-attack-docs]攻撃のリクエスト：

    ```
    curl http://<ADDRESS>/etc/passwd
    ```
2. Wallarm Consoleを開き、[US Cloud](https://us1.my.wallarm.com/search)または[EU Cloud](https://my.wallarm.com/search)の**イベント**セクションを開き、攻撃がリストに表示されていることを確認してください。
    ![!インターフェイスでの攻撃][attacks-in-ui-image]

Wallarmは監視モードで動作しているため、Wallarmノードは攻撃をブロックせずに登録します。