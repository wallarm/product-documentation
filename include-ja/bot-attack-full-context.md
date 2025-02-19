Wallarmの[API Abuse Prevention][link-api-abuse-prevention]によって悪意のあるボットの活動が検出され、[**Attacks**][link-attacks]セクションに表示されると、この攻撃のリクエストが属するユーザーセッションおよびそのセッション内のリクエストの全シーケンスという完全なコンテキストを把握することができます。これにより、対象のアクターのすべての活動を調査し、このアクターを悪意のあるボットとしてマークする決定が正しかったかどうかを検証できます。

この分析を実施するには、Wallarm Console → **Attacks**にてボット攻撃の詳細にアクセスし、次に**Explore in API Sessions**をクリックします。Wallarmは[**API Session**][link-sessions]セクションをフィルタ済みで開き、これらのボット活動に関連するセッションを表示します。

![!API Sessions section - monitored sessions][img-api-sessions-api-abuse]