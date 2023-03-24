[img-verification-statuses]:    ../../images/user-guides/events/attack-verification-statuses.png
[img-verify-attack]:            ../../images/user-guides/events/verify-attack.png
[img-verified-icon]:            ../../images/user-guides/events/verified.png#mini
[img-error-icon]:               ../../images/user-guides/events/error.png#mini
[img-forced-icon]:              ../../images/user-guides/events/forced.png#mini
[img-sheduled-icon]:            ../../images/user-guides/events/sheduled.png#mini
[img-cloud-icon]:           ../../images/user-guides/events/cloud.png#mini

[al-brute-force-attack]:      ../../attacks-vulns-list.md#bruteforce-attack
[al-forced-browsing]:         ../../attacks-vulns-list.md#forced-browsing

# アタックの検証

Wallarmは、アクティブ脆弱性検出のために攻撃を自動的に[再チェック](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)します。

*イベント*タブで、攻撃検証のステータスを確認し、攻撃の再チェックを強制できます。選択された攻撃は、テスト攻撃セット生成の基本になります。

![!様々な検証ステータスがあるアタック][img-verification-statuses]

## アタック検証ステータスの確認

1. *イベント*タブをクリックします。
2. "検証"列でステータスを確認してください。

## アタック検証ステータスの説明

* ![!検証済み][img-verified-icon] *検証済み*: 攻撃が検証されました。
* ![!エラー][img-error-icon] *エラー*: 検証をサポートしていない攻撃タイプの検証を試みます。
* ![!強制][img-forced-icon] *強制*: 検証キューで攻撃の優先度が上がりました。
* ![!予定][img-sheduled-icon] *予定*: 攻撃が検証キューに入りました。
* ![!サーバーに接続できません][img-cloud-icon] *サーバーに接続できません*: 現在サーバーにアクセスすることはできません。

## アタック検証の強制

1. 攻撃を選択します。
2. "検証"列のステータス記号をクリックします。
3. *強制検証*をクリックします。

Wallarmは、キュー内の攻撃検証の優先度を上げます。

![!アタック検証][img-verify-attack]

## 検証をサポートしていない攻撃タイプ

以下のタイプの攻撃は検証に対応していません。

* [ブルートフォース][al-brute-force-attack]
* [強制ブラウジング][al-forced-browsing]
* リクエスト処理制限のある攻撃
* 既に脆弱性が閉じられている攻撃
* 検証に十分なデータが含まれていない攻撃

次のケースでは、アタックの再チェックが失敗します。

* gRPCまたはProtobuffプロトコルを介して送信された攻撃
* バージョン1.x以外のHTTPプロトコルを介して送信された攻撃
* 次の方法と異なる方法で送信された攻撃: GET、POST、PUT、HEAD、PATCH、OPTIONS、DELETE、LOCK、UNLOCK、MOVE、TRACE
* オリジナルリクエストのアドレスに到達できなかった
* 攻撃サインが `HOST` ヘッダーにある
* 攻撃サインを含む[リクエスト要素](../rules/request-processing.md)が次のいずれかと異なる: `uri` 、`header`、 `query`、`post`、`path`、 `action_name`、 `action_ext`