[link-attacks]:                 ../user-guides/events/check-attack.md
[link-sessions]:                ../api-sessions/overview.md
[link-api-abuse-prevention]:    ../api-abuse-prevention/overview.md
[img-api-sessions-api-abuse]:   ../images/api-sessions/api-sessions-api-abuse.png

# ボット活動の調査 <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Abuse Prevention](../api-abuse-prevention/overview.md)は機械学習(ML)アルゴリズムに基づいて悪意のあるボット活動を特定します。この種の攻撃は、単一のブロックされたリクエストだけでは分析できません。そのため、Wallarmプラットフォームが多角的にボット活動を調査できる幅広いツールを提供していることが重要です。

## APIの悪用ダッシュボード

API Abuse Preventionは、過去30日間のボットアクティビティに関するデータを**API Abuse Prevention**セクション→**Statistics**タブで見やすく可視化します。タイムラインのダイアグラムを使用すると、ボット活動のスパイクを簡単に特定できます。さらに、**Top Attackers**と**Top Targets**ウィジェットにより、最も活発なボットや最も攻撃を受けているAPIやアプリケーションを把握できます。ダッシュボード要素を1回クリックするだけで、**Attacks**タブにドリルダウンしてこれらのボット活動を調査できます。

画面下部の**Behavioral patterns**でもボットの行動を分析できます。各ディテクターの詳細およびボット行動の判定におけるそれらの組み合わせ方を確認できます。このウィジェットと右上の[denylistedまたはgraylisted](setup.md#creating-profiles)のIPのカウンターは、**IP Lists**の[履歴](../user-guides/ip-lists/overview.md#ip-list-history)へリンクしており、ボットのIPがいつ、どの期間ブロッキングリストに入れられたかを確認できます。

![API Abuse Preventionの統計](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

ボット活動が検出されなかった場合は、**Legitimate traffic**状態が表示されます:

![API Abuse Preventionの統計 - ボット未検出](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics-nobots.png)

なお、ボット検出はトラフィックに依存します。十分な量のトラフィックがない場合、API Abuse Preventionは**Insufficient data to build statistics**というメッセージで通知します。**Profiles**タブでプロファイルごとのトラフィックを[確認](setup.md#per-profile-traffic)できます。

## 攻撃

Wallarm Console→**Attacks**セクションで、ボットによって実行された攻撃を調査できます。`api_abuse`、`account_takeover`、`scraping`、`security_crawlers`の検索キーを使用するか、**Type**フィルターから該当するオプションを選択します。

![API Abuseのイベント](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-events.png)

なお、API Abuse PreventionによってボットのIPがdenylistに入れられている場合でも、デフォルトでWallarmはそのIPからのブロックされたリクエストに関する統計を収集して[表示](../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)します。

**ディテクターの値**

発火した[ディテクター](overview.md#how-api-abuse-prevention-works)の一覧と、それぞれの異常が通常の振る舞いからどの程度乖離しているかを示す値にご注意ください。たとえば上の図では、通常は`< 10`であるところ`326`となっている**Query abuse**、通常は`> 1`であるところ`0.05`となっている**Request interval**などがあります。

**ヒートマップ**

ボット情報は3つのヒートマップで可視化されます。いずれのヒートマップでも、バブルが大きいほど、赤色に近いほど、右上に位置するほど、そのIPをボットと見なす理由が多いことを意味します。

ヒートマップ上では、現在のボット(**this bot**)と、過去24時間に同じアプリケーションを攻撃した他のボットを比較することもできます。該当するボットが多すぎる場合は、最も疑わしい30件のみが表示されます。

ヒートマップ:

* **Performance** 現在のボットおよび他の検出済みボットのパフォーマンスを可視化します。リクエストの非一意性、スケジュールされたリクエスト、RPS、リクエスト間隔などを含みます。
* **Behavior** 現在のボットおよび他の検出済みボットの不審行動スコアを可視化します。不審行動の度合い、重要または機微なエンドポイントへのリクエスト数、RPS、彼らをボットと判定したディテクターの数などを含みます。
* **HTTP errors** ボット活動に起因するAPIエラーを可視化します。対象としている異なるエンドポイントの数、行っている安全でないリクエストの数、RPS、受信したエラーレスポンスコードの数などを含みます.

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

## API SessionsによるAPIの悪用検知精度の検証

--8<-- "../include/bot-attack-full-context.md"