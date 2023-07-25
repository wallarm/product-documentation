[variability-in-endpoints-docs]: ../about-wallarm/api-discovery.ja.md#variability-in-endpoints
[changes-in-api-docs]: api-discovery.ja.md#tracking-changes-in-api
[bola-protection-for-endpoints-docs]: ../about-wallarm/api-discovery.ja.md#automatic-bola-protection

# BOLA保護 <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm Console UI の **BOLA保護** セクションでは、**API Discovery** モジュールによって探索されたAPIエンドポイントを対象とした [BOLA（IDOR）攻撃](../attacks-vulns-list.ja.md#broken-object-level-authorization-bola) の軽減を設定することができます。

このセクションは、以下の条件で利用可能です。

* [API Discovery](../about-wallarm/api-discovery.ja.md) モジュールが有効
* ユーザー[ロール](settings/users.ja.md#user-roles) が **管理者** または **グローバル管理者** であること

    また、セクションは **アナリスト** と **グローバルアナリスト** の場合も読み取り専用で利用可能です。

!!! info "BOLA軽減のバリエーション"

    BOLA軽減は以下のバリエーションで利用可能です：

    * **API Discovery** モジュールで探索されたエンドポイントに対する自動軽減（この記事で説明されている UIを使用して設定）
    * Wallarmノードで保護されたすべてのエンドポイントに対する軽減 - このオプションは、対応するトリガを介して手動で設定されます。

    [BOLA（IDOR）保護の一般的な指示](../admin-en/configuration-guides/protecting-against-bola.ja.md)で詳細をご覧いただけます。

## 自動BOLA保護の設定

API Discoveryモジュールで探索されたエンドポイントをBOLAの脆弱性の分析対象とし、リスクのあるものを保護するためには、**スイッチを有効状態に切り替え** ます。

![!BOLAトリガ](../images/user-guides/bola-protection/trigger-enabled-state.png)

次に、以下のようにBOLA自動検出テンプレートを編集して、Wallarmのデフォルトの動作を微調整できます。

* 同じIPからのリクエストがBOLA攻撃としてマークされるしきい値を変更する。
* しきい値を超えた時の反応を変更する：

    * **Denylist IP** - WallarmはBOLA攻撃元の[denylist](ip-lists/denylist.ja.md)にIPを追加し、これらのIPからのすべてのトラフィックをブロックします。
    * **Graylist IP** - WallarmはBOLA攻撃元の[graylist](ip-lists/graylist.ja.md)にIPを追加し、これらのIPからの悪意あるリクエストのみをブロックし、フィルタリングノードが安全なブロック[モード](../admin-en/configure-wallarm-mode.ja.md)にある場合にのみブロックします。

![!BOLAトリガ](../images/user-guides/bola-protection/trigger-template.png)

## 自動BOLA保護ロジック

--8<-- "../include/waf/features/bola-mitigation/bola-auto-mitigation-logic.ja.md"

## 自動BOLA保護の無効化

自動BOLA保護を無効にするには、**BOLA保護** セクションでスイッチを無効状態に切り替えます。

API Discoveryのサブスクリプションが期限切れになると、自動BOLA保護は自動的に無効になります。