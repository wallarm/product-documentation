BOLA保護を有効化すると、Wallarmは次の処理を行います：

1. BOLA攻撃の標的になりやすいAPIエンドポイントを特定します。例えば、[パスパラメータの可変性][variability-in-endpoints-docs]があるもの: `domain.com/path1/path2/path3/{variative_path4}`。

    !!! info "この段階には一定の時間が必要です"
        脆弱なAPIエンドポイントの特定には、検出されたAPIインベントリおよび受信トラフィックの傾向を綿密に監視するための一定の時間が必要です。
    
    自動でBOLA攻撃から保護されるのは、**API Discovery**モジュールによって探索されたAPIエンドポイントのみです。保護対象のエンドポイントは[対応するアイコンでハイライト表示されます][bola-protection-for-endpoints-docs]。
1. 脆弱なAPIエンドポイントをBOLA攻撃から保護します。既定の保護ロジックは次のとおりです。

    * 脆弱なエンドポイントに対し、同一IPから1分あたり180件を超えるリクエストはBOLA攻撃と見なします。
    * 同一IPからのリクエスト数がしきい値に達したときのみ、イベントリストにBOLA攻撃を登録します。WallarmはBOLA攻撃をブロックしません。リクエストは引き続きアプリケーションに送信され続けます。

        autoprotection templateにおけるreactionは**Only register attacks**です。
1. [APIの変更][changes-in-api-docs]に応じて、新たに脆弱なエンドポイントを保護し、削除されたエンドポイントの保護を無効化します。