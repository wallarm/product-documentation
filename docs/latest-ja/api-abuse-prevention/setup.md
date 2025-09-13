# API Abuse Preventionのセットアップ <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

このドキュメントでは、[API Abuse Prevention](../api-abuse-prevention/overview.md)モジュールを有効化して構成し、悪意あるボットを検出・軽減しつつ、正当なアクティビティのブロックを回避する方法を説明します。

## 有効化

API Abuse Preventionモジュールは**Advanced API Security**の[サブスクリプションプラン](../about-wallarm/subscription-plans.md#core-subscription-plans)で利用できます。デフォルトで無効です。

API Abuse Preventionを有効化するには:

1. Wallarmノードが4.2以降であることを確認します。
1. Wallarm Console → **API Abuse Prevention**で、少なくとも1つの[API Abuse profile](#creating-profiles)を作成または有効化します。

## プロファイルの作成

API Abuse Preventionプロファイルは、Wallarmの**API Abuse Prevention**が悪意あるボットをどのように検出・軽減するかを設定するために使用します。アプリケーションごとに異なるプロファイルを作成できます。各アプリケーションに関連付けられるプロファイルは1つだけです。

プロファイルでは、どの種類のボットから保護するか、各ボット種別をどのSensitivityで検知するか、そのボットの活動に対するReactionを定義します。

API Abuse Preventionプロファイルを作成するには:

1. **API Abuse Prevention**セクションで、**Profiles**タブに切り替えます。
1. **Create profile**をクリックします。
1. 保護対象とする[自動化された脅威](../api-abuse-prevention/overview.md#automated-threats-blocked-by-api-abuse-prevention)を選択し、**Reaction**を設定します:
    
    * **Disabled** - この種類のボットからは保護しません。 
    * **Register attack** - 検出された悪意あるボットの活動はWallarm Consoleの[**Attacks**](../user-guides/events/check-attack.md)セクションに表示され、リクエストはブロックされません。

        そのようなイベントの詳細から、**Add source IP to denylist**ボタンでボットを即座にブロックできます。IPはdenylistに無期限で追加されますが、**IP Lists**セクションで削除したり、リストに留める期間を変更できます。

    * **Denylist IP**または**Graylist IP** - ボットのIPが選択した期間、対応するリストに追加され、リクエストはブロックされます。denylistとgraylistの違いは[こちら](../user-guides/ip-lists/overview.md)をご覧ください。

1. 必要に応じて、各ボット種別の検知**Sensitivity**を変更します:
    
    * **Paranoid** - 感度が高いほど、アプリケーションに到達できるボットはより少なくなりますが、誤検知により正当なリクエストが一部ブロックされる可能性があります。
    * **Normal**(デフォルト、推奨) - 多くの誤検知を避けつつ、ほとんどの悪意あるボットのリクエストがAPIに到達するのを防ぐ最適なルールを使用します。
    * **Safe mode** - 感度が低いほど、より多くのボットがアプリケーションにアクセスできる一方で、正当なリクエストは破棄されません。

        ![API Abuse Preventionプロファイル](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

1. アプリケーションを選択します。
1. **Analyze behavior by**パラメータを設定します:

    * **Applications** - アプリケーションのすべてのドメインへのリクエストをまとめて分析します。
    * **Domains** - アプリケーションの各ドメインへのリクエストを個別に分析します。

<a name="per-profile-traffic"></a>作成後、プロファイルは選択したタイプの悪意あるボットから選択したアプリケーションを保護します。保護とデータ分析は、そのプロファイルに紐づくアプリケーショントラフィックの有無や量に依存します。プロファイルごとのステータスに注意してください:

![API Abuse Prevention - プロファイル](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-profiles-per-profile-status.png)

## プロファイルの無効化と削除

無効化されたプロファイルは、**API Abuse Prevention**モジュールがトラフィック分析に使用しませんが、プロファイル一覧には表示されます。無効化されたプロファイルはいつでも再度有効化できます。有効なプロファイルがない場合、このモジュールは悪意あるボットをブロックしません。

削除したプロファイルは復元できず、**API Abuse Prevention**モジュールはトラフィック分析に使用しません。

**Disable**および**Delete**のオプションはプロファイルのメニューにあります。

## 例外

[例外の作成](exceptions.md)によりAPI Abuse Preventionをきめ細かく調整できます。正当なボットにマークを付けたり、特定の対象URLやリクエスト種別についてボット保護を無効化できます。

## セッションメカニズムの改善

API Abuse Preventionは、ボットの挙動を分析する際に[API Sessions](../api-sessions/overview.md)のメカニズムを使用します。

API Abuse Preventionの機能をより精緻にするため、リクエストをセッションにまとめる際の未認証トラフィックの識別を向上させる目的で、[JA3 fingerprinting](../admin-en/enabling-ja3.md)を有効化することを推奨します。