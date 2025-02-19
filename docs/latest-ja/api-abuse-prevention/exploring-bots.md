[link-attacks]:                 ../user-guides/events/check-attack.md
[link-sessions]:                ../api-sessions/overview.md
[link-api-abuse-prevention]:    ../api-abuse-prevention/overview.md
[img-api-sessions-api-abuse]:   ../images/api-sessions/api-sessions-api-abuse.png

# ボット活動の解析 <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

API Abuse Prevention はMLアルゴリズムに基づいて悪意のあるボット活動を識別します。このような攻撃は、単一のブロックされたリクエストだけでは解析できません。したがって、Wallarmプラットフォームがボット活動を様々な角度から調査するための幅広いツールを提供することが不可欠です。

## API不正利用ダッシュボード

API Abuse Prevention は直感的に、直近30日間のボット活動データを **API Abuse Prevention** セクション → **Statistics** タブで視覚化します。タイムライン図を使用すれば、ボット活動の急増を容易に特定できます。さらに、**Top Attackers** と **Top Targets** ウィジェットにより、最も活発なボットや最も攻撃されたAPIおよびアプリケーションを判断できます。ダッシュボード上の要素を1クリックするだけで、**Attacks** タブに詳細調査へ進むことが可能です。

また、下部の **Behavioral patterns** ではボットの挙動を分析できます。各検知器の詳細情報や、ボットの挙動判定においてどのように連携したかを確認できます。このウィジェットと右上の[deny- or graylisted](setup.md#creating-profiles) IPのカウンターは、**IP Lists** [history](../user-guides/ip-lists/overview.md#ip-list-history) へリンクしており、ボットのIPがブロックリストに登録された日時や期間を確認できます。

![API不正利用防止の統計](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

ボット活動が検出されなかった場合、**Legitimate traffic** 状態が表示されます:

![API不正利用防止の統計 - ボット検出なし](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics-nobots.png)

ボット検出はトラフィックに依存しているため、十分な量のトラフィックがない場合、API Abuse Prevention は **Insufficient data to build statistics** というメッセージで通知します。各プロファイルのトラフィックは **Profiles** タブで[確認](setup.md#per-profile-traffic)できます。

## Attacks

Wallarm Console の **Attacks** セクションで、ボットによって実行された攻撃を調査できます。`api_abuse`、`account_takeover`、`scraping`、`security_crawlers` の検索キーを使用するか、**Type** フィルターから適切なオプションを選択してください。

![API不正利用イベント](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-events.png)

API Abuse Prevention によりボットIPがdenylistに登録された場合でも、デフォルトではWallarmはそのIPから発信されたブロックされたリクエストの統計を[表示](../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)します。

**Detector値**

トリガーされた[detectors](overview.md#how-api-abuse-prevention-works)と、それらの値が示す通常の挙動からの逸脱度にご留意ください。上記の図では、例えば通常が `< 10` であるところに**Query abuse**が `326`、通常が `> 1` であるところに**Request interval**が `0.05` と表示されております。

**Heatmaps**

ボット情報は3種類のヒートマップで視覚化されます。すべてのヒートマップにおいて、バブルが大きいほど赤に近く、右上隅に位置するほど、そのIPをボットと判断すべき理由が多いことを示しています。

ヒートマップ上では、現在のボット（**this bot**）と過去24時間以内に同じアプリケーションを攻撃した他のボットとも比較できます。ボット数が多い場合は、最も疑わしい30件のみが表示されます。

ヒートマップ:
* **Performance** は、現在およびその他の検出されたボットのパフォーマンスを、リクエストの非一意性、スケジュールされたリクエスト、RPS、リクエスト間隔などとともに視覚化します。
* **Behavior** は、現在およびその他の検出されたボットの疑わしい行動スコアを、疑わしさの度合い、重要または敏感なエンドポイントへのリクエスト数、RPS、ボット検知器の検出数などとともに視覚化します。
* **HTTP errors** は、ボット活動によって引き起こされたAPIエラーを、対象エンドポイント数、不安全なリクエスト数、RPS、受信エラー応答コード数とともに視覚化します.

<!--Each heatmap includes detailed description of its bubble size, color and position meaning (use **Show more**). You can zoom in heatmap by drawing rectangular around required area.

The **API Abuse Prevention** module compiles client traffic into URL patterns. The URL pattern may have the following segments:

| Segment | Contains | Example |
|---|---|---|
| SENSITIVE | URL parts that provide access to the application's critical functions or resources, such as the admin panel. They should be kept confidential and restricted to authorized personnel to prevent potential security breaches. | `wp-admin` |
| IDENTIFIER | Various identifiers like numeric identifiers, UUIDs, etc. | - |
| STATIC | The folders that contain static files of different kinds. | `images`, `js`, `css` |
| FILE | Static file names. | `image.png` |
| QUERY | Query parameters. | - |
| AUTH | Content related to the authentication/authorization endpoints. | - |
| LANGUAGE | Language-related parts. | `en`, `fr` |
| HEALTHCHECK | Content related to the health check endpoints. | - |
| VARY | The segment is marked as VARY if it is impossible to attribute it to other categories. A variable part of the URL path. | - | -->

## API Sessionsを使用したAPI不正利用検出の精度検証

--8<-- "../include/bot-attack-full-context.md"