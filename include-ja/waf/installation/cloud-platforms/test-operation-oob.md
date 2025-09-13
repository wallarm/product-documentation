1. トラフィックをミラーリングしているWebサーバーまたはプロキシサーバー、もしくはWallarmノードが稼働しているマシンのアドレス宛に、テスト用の[パストラバーサル][ptrav-attack-docs]攻撃リクエストを送信します：

    ```
    curl http://<ADDRESS>/etc/passwd
    ```
2. Wallarm Console → **Attacks**セクションを、[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)で開き、攻撃が一覧に表示されていることを確認します。
    ![インターフェースのAttacks][attacks-in-ui-image]

Wallarm OOBはモニタリングモードで動作しているため、Wallarmノードは攻撃をブロックしませんが、記録します。