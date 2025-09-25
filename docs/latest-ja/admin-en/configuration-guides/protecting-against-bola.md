[variability-in-endpoints-docs]:       ../../api-discovery/exploring.md#variability
[changes-in-api-docs]:       ../../api-discovery/track-changes.md
[bola-protection-for-endpoints-docs]:  ../../api-discovery/bola-protection.md

# API Discoveryで検出されたエンドポイントの自動BOLA保護 <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

この記事では、[API Discovery](../../api-discovery/overview.md)（APID）で検出されたエンドポイント向けの自動BOLA保護について説明します。

!!! info "その他のBOLA保護手段"
    代替として、または併用して、[トリガーによるBOLA保護](protecting-against-bola-trigger.md)を構成できます。

--8<-- "../include/bola-intro.md"

## 保護ロジック

--8<-- "../include/waf/features/bola-mitigation/bola-auto-mitigation-logic.md"

## 設定

!!! info "API Discoveryが必要"
    自動BOLA保護は、**[API Discovery](../../api-discovery/overview.md)**モジュールを使用している場合に利用できます。

自動保護を有効化するには、Wallarm Console → **BOLA protection**に移動し、スイッチを有効に切り替えます。

![BOLAトリガー](../../images/user-guides/bola-protection/trigger-enabled-state.png)

その後、次のようにBOLA自動検出テンプレートを編集して、Wallarmのデフォルト動作を微調整できます。

* 同一IPからのリクエストがBOLA攻撃として判定されるしきい値を変更します。
* しきい値超過時のリアクションを変更します。

    * **Denylist IP** - WallarmはBOLA攻撃元のIPを[denylist](../../user-guides/ip-lists/overview.md)に追加し、これらのIPが生成する全トラフィックをブロックします。
    * **Graylist IP** - WallarmはBOLA攻撃元のIPを[graylist](../../user-guides/ip-lists/overview.md)に追加し、フィルタリングノードがsafe blocking[モード](../../admin-en/configure-wallarm-mode.md)の場合に限り、これらのIPからの悪意のあるリクエストのみをブロックします。

![BOLAトリガー](../../images/user-guides/bola-protection/trigger-template.png)

## 無効化

自動BOLA保護を無効化するには、**BOLA protection**セクションでスイッチを無効に切り替えます。

API Discoveryのサブスクリプションが期限切れになると、自動BOLA保護は自動的に無効になります。