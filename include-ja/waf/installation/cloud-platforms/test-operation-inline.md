1. Wallarmノードを持つロードバランサまたはマシンのアドレスに対するテスト[Path Traversal][ptrav-attack-docs]攻撃のリクエスト：

    ```
    curl http://<ADDRESS>/etc/passwd
    ```
2.[US Cloud](https://us1.my.wallarm.com/search)または[EU Cloud](https://my.wallarm.com/search)のWallarmコンソールを開き→**イベント**セクションを確認して、攻撃がリストに表示されていることを確認します。
	![列に表示された攻撃][attacks-in-ui-image]

Wallarmは監視モードで動作しているため、Wallarmノードは攻撃をブロックするのではなく、登録します。