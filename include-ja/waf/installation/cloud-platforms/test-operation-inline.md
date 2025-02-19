1. テスト用の[Path Traversal][ptrav-attack-docs]攻撃をロードバランサーまたはWallarmノードのマシンのいずれかのアドレスに送信します:

    ```
    curl http://<ADDRESS>/etc/passwd
    ```
2. Wallarm Consoleを開き、[US Cloud](https://us1.my.wallarm.com/search)または[EU Cloud](https://my.wallarm.com/search)の**Attacks**セクションに移動し、攻撃がリストに表示されることを確認します。
    ![インターフェースに表示された攻撃][attacks-in-ui-image]

Wallarmはモニタリングモードで動作しますので、Wallarmノードは攻撃をブロックせずに登録します。