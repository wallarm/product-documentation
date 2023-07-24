# API Abuse Preventionプロファイル管理 <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmコンソールの**API Abuse Prevention**セクションでは、[**API Abuse Prevention**](../about-wallarm/api-abuse-prevention.md)モジュールの設定に必要なAPI abuseプロファイルを管理できます。

このセクションは、次の[ロール](../user-guides/settings/users.md#user-roles)のユーザーのみが利用できます:

* 通常アカウント用の**管理者**または**アナリスト**
* マルチテナンシー機能があるアカウント用の**グローバル管理者**または**グローバルアナリスト**

## API abuseプロファイルの作成

API abuseプロファイルを作成するには：

1. Wallarm Console → **API Abuse Prevention** で、**Create profile** をクリックします。
1. 保護するアプリケーションを選択します。
1. [トレランス](../about-wallarm/api-abuse-prevention.md#tolerance)レベルを選択します。
1. 必要に応じて、**Protect from** セクションで、保護対象の [ボットの種類](../about-wallarm/api-abuse-prevention.md#automated-threats-blocked-by-api-abuse-prevention) を制限します。
1. [denylistやgraylistにボットを追加](../about-wallarm/api-abuse-prevention.md#reaction-to-malicious-bots)するかを選択します。
1. 名前とオプションで説明を設定します。

    ![!API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

    API abuseプロファイルが設定されると、モジュールは[トラフィック分析と対応する自動化脅威のブロック](../about-wallarm/api-abuse-prevention.md#how-api-abuse-prevention-works)を開始します。

## API abuseプロファイルの無効化

無効化されたプロファイルとは、**API Abuse Prevention**モジュールがトラフィック分析中に使用しないが、プロファイルリストには表示されるものです。無効化されたプロファイルをいつでも再度有効化することができます。有効なプロファイルがない場合、モジュールは悪意のあるボットをブロックしません。

対応する **Disable** オプションを使用して、プロファイルを無効化できます。

## API abuseプロファイルの削除

削除されたプロファイルとは、復元できず、**API Abuse Prevention**モジュールがトラフィック分析中に使用しないものです。

対応する **Delete** オプションを使用して、プロファイルを削除できます。

## ブロックされた悪意のあるボットとその攻撃の調査

**API Abuse Prevention** モジュールは、[denylist](../user-guides/ip-lists/denylist.md) または [graylist](../user-guides/ip-lists/graylist.md) に追加されたボットを 1 時間ブロックします。

Wallarm Console → **IP lists** → **Denylist** もしくは **Graylist** でブロックされたボットの IP を調査できます。`Bot` **Reason**で追加されたIPを見ます。

![!Denylisted bot IPs](../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)

ボット保護プロセスに干渉することができます。denylistやgraylistのIPが実際には悪意のあるボットに使用されていない場合、リストからIPを削除するか、[allowlist](../user-guides/ip-lists/allowlist.md)に追加できます。Wallarmは、allowlisted IPからのいかなるリクエストもブロックしません (悪意のあるものを含む)。

また、Wallarm Console → **Events** セクションで、ボットによるAPI Abuse攻撃を調査できます。`api_abuse` 検索キーを使用するか、**Type** フィルタから `API Abuse` を選択します。

![!API Abuse events](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-events.png)

<!-- ボット情報は3つのバブルプロットで可視化されます。すべてのプロットで、バブルが大きいほど赤色に近く、右上隅に近いほど、このIPをボットと見なす理由が多くなります。

プロットでは、過去24時間以内に同じアプリケーションを攻撃した他のボットと比較して現在のボット(**this bot**)を表示することもできます。あまりにも多くのボットが存在する場合、最も疑わしいボット30件のみが表示されます。

バブルプロット：

* **Bot performance** は、ボット活動の強度を表示します。これには以下が含まれます。

    * バブルサイズ：リクエストの非ユニーク性。IPが同じ（ユニークでない）APIエンドポイントをリクエストするほど、サイズが大きくなります。
    * 色：スケジュールされたリクエスト。APIエンドポイントがスケジュールに従ってリクエストされるほど（同じ時間間隔）、色が赤に近くなります。
    * 横方向：RPS（1秒あたりのリクエスト数）が多いほど、バブルが右に離れます。
    * 縦方向：リクエストレート（IPがリクエストを送信する速さ）が高いほど、グラフ上でバブルが高くなります。RPSと比較して：IPは1秒あたり3回のリクエストを送信することができます（これは多くありませんが）、3ミリ秒以内に送信されます（これは非常に速いです）。

* **Bot behavior** は、ボットの行動のさまざまな側面を表示します。これには以下が含まれます。

    * バブルサイズ：ビジネスロジックスコア。あなたのすべてのAPIエンドポイントの中で、IPが批判的または機密性の高いものをリクエストした頻度が高いほど、サイズが大きくなります。
    * 色：怪しい行動のスコア。あなたのすべてのAPIエンドポイントの中で、IPが通常のユーザーがあなたのアプリケーションに興味を持つのが珍しいものをリクエストした頻度が高いほど、色が赤に近くなります。
    * 横方向：RPS（1秒あたりのリクエスト数）が多いほど、バブルが右に離れます。
    * 縦方向：ボット検出器が「これはボットだ」と判断した回数が多いほど、グラフ上でバブルが高くなります。

* **Bot scope** は、ボットとその対象との関係を表示します。これには以下が含まれます。

    * バブルサイズ：IPが要求したAPIエンドポイントの種類が多いほど、サイズが大きくなります。
    * 色：IPが要求した安全でない方法のリクエストが多いほど、色が赤に近くなります。
    * 横方向：RPS（1秒あたりのリクエスト数）が多いほど、バブルが右に離れます。
    * 縦方向：オリジンサーバからのエラーレスポンス（4XX、5XX）が多いほど、グラフ上でバブルが高くなります。 -->

**API Abuse Prevention** モジュールは、クライアントのトラフィックをURLパターンにコンパイルします。URLパターンには、以下のセグメントがあります：

| セグメント  | 内容 | 例 |
|---|---|---|
| SENSITIVE | アプリケーションの重要な機能やリソースにアクセスするためのURLの一部。これらは管理者パネルなどです。潜在的なセキュリティ侵害を防ぐため、これらは機密に扱われ、承認された人員に限定されるべきです。 | `wp-admin` |
| IDENTIFIER | 数値識別子、UUIDなどのさまざまな識別子。 | - |
| STATIC | 異なる種類の静的ファイルが含まれるフォルダ。 | `images`, `js`, `css` |
| FILE | 静的ファイル名。 | `image.png` |
| QUERY | クエリパラメータ。 | - |
| AUTH | 認証/承認エンドポイントに関連するコンテンツ。 | - |
| LANGUAGE | 言語に関連する部分。 | `en`, `fr` |
| HEALTHCHECK | ヘルスチェックエンドポイントに関連するコンテンツ。 | - |
| VARY | そのセグメントが他のカテゴリに割り当てられない場合、VARYとしてマークされます。URLパスの可変部分。 | - |