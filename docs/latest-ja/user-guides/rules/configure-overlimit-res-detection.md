[api-discovery-enable-link]:    ../../api-discovery/setup.md#enable

# リクエスト処理時間の制限

Wallarmノードは単一の受信リクエストの処理に割ける時間が制限されており、その制限を超えた場合、当該リクエストを[リソース超過（`overlimit_res`）](../../attacks-vulns-list.md#resource-overlimit)攻撃としてマークします。単一リクエストの処理に割り当てる時間上限および上限超過時のノードの挙動はカスタマイズできます。

リクエスト処理時間を制限することで、Wallarmノードを狙った保護バイパス攻撃を防止できます。場合によっては、`overlimit_res`とマークされたリクエストは、Wallarmノードの各モジュールに割り当てられたリソースが不十分で、その結果として処理に時間がかかっていることを示している可能性があります。

## リソース超過攻撃への対応

ノードバージョン5.1.0以降では、設定済みの処理時間上限を超過したすべてのリクエストが、`overlimit_res`キーワードの下で**Attacks**セクションに一覧表示されます。以下の情報は、これらのリクエストに対する既定のノード挙動が適切か、調整が必要かを判断する助けになります。

* このエンドポイントは大きなデータ（ファイルなど）を扱うため、より長い処理時間を必要としますか？

    * はいの場合は、[このエンドポイント専用に](#specific-endpoint-configuration)時間上限を増やしてください。これにより未処理となるリクエスト部分が減り、そこに潜む攻撃のリスクを低減できます。
    * いいえの場合、そのエンドポイントが攻撃を受けている可能性があります。[**API Discovery**](../../api-discovery/overview.md)、[**API Sessions**](../../api-sessions/overview.md)、および[**Attacks**](../../user-guides/events/check-attack.md)で当該エンドポイントの保護状況や関連アクティビティを調査してください。保護の調整方法は[こちら](../../user-guides/events/check-attack.md#responding-to-attacks)に記載しています。

* このエンドポイントでの`overlimit_res`の発生が、他の多数のエンドポイントでも同時に起きていますか？はいの場合は、リクエスト処理時間を短縮するためにWallarmノードの各モジュールへ[リソースを追加割り当て](../../admin-en/configuration-guides/allocate-resources-for-node.md)すること、または一般設定の正しさを確認することを検討してください。

* このエンドポイントはユーザー体験や満足度に直ちに影響しますか？

    * はいの場合は、既定の**not blocking**挙動を変更しないでください。正当なトラフィックは確実にブロックされず、問題は**Attacks**内で`overlimit_res`として引き続き把握できます。
    * いいえの場合は、[このエンドポイントに限って](#specific-endpoint-configuration)、応答を**Block**へ変更することを検討してください。

エンドポイント上に`overlimit_res`攻撃が存在すること自体は概ね通常のことですが、想定範囲内に収まっている必要があります。大量に発生している場合は、上記の分析および対処を実施する価値があります。

## 一般設定

Wallarm Console → **Settings** → **General** → **Limit request processing time**で、リクエスト処理時間の一般設定を確認できます。この設定は、[特定エンドポイントの設定](#specific-endpoint-configuration)で上書きされない限り、すべてのエンドポイントに適用されます。

既定値は次のとおりです:

* 単一の受信リクエスト処理に対して**1,000ミリ秒**。
* 上限超過時の応答は**Interrupt Wallarm processing and bypass**で、これはWallarmが次を行うことを意味します:

    * リクエストの処理を停止します。
    * 当該リクエストを`overlimit_res`攻撃としてマークし、**Attacks**に表示します。処理済み部分に他の[攻撃タイプ](../../attacks-vulns-list.md)が含まれている場合は、それらのタイプの攻撃も表示されます。
    * 元のリクエストをアプリケーションに到達させます（保護のバイパス）。<!-- Note that the application has the risk to be exploited by the attacks included in both processed and unprocessed request parts. The default general configuration and [adjusting for specific endpoints](#specific-endpoint-configuration) minimizes this risk.-->

![Limit request processing time - 一般設定](../../images/user-guides/rules/fine-tune-overlimit-detection-generic.png)

時間上限の調整や応答の変更によって一般設定を変更できます。

!!! warning "保護のバイパスまたはシステムメモリ枯渇のリスク"
    * 既定のノード挙動を変更するのは、本当に必要な[特定の箇所](#specific-endpoint-configuration)に厳密に限定することを推奨します。たとえば大容量ファイルのアップロードを行う箇所などで、保護バイパスや脆弱性悪用のリスクがない場合です。
    * 時間上限を高く設定すると、メモリ枯渇を引き起こす可能性があります。

応答を**Block request**に変更すると、Wallarmは次を行います:

* リクエストの処理を停止します。
* 当該リクエストを`overlimit_res`攻撃としてマークし、**Attacks**に表示します。処理済み部分に他の[攻撃タイプ](../../attacks-vulns-list.md)が含まれている場合は、それらのタイプの攻撃も表示されます。
* リクエストをブロックします。なお、正当なリクエストがブロックされるリスクがあります。既定の一般設定を維持し、[特定のエンドポイントに対してのみ](#specific-endpoint-configuration)ブロックを設定することで、このリスクを最小化できます。

!!! info "ブロッキングに必要なフィルタリングモード"
    ブロックが機能するのは、ノードが**blocking**フィルタリング[mode](../../admin-en/configure-wallarm-mode.md)にある場合、または[graylisted](../ip-lists/overview.md)なIPアドレスからのリクエストに対して**safe blocking**が有効な場合のみです。

## 特定エンドポイントの設定

既定の一般設定は平均的な用途に対して十分に検証されており、変更は推奨しません。しかし、正当なトラフィックをブロックせずに保護も両立させる、よりよいバランスを取ることは可能です。平均から外れる処理時間のエンドポイントについては、そのエンドポイント専用に時間上限を調整し、直ちにリスクがない箇所については、そのエンドポイント専用に応答をブロックへ変更すると実現できます。

この**Limit request processing time**[ルール](../../user-guides/rules/rules.md)を使用すると、特定のエンドポイント向けに設定を変えることで、[一般設定](#general-configuration)または親設定を上書きできます。できること:

* 単一リクエスト処理の上限時間をカスタム設定する
* システムの応答を変更する（各項目の説明は[上記](#general-configuration)を参照）

リクエスト処理時間のエンドポイント別設定を行うには:

--8<-- "../include/rule-creation-initial-step.md"
1. **Fine-tuning attack detection** → **Limit request processing time**を選択します。
1. **If request is**で、ルールを適用するスコープを[記述](rules.md#configuring)します。
1. パラメータを設定します。

## ルール例

たとえば、一般設定が**1,000ミリ秒**かつ応答が**Interrupt Wallarm processing and bypass**で、`https://example.com/upload`に対して`overlimit_res`攻撃が多数発生しているとします。調査の結果、このエンドポイントは大容量ファイルのアップロードに使用されており、処理時間超過により正当なリクエストまで`overlimit_res`攻撃としてマークされていることが分かりました。

不要な`overlimit_res`通知の件数を減らし、未処理のリクエスト部分に悪意あるペイロードが潜む可能性を下げるため、このエンドポイントに限って、リクエスト処理時間を延ばす必要があります。

そのために、スクリーンショットのとおり**Limit request processing time**ルールを設定します。

![「Register and display in the events」ルールの例](../../images/user-guides/rules/fine-tune-overlimit-detection-example.png)