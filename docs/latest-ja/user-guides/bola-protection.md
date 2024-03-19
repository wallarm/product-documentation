[variability-in-endpoints-docs]:       ../api-discovery/exploring.md
[changes-in-api-docs]:       ../api-discovery/track-changes.md
[bola-protection-for-endpoints-docs]:  ../api-discovery/bola-protection.md

# BOLA保護 <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

WallarmコンソールUIの **BOLA保護** セクションでは、**API Discovery** モジュールが探索したAPIエンドポイントを対象とした [BOLA (IDOR) 攻撃](../attacks-vulns-list.md#broken-object-level-authorization-bola) の軽減を設定することができます。

次の条件の下でこのセクションは利用できます：

* [API Discovery](../api-discovery/overview.md) モジュールが有効化されている
* ユーザーの[役割](settings/users.md#user-roles)が**管理者**または**グローバル管理者**である

    また、このセクションは、**アナリスト**と**グローバルアナリスト**に対して、読み取り専用モードでも利用可能です。
    
!!! info "BOLA軽減のバリエーション"

    BOLA軽減は次のバリエーションで利用可能です:

    * **API Discovery** モジュールが探索したエンドポイントの自動軽減（UIの設定はこの記事でカバーされています）
    * Wallarmノードによって保護された任意のエンドポイントの軽減 - このオプションは対応するトリガーを介して手動で設定されます

    [一般的なBOLA (IDOR)保護の手順](../admin-en/configuration-guides/protecting-against-bola.md)で詳細を確認してください。

## 自動BOLA保護の設定

API Discoveryモジュールが探索したエンドポイントをWallarmがBOLAの脆弱性について分析し、リスクがあるものを保護するためには、**スイッチを有効な状態にする** ことです。

![BOLAトリガー](../images/user-guides/bola-protection/trigger-enabled-state.png)

その後、BOLAの自動検出テンプレートを編集することにより、デフォルトのWallarmの動作を微調整することが出来ます：

* 同じIPからのリクエストがBOLA攻撃としてマークされる閾値を変更します。
* 閾値を超えた時の反応を変更します：

    * **Denylist IP** - WallarmはBOLA攻撃の発生源となるIPを[denylist](ip-lists/denylist.md)に登録し、これらのIPから発生する全てのトラフィックをブロックします。
    * **Graylist IP** - WallarmはBOLA攻撃の発生源となるIPを[graylist](ip-lists/graylist.md)に登録し、フィルタリングノードが安全ブロック[モード](../admin-en/configure-wallarm-mode.md)にある場合のみ、これらのIPからの悪意のあるリクエストをブロックします。

![BOLAトリガー](../images/user-guides/bola-protection/trigger-template.png)

## 自動BOLA保護ロジック

--8<-- "../include-ja/waf/features/bola-mitigation/bola-auto-mitigation-logic.md"

## 自動BOLA保護の無効化

自動BOLA保護を無効にするには、**BOLA保護**セクションでスイッチを無効な状態にします。

API Discoveryのサブスクリプションが有効期限が切れると、自動BOLA保護は自動的に無効化されます。