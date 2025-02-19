# API Abuse Prevention セットアップ <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

この記事では、悪意のあるボットを検知・緩和し、正当な活動がブロックされるのを回避するために、[API Abuse Prevention](../api-abuse-prevention/overview.md)モジュールを有効化および構成する方法について説明します。

## 有効化

API Abuse Preventionモジュールは**Advanced API Security**[subscription plan](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security)で利用可能です。デフォルトでは無効になっています。

API Abuse Preventionを有効にするには:

1. お使いのWallarmノードが4.2以降であることを確認してください。
1. Wallarm Console → **API Abuse Prevention**で、少なくとも1つの[API Abuse profile](#creating-profiles)を作成または有効にしてください。

## プロファイルの作成

API abuseプロファイルは、Wallarmの**API Abuse Prevention**が悪意のあるボットをどのように検出・緩和するかの設定に使用します。各アプリケーションごとに異なるプロファイルを作成できます。各アプリケーションには1つの関連プロファイルのみが使用されます。

プロファイルは、どの種類のボットから保護するか、各ボットの検出感度、およびボットの活動に対する対応を定義します。

API abuseプロファイルを作成するには:

1. **API Abuse Prevention**セクションで、**Profiles**タブに切り替えてください。
1. **Create profile**をクリックしてください。
1. 保護対象の[automated threats](../api-abuse-prevention/overview.md#automated-threats-blocked-by-api-abuse-prevention)を選択し、**Reaction**を設定してください:
    
    * **Disabled** - Wallarmはこの種類のボットから保護しません．
    * **Register attack** - 検出された悪意のあるボットの活動はWallarm Consoleの[**Attacks**](../user-guides/events/check-attack.md)セクションに表示され、リクエストはブロックされません。

        これらのイベントの詳細から、**Add source IP to denylist**ボタンを使用してボットを迅速にブロックすることができます。そのIPはdenylistに永久に追加されますが、**IP Lists**セクションで削除するか、リストに滞在する時間を変更できます。

    * **Denylist IP**または**Graylist IP** - ボットのIPは選択された期間に応じて対応するリストに追加され、リクエストはブロックされます。denylistとgraylistの違いの詳細は[こちら](../user-guides/ip-lists/overview.md)をご確認ください。

1. 必要に応じて、各ボットの検出に対する**Sensitivity**を変更してください:
    
    * **Paranoid** - 高い感度はアプリケーションへのボットのアクセスを減らしますが、偽陽性により一部の正当なリクエストをブロックする可能性があります。
    * **Normal**（デフォルト、推奨） - 多くの偽陽性を回避し、ほとんどの悪意のあるボットのリクエストがAPIに到達するのを防ぐために最適なルールを使用します。
    * **Safe mode** - 低い感度はアプリケーションへのボットのアクセスを増やしますが、その代わりに正当なリクエストがドロップされることはありません。

        ![API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

1. アプリケーションを選択してください。
1. **Analyze behavior by**パラメータを設定してください:

    * **Applications** - アプリケーションのすべてのドメインへのリクエストを一括して分析します。
    * **Domains** - アプリケーションの各ドメインへのリクエストを個別に分析します。

<a name="per-profile-traffic"></a>プロファイルが作成されると、選択されたアプリケーションは選択された種類の悪意のあるボットから保護されます。なお、保護およびデータ分析はプロファイルのアプリケーショントラフィックの有無や量に依存します。各プロファイルのステータスにご注意ください:

![API abuse prevention - profiles](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-profiles-per-profile-status.png)

## プロファイルの無効化と削除

無効なプロファイルは、**API Abuse Prevention**モジュールがトラフィック分析時に使用しないものの、プロファイルリストに表示されるものです。無効なプロファイルはいつでも再度有効にできます。有効なプロファイルが存在しない場合、モジュールは悪意のあるボットをブロックしません。

削除されたプロファイルは、復元できず、**API Abuse Prevention**モジュールがトラフィック分析時に使用しないものです。

プロファイルメニューに**Disable**および**Delete**オプションがございます。

## 例外

[例外を設定](exceptions.md)することで、正当なボットの識別や特定の対象URLおよびリクエストタイプに対するボット保護の無効化を行い、API Abuse Preventionを微調整できます。

## セッション機構の改善

API Abuse Preventionは、ボットの挙動を分析する際に[API Sessions](../api-sessions/overview.md)機構を使用します。

API Abuse Preventionの機能をより正確にするため、リクエストをセッションにまとめる際に未認証のトラフィックをより正確に識別するため、[JA3 fingerprinting](../admin-en/enabling-ja3.md)を有効にすることを推奨します。