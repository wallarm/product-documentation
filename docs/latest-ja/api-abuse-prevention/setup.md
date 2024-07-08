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
