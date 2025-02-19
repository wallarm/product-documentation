[api-discovery-enable-link]:    ../../api-discovery/setup.md#enable

# リクエスト処理時間の制限

Wallarmノードは単一の着信リクエスト処理に費やす時間が限られており、時間制限を超えると、そのリクエストを [resource overlimit (`overlimit_res`)](../../attacks-vulns-list.md#resource-overlimit) 攻撃としてマークします。単一のリクエスト処理に割り当てられる時間制限および制限超過時のノード動作をカスタマイズすることができます。

リクエスト処理時間を制限することにより、Wallarmノードを狙ったバイパス攻撃を防止できます。一部の場合、`overlimit_res` としてマークされたリクエストは、Wallarmノードモジュールに割り当てられたリソースが不足しており、リクエスト処理が長引いていることを示している可能性があります。

## resource overlimit攻撃への対応

ノードバージョン5.1.0以降、設定された処理時間制限を超えたすべてのリクエストは、`overlimit_res` キーワードの下で **Attacks** セクションに一覧表示されます。以下の情報により、これらのリクエストに対するデフォルトのノード動作が適切であるか、または調整が必要か判断するのに役立ちます:

* このエンドポイントは大容量データ（ファイル等）を扱っており、より多くの時間が必要ですか？

    * **yes**の場合、[このエンドポイント専用に](#specific-endpoint-configuration)時間制限を増加してください。これによりリクエストの未処理部分が減少し、そこに潜む攻撃のリスクを低減することができます。
    * **no**の場合、そのエンドポイントが攻撃を受けている可能性があるため、[**API Discovery**](../../api-discovery/overview.md)、[**API Sessions**](../../api-sessions/overview.md)、[**Attacks**](../../user-guides/events/check-attack.md)で保護状態や関連する活動を調査してください。保護方法を[こちら](../../user-guides/events/check-attack.md#responding-to-attacks)で記載されている通りに調整してください。

* このエンドポイントでは、他の多数のエンドポイントと共に`overlimit_res`問題が発生していますか？もし**yes**の場合、Wallarmノードモジュールに[より多くのリソースを割り当てる](../../admin-en/configuration-guides/allocate-resources-for-node.md)ことを検討してください。これによりリクエスト処理時間が短縮されるか、または一般設定の正確性を確認できます。

* このエンドポイントはユーザー体験及び満足度に直接影響しますか？

    * **yes**の場合、デフォルトの**not blocking**動作は変更しないでください。正当なトラフィックは確実にブロックされず、**Attacks**で`overlimit_res`として問題情報を引き続き受け取ることができます。
    * **no**の場合、[このエンドポイント専用に](#specific-endpoint-configuration)応答を**Block**に変更することを検討してください。

エンドポイントに`overlimit_res`攻撃が存在することは概ね通常ですが、予想される範囲内に収まるべきです。大量の場合は、上記で説明されている分析および対応を実施する価値があることを示唆しています。

## 一般設定

Wallarm Console → **Settings** → **General** → **Limit request processing time**にて、リクエスト処理時間制限の一般設定を確認できます。この設定は[specific endpoint configuration](#specific-endpoint-configuration)によって上書きされない限り、すべてのエンドポイントに適用されます。

デフォルトでは以下の通りです:

* 単一の着信リクエスト処理に対して**1,000 milliseconds**です。
* 制限超過時の応答は**Interrupt Wallarm processing and bypass**です。これはWallarmが以下を行うことを意味します:
    * リクエスト処理を停止します。
    * リクエストを`overlimit_res`攻撃としてマークし、**Attacks**に表示します。処理済みのリクエスト部分に他の[attack types](../../attacks-vulns-list.md)が含まれている場合、対応するタイプの攻撃も表示されます。
    * 元のリクエストがアプリケーションに到達することを許可します（protection bypass）。
<!-- この場合、処理済み部分および未処理部分の両方に含まれる攻撃によりアプリケーションが悪用されるリスクがあります。デフォルトの一般設定および[specific endpoint configuration](#specific-endpoint-configuration)の調整によりこのリスクは最小限に抑えられます。-->

![リクエスト処理時間の制限 - 一般設定](../../images/user-guides/rules/fine-tune-overlimit-detection-generic.png)

時間制限の調整と応答の変更により、一般設定を変更することができます.

!!! warning "protection bypassリスクまたはシステムメモリ不足のリスク"
    * 本当に必要な場合、例えば大容量ファイルのアップロードが行われ、protection bypassや脆弱性の悪用のリスクがない場所など、厳選された[特定の場所](#specific-endpoint-configuration)のみでデフォルトのノード動作を変更することを推奨します.
    * 高い時間制限はメモリ枯渇を引き起こす可能性があります.

応答を**Block request**に変更することは、Wallarmが以下を行うことを意味します:

* リクエスト処理を停止します.
* リクエストを`overlimit_res`攻撃としてマークし、**Attacks**に表示します。処理済みのリクエスト部分に他の[attack types](../../attacks-vulns-list.md)が含まれている場合、対応する攻撃も表示されます.
* リクエストをブロックします。正当なリクエストがブロックされるリスクがあることに注意してください。デフォルトの一般設定を維持し、[このエンドポイント専用に](#specific-endpoint-configuration)ブロック設定を行うことで、このリスクは最小限に抑えられます.

!!! info "ブロックにはフィルトレーションモードが必要"
    ノードが[**blocking**](../../admin-en/configure-wallarm-mode.md)フィルトレーション[mode](../../admin-en/configure-wallarm-mode.md)にあるか、または[graylisted](../ip-lists/overview.md)IPアドレスからのリクエストに対して**safe blocking**の場合にのみ、ブロックが機能することに注意してください.

## 特定のエンドポイント設定

[default general configuration](#general-configuration)は十分にテストされた標準的な手法であり、変更することは推奨されません。しかし、保護と正当なトラフィックの遮断回避の両立をより良く実現するために、更にバランスを整えることが可能です。これを実現するには、処理時間が平均値を超えるエンドポイント向けに**個別に**時間制限を調整し、すぐにリスクが発生しない場合に限り応答を**blocking**に**個別に**変更してください.

**Limit request processing time** [rule](../../user-guides/rules/rules.md)を使用すると、特定のエンドポイント向けに一般設定や親設定を上書きすることができます。これにより、以下のことが可能です:

* 単一のリクエスト処理に対してカスタムな制限を設定できます.
* システム応答を変更できます（各記述は[上記](#general-configuration)にあります）.

リクエスト処理時間制限の特定のエンドポイント設定を行うには:

--8<-- "../include/rule-creation-initial-step.md"
1. **Fine-tuning attack detection** → **Limit request processing time**を選択します.
1. **If request is**にて、ルールを適用する範囲を[describe](rules.md#configuring)してください.
1. パラメータを設定します.

## ルールの例

例として、デフォルトの一般設定が**1,000 milliseconds**で、応答が**Interrupt Wallarm processing and bypass**に設定されており、`https://example.com/upload`に対して多くの`overlimit_res`攻撃が発生しているとします。調査の結果、このエンドポイントが大容量ファイルのアップロードに使用されており、処理時間超過により正当なリクエストが`overlimit_res`攻撃としてマークされていることが判明しました.

不要な`overlimit_res`通知の数を減らし、リクエストの未処理部分に潜む悪意のあるペイロードの可能性を低減するため、このエンドポイント専用にリクエスト処理時間を延長する必要があります.

そのため、以下のスクリーンショットに示されているように、**Limit request processing time** ルールを設定してください.

![「Register and display in the events」ルールの例](../../images/user-guides/rules/fine-tune-overlimit-detection-example.png)