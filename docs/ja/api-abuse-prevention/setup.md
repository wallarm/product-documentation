# API Abuse Preventionプロファイルの管理 <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm Consoleの**API Abuse Prevention**セクションでは、[**API Abuse Prevention**](../api-abuse-prevention/overview.md)モジュールの設定に必要なAPI abuseプロファイルを管理することができます。

このセクションは、以下の[役割](../user-guides/settings/users.md#user-roles)を持つユーザーのみが利用可能です：

* 通常のアカウントでは **管理者**または**アナリスト**
* マルチテナンシ機能を持つアカウントでは **グローバル管理者**または**グローバルアナリスト**

## API abuseプロファイルの作成

API abuseプロファイルを作成するには：

1. Wallarm Console → **API Abuse Prevention** で **プロファイル作成** をクリックします。
1. 保護するアプリケーションを選択します。
1. [容忍度](../api-abuse-prevention/overview.md#tolerance)レベルを選択します。
1. 必要に応じて、**Protect from**セクションで、保護対象とする[ボットのタイプ](../api-abuse-prevention/overview.md#automated-threats-blocked-by-api-abuse-prevention)を制限します。
1. 適切な[悪意のあるボットへの反応](../api-abuse-prevention/overview.md#reaction-to-malicious-bots)を選択します。
1. 名前とオプションで説明を設定します。

    ![API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

    API abuseプロファイルが設定されると、モジュールは[トラフィック分析と自動化された脅威のブロック](../api-abuse-prevention/overview.md#how-api-abuse-prevention-works)を開始します。

## API abuseプロファイルの無効化

無効化されたプロファイルは、**API Abuse Prevention**モジュールがトラフィック分析中には使用しないものの、プロファイルリストには依然として表示されます。有効なプロファイルがない場合、モジュールは悪意のあるボットをブロックしません。

対応する**Disable**オプションを使用してプロファイルを無効化できます。

## API abuseプロファイルの削除

削除されたプロファイルは、復元することができず、**API Abuse Prevention**モジュールがトラフィック分析中に使用しません。

対応する**Delete**オプションを使用してプロファイルを削除できます。

## ブロックされた悪意のあるボットとその攻撃の調査

**API Abuse Prevention**モジュールは、[denylist](../user-guides/ip-lists/denylist.md)または[graylist](../user-guides/ip-lists/graylist.md)にボットを追加することで、ボットを1時間ブロックします。

Wallarm Console → **IPリスト** → **Denylist** または **Graylist** でブロックされたボットのIPを調査することができます。`Bot` という**原因**で追加されたIPを調査します。

![Denylisted bot IPs](../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)

!!! info "確信度"
    [ディテクターの作業](../api-abuse-prevention/overview.md#how-api-abuse-prevention-works)結果、検出された全てのボットには**確信度のパーセンテージ**が与えられます。つまり、これがボットであると私たちはどの程度確信しているかということです。ボットタイプごとにディテクターには異なる相対的重要性/投票数があります。そのため、確信度のパーセンテージは、このボットタイプで可能な全投票数の中で獲得した投票数です（作業したディテクターから提供されます）。

ボット保護プロセスに介入することができます。denylistまたはgraylistに追加されているIPが実際には悪意のあるボットに使用されていない場合、リストからIPを削除するか、[allowlist](../user-guides/ip-lists/allowlist.md)に追加することができます。Wallarmは、allowlistに追加されたIPからのすべてのリクエスト、悪意のあるものも含めてブロックすることはありません。

また、ボットによるAPI abuse攻撃を調査することもできます。これは、Wallarm Console → **イベント**セクションで行うことができます。`api_abuse`検索キーを使用するか、**タイプ**フィルターから`API Abuse`を選択します。

![API Abuse events](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-events.png)

ボット情報は3つのヒートマップで視覚化されます。全てのヒートマップでは、バブルが大きくなり、色が赤くなり、右上角に近づくほど、そのIPをボットと見なす理由が増えます。

ヒートマップでは、現在のボット（**this bot**）を過去24時間以内に同一のアプリケーションを攻撃した他のボットと比較することもできます。攻撃したボットが多すぎる場合、もっとも疑わしい30個だけが表示されます。

ヒートマップは以下のとおりです：

* **パフォーマンス**は、現在と他の検出されたボットのパフォーマンスを視覚化します。これには、リクエストの非一意性、スケジュールされたリクエスト、RPS、リクエスト間隔が含まれます。
* **行動**は、現在と他の検出されたボットの疑わしい行動のスコアを視覚化します。これには、疑わしい行動の度合い、重要または敏感なエンドポイントへのリクエストの量、RPS、ボットとして彼らを検出したボットディテクターの数が含まれます。
* **HTTPエラー**は、ボットの活動によって引き起こされたAPIエラーを視覚化します。これには、彼らがターゲットする異なるエンドポイントの数、彼らが行う安全でないリクエストの数、彼らのRPS、彼らが受け取るエラーレスポンスコードの数が含まれます。

各ヒートマップには、バブルのサイズ、色、位置の詳細な説明が含まれています（**詳細表示**を使用）。必要な領域を矩形で囲んでヒートマップをズームインすることができます。

**API Abuse Prevention**モジュールは、クライアントのトラフィックをURLパターンにまとめます。URLパターンには以下のセグメントがあります：

| セグメント | 含む内容 | 例 |
|---|---|---|
| SENSITIVE | 例えば管理パネルなど、アプリケーションの重要な機能やリソースへのアクセスを提供するURL部分。これらは潜在的なセキュリティ侵害を防ぐため、機密情報として保持され、承認された担当者のみが利用できるように制限すべきです。 | `wp-admin` |
| IDENTIFIER | 例えば数値識別子、UUIDなどのさまざまな識別子。 | - |
| STATIC | 様々な種類の静的ファイルを含むフォルダ。 | `images`, `js`, `css` |
| FILE | 静的ファイル名。 | `image.png` |
| QUERY | クエリパラメータ。 | - |
| AUTH | 認証/認可エンドポイントに関連するコンテンツ。 | - |
| LANGUAGE | 言語関連部分。 | `en`, `fr` |
| HEALTHCHECK | ヘルスチェックエンドポイントに関連するコンテンツ。 | - |
| VARY | その他のカテゴリに分類することができない場合、そのセグメントはVARYとマークされます。URLパスの可変部分。 | - |

## 例外リストの使用

API Abuse Preventionによってこれらをブロックするのを防ぐため、いくつかのIPを正当なボットやクローラーと関連付けるためにマークするには、[**例外リスト**](../api-abuse-prevention/overview.md#exception-list)を使用します。

IPアドレスまたは範囲を例外リストに追加し、ターゲットアプリケーションを指定します。これにより、これらのアドレスからの任意のリクエストは、これらのアドレスを悪意のあるボットとしてマークすることなく、ターゲットアプリケーションへと送られます。また、これらのアドレスはAPI Abuse Preventionによって[deny-](../user-guides/ip-lists/denylist.md)または[graylist](../user-guides/ip-lists/graylist.md)に追加されません。

例外リストへのIPアドレスの追加方法は2つあります：

*  **API Abuse Prevention** セクション → **例外リスト** タブにある **例外追加**を通じて。ここでは、IPやサブネットの他にAPI Abuse Preventionが無視すべき位置やソースタイプも追加できます。

    ![API Abuse prevention - adding items from inside exception list](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-inside.png)

*  **イベント** セクションから：`api_abuse`検索キーを使用するか、**タイプ**フィルターから`API Abuse`を選択した後、必要なイベントを展開し**例外リストに追加**をクリックします。

    ![API Abuse prevention - adding items from inside exception list](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-event.png)

IPアドレスが例外リストに追加されると、そのアドレスは自動的に[deny-](../user-guides/ip-lists/denylist.md)または[graylist](../user-guides/ip-lists/graylist.md)から削除されますが、それはAPI Abuse Prevention自体が（`Bot`の原因で）そこに追加した場合のみです。

!!! info "IPからの他の攻撃タイプのブロック"
    例外リストのIPが他の[攻撃タイプ](../attacks-vulns-list.md)を生み出す場合、例えばブルートフォース攻撃や入力検証攻撃など、Wallarmはそのようなリクエストをブロックします。

デフォルトでは、IPは永久に例外リストに追加されます。これを変更し、アドレスが例外リストから削除されるべき時間を設定することができます。また、必要に応じて任意の時間にすぐにアドレスを例外から削除することもできます。

**例外リスト**タブは、過去の選択された期間内にリストに存在したアイテムを表示する履歴データを提供します。
