[img-verification-statuses]:    ../../images/user-guides/events/attack-verification-statuses.png
[img-verify-attack]:            ../../images/user-guides/events/verify-attack.png
[img-verified-icon]:            ../../images/user-guides/events/verified.png#mini
[img-error-icon]:               ../../images/user-guides/events/error.png#mini
[img-forced-icon]:              ../../images/user-guides/events/forced.png#mini
[img-sheduled-icon]:            ../../images/user-guides/events/sheduled.png#mini
[img-cloud-icon]:           ../../images/user-guides/events/cloud.png#mini

[al-brute-force-attack]:      ../../attacks-vulns-list.md#brute-force-attack
[al-forced-browsing]:         ../../attacks-vulns-list.md#forced-browsing

# 攻撃の検証

Wallarmは、積極的な脆弱性検出のために攻撃を自動的に[再確認](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) します。

*イベント* タブで攻撃の検証状況を確認し、攻撃の再確認を強制することができます。選択された攻撃はテスト攻撃セットの生成の基礎となります。

![さまざまな検証ステータスを持つ攻撃][img-verification-statuses]

## 攻撃の検証状況を確認する

1. *イベント* タブをクリックします。
2. "検証"列のステータスを確認します。

## 攻撃の検証のステータスの凡例

* ![確認済][img-verified-icon] *確認済*：攻撃が確認されました。
* ![エラー][img-error-icon] *エラー*：検証がサポートされていない攻撃タイプを検証しようとした試み。
* ![強制][img-forced-icon] *強制*：攻撃は検証キューの優先順位が上がっています。
* ![予定][img-sheduled-icon] *予定*：攻撃は検証のためのキューに組み込まれています。
* ![サーバーに接続できません][img-cloud-icon] *サーバーに接続できません*：現在、サーバーにアクセスすることはできません。

## 攻撃の検証を強制する

1. 攻撃を選択します。
2. "検証" 列の状態記号をクリックします。
3. *検証を強制する* をクリックします。

Wallarmは攻撃の検証の優先順位をキューで上げます。

![攻撃の検証][img-verify-attack]

## 検証をサポートしていない攻撃タイプ

以下のタイプの攻撃は、検証をサポートしていません:

* [ブルートフォース][al-brute-force-attack]
* [強制ブラウジング][al-forced-browsing]
* リクエスト処理の制限がある攻撃
* 既に脆弱性が閉じられている攻撃
* 検証するための十分なデータを含まない攻撃

以下の場合、攻撃の再確認は失敗します:

* gRPCまたはProtobuffプロトコルを介して送信される攻撃
* 1.xとは異なるバージョンのHTTPプロトコルを介して送信された攻撃
* 次のいずれかとは異なる方法で送信された攻撃: GET, POST, PUT, HEAD, PATCH, OPTIONS, DELETE, LOCK, UNLOCK, MOVE, TRACE
* 元のリクエストのアドレスに到達できなかった
* 攻撃のサインが `HOST`ヘッダーにあります
* 攻撃のサインを含む[リクエスト要素](../rules/request-processing.md)が次のいずれかと異なる: `uri` , `header`, `query`, `post`, `path`, `action_name`, `action_ext`