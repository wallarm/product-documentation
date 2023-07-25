1. Webサーバーまたはプロキシサーバーのトラフィックをミラーリングするアドレス、またはWallarmノードがあるマシンに対して、試験的な[パス侵害][ptrav-attack-docs]攻撃を含むリクエストを行います:

    ```
    curl http://<ADDRESS>/etc/passwd
    ```
2. Wallarmコンソールを開き、[USクラウド](https://us1.my.wallarm.com/search)または[EUクラウド](https://my.wallarm.com/search)の**イベント**セクションを選択し、攻撃がリストに表示されていることを確認してください。
    ![インターフェース内の攻撃][attacks-in-ui-image]

Wallarm OOBは監視モードで動作しているため、Wallarmノードは攻撃をブロックせずに登録します。