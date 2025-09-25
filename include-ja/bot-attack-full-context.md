Wallarmの[API Abuse Prevention][link-api-abuse-prevention]が悪意あるボットの活動を検知し、[**Attacks**][link-attacks]セクションに表示されると、この攻撃に関するリクエストの完全なコンテキストを把握できるようになります。具体的には、どのユーザーセッションに属しているのか、このセッション内のリクエストの完全なシーケンスを確認できます。これにより、そのアクターの全活動を調査し、当該アクターを悪意あるボットと判定したことが正しかったかを検証できます。

この分析を行うには、Wallarm Console → **Attacks**でボット攻撃の詳細を開き、**Explore in API Sessions**をクリックします。Wallarmはフィルター済みの[**API Session**][link-sessions]セクションを開き、このボット活動に関連するセッションが表示されます。

![!API Sessionsセクション - 監視対象セッション][img-api-sessions-api-abuse]