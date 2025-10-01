1. ロードバランサーまたはWallarmノードが稼働するマシンのアドレスに対して、テスト用の[パストラバーサル][ptrav-attack-docs]攻撃を送信します:

    ```
    curl http://<ADDRESS>/etc/passwd
    ```
2. [US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)でWallarm Console → **Attacks**セクションを開き、攻撃が一覧に表示されていることを確認します。
    ![インターフェースのAttacks][attacks-in-ui-image]

    Wallarmはモニタリングモードで動作しているため、Wallarmノードは攻撃をブロックせず、記録します。

1. 必要に応じて、ノードの他の動作面も[テスト][link-wallarm-health-check]します。