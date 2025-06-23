1. 以下は、Webサーバまたはプロキシサーバ（トラフィックをミラーリングするもの）あるいはWallarmノードが配置されるマシンのいずれかのアドレスに対し、テスト[パストラバーサル][ptrav-attack-docs]攻撃を送信するリクエストです:

    ```
    curl http://<ADDRESS>/etc/passwd
    ```
2. Wallarm Console→**Attacks**セクションを[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)で開き、攻撃がリストに表示されることを確認します。
    ![インターフェース内の攻撃][attacks-in-ui-image]

Wallarm OOBはモニタリングモードで動作するため、Wallarmノードは攻撃をブロックせず、記録します。