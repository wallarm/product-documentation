[variability-in-endpoints-docs]:       ../../api-discovery/exploring.md#variability
[changes-in-api-docs]:       ../../api-discovery/track-changes.md
[bola-protection-for-endpoints-docs]:  ../../api-discovery/bola-protection.md

# API Discoveryで検出されたエンドポイントに対する自動BOLA保護 <a href="../../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

本記事は[API Discovery](../../api-discovery/overview.md)（APID）により検出されたエンドポイントに対する自動BOLA保護について説明します。

!!! info "その他のBOLA保護手段"
    あるいは、または併せて[トリガによるBOLA保護](protecting-against-bola-trigger.md)を設定できます。

--8<-- "../include/bola-intro.md"

## 保護ロジック

--8<-- "../include/waf/features/bola-mitigation/bola-auto-mitigation-logic.md"

## 設定

!!! info "API Discoveryが必要"
    自動BOLA保護は**[API Discovery](../../api-discovery/overview.md)**モジュールを使用している場合に利用できます。

自動保護を有効にするには、Wallarm Console → **BOLA protection** に移動し、スイッチを有効の状態に切り替えてください：

![BOLAトリガ](../../images/user-guides/bola-protection/trigger-enabled-state.png)

次に、BOLA自動検出テンプレートを編集することにより、Wallarmのデフォルト動作を以下のように微調整できます。

* 同一IPからのリクエストがBOLA攻撃と判断される閾値を変更します。
* 閾値を超えた際の反応を変更します：

    * **Denylist IP** - WallarmはBOLA攻撃のソースとなるIPを[denylist](../../user-guides/ip-lists/overview.md)に登録し、これらのIPからのすべての通信をブロックします。
    * **Graylist IP** - WallarmはBOLA攻撃のソースとなるIPを[graylist](../../user-guides/ip-lists/overview.md)に登録し、これらのIPからの悪意あるリクエストのみを、フィルタリングノードが safe blocking [mode](../../admin-en/configure-wallarm-mode.md) の場合にブロックします。

![BOLAトリガ](../../images/user-guides/bola-protection/trigger-template.png)

## 無効化

自動BOLA保護を無効にするには、**BOLA protection**セクションでスイッチを無効の状態に切り替えてください。

API Discoveryのサブスクリプションが期限切れになると、自動BOLA保護は自動的に無効化されます。