# トリガーの使用方法

トリガーは、カスタム通知やイベントへの反応を設定するために使用されるツールです。トリガーを使用して、次のことができます。

- 日々のワークフローで使用するツールを通じて、重要なイベントに対するアラートを受信する（例：企業向けメッセンジャーやインシデント管理システム）。
- 一定数のリクエストまたは攻撃ベクトルが送信されたIPアドレスをブロックする。
- 一定のAPIエンドポイントに送信されたリクエストの数によって[行動の攻撃](../../about-wallarm/protecting-against-attacks.ja.md#behavioral-attacks)を特定する。
- イベントリストを最適化する[グルーピング](../../about-wallarm/protecting-against-attacks.ja.md#attack) 同じIPアドレスから来るヒットを一つの攻撃にまとめる

トリガーのすべてのコンポーネントを設定できます。

- **条件**： 通知されるべきシステムイベント。例：攻撃の一定量を得る、ブラックリストに載っているIPアドレス、アカウントに新しいユーザーが追加される。
- **フィルター**： 条件の詳細。例： 攻撃の種類。
- **反応**： 指定された条件とフィルターが満たされた場合に実行するアクション。例： [統合](../settings/integrations/integrations-intro.ja.md) として設定されたSlackや他のシステムに通知を送る、IPアドレスをブロックする、ブルートフォース攻撃としてリクエストにマーク付け。

トリガーは、Wallarmコンソールの**トリガー**セクションで設定されます。このセクションは、**管理者** [ロール](../settings/users.ja.md) を持つユーザーにのみ利用できます。

![!トリガーを設定するセクション](../../images/user-guides/triggers/triggers-section.png)

## トリガーの作成

1. **トリガーの作成**ボタンをクリックします。
2. 条件を[選択](#step-1-choosing-a-condition)します。
3. フィルターを[追加](#step-2-adding-filters)します。
4. 反応を[追加](#step-3-adding-reactions)します。
5. トリガーを[保存](#step-4-saving-the-trigger)します。

### ステップ1： 条件の選択

条件は、通知されるべきシステムイベントです。次の条件が通知のために利用可能です。

- [ブルートフォース](../../admin-en/configuration-guides/protecting-against-bruteforce.ja.md)
- [フォースドブラウジング](../../admin-en/configuration-guides/protecting-against-bruteforce.ja.md)
- [BOLA](../../admin-en/configuration-guides/protecting-against-bola.ja.md)
- [弱いJWT](trigger-examples.ja.md#detect-weak-jwts)
- [攻撃ベクトル（悪意のあるペイロード）](../../glossary-en.ja.md#malicious-payload)の数（[カスタム正規表現](../rules/regex-rule.ja.md)に基づく実験的ペイロードはカウントされません）
- [攻撃](../../glossary-en.ja.md#attack)の数（[カスタム正規表現](../rules/regex-rule.ja.md)に基づく実験的攻撃はカウントされません）
- [ヒット](../../glossary-en.ja.md#hit)の数を除きます。

    * [カスタム正規表現](../rules/regex-rule.ja.md)に基づいて検出された実験的ヒット。非実験的ヒットはカウントされます。
    * [サンプル](../events/analyze-attack.ja.md#sampling-of-hits)に保存されてい...
## 事前設定されたトリガー（デフォルトトリガー）

新規会社アカウントには、以下の事前設定されたトリガー（デフォルトトリガー）が備わっています。

* 同一IPからのグループヒットを一つの攻撃としてまとめる

    このトリガーは、同一IPアドレスから送信されたすべての[ヒット](../../glossary-en.ja.md#hit)をイベントリスト内の一つの攻撃にまとめます。これにより、イベントリストが最適化され、攻撃の分析が速くなります。

    このトリガーは、単一のIPアドレスから15分以内に50以上のヒットが発生したときにリリースされます。しきい値を超えてから送信されたヒットだけが攻撃にまとめられます。

    ヒットは攻撃の種類、悪意のあるペイロード、URLが異なることができます。これらの攻撃パラメータは、イベントリスト内で`[multiple]`タグでマークされます。

    まとめられたヒットのパラメータ値が異なるため、[偽陽性としてマークする](../events/false-attack.ja.md#mark-an-attack-as-a-false-positive)ボタンは全体の攻撃に対して使用できませんが、特定のヒットを偽陽性としてマークすることは可能となります。[攻撃の有効検証](../../about-wallarm/detecting-vulnerabilities.ja.md#active-threat-verification)も利用できません。

    ブルートフォース、強制ブラウジング、リソースオーバーリミット、データボム、バーチャルパッチの攻撃タイプを持つヒットは、このトリガーでは考慮されません。
* 1時間以内に3以上の異なる[意図的なペイロード](../../glossary-en.ja.md#malicious-payload)を発生させたIPを1時間グレーリストに登録する

    [グレーリスト](../ip-lists/graylist.ja.md)は、ノードによって次のように処理される疑わしいIPアドレスのリストです：グレーリストに登録されたIPが悪意のあるリクエストを発生させると、ノードはそれをブロックしますが合法的なリクエストは許可します。グレーリストとは対照的に、[denylist](../ip-lists/denylist.ja.md)はあなたのアプリケーションへのアクセスを許可されていないIPアドレスを指します - ノードはdenylistに登録されたソースからの合法的なトラフィックもブロックします。IPのグレーリストは、[偽陽性の](../../about-wallarm/protecting-against-attacks.ja.md#false-positives)減少を目指した一つのオプションです。

    このトリガーは、どのノードフィルタモードでもリリースされるため、ノードモードに関係なくIPをグレーリストに登録します。

    ただし、ノードは**セーフブロッキング**モードでのみグレーリストを分析します。グレーリストに登録されたIPから発生する悪意のあるリクエストをブロックするためには、ノードの[モード](../../admin-en/configure-wallarm-mode.ja.md#available-filtration-modes)を、その機能をまず理解した上でセーフブロッキングに切り替えます。

    ブルートフォース、強制ブラウジング、リソースオーバーリミット、データボム、バーチャルパッチの攻撃タイプを持つヒットは、このトリガーでは考慮されません。
* 弱いJWTを検出する

    [JSON Web Token (JWT)](https://jwt.io/)は、APIなどのリソース間で安全にデータを交換するために使用される一般的な認証標準です。JWTの侵害は、攻撃者がウェブアプリケーションやAPIへのフルアクセスを得るための一般的な目標です。JWTが弱いほど、侵害される可能性が高くなります。

    このトリガーにより、Walarmは入力リクエスト内の弱いJWTを自動的に検出し、対応する[脆弱性](../vulnerabilities.ja.md)を記録できます。

トリガーはデフォルトで会社アカウント内の全てのトラフィックに対して動作しますが、任意のトリガー設定を変更することができます。

## トリガーの無効化と削除

* イベントへの通知と反応の送信を一時的に停止するために、トリガーを無効化することができます。無効化されたトリガーは、**All**と**Disabled**のトリガーリストに表示されます。イベントへの通知と反応の送信を再開するためには、**Enable**オプションが使用されます。
* イベントへの通知と反応の送信を永続的に停止するために、トリガーを削除することができます。トリガーの削除は元に戻すことができません。トリガーはトリガーリストから永久に削除されます。

トリガーを無効化または削除するには、トリガーメニューから適切なオプションを選択し、必要に応じてアクションを確認してください。

<!-- ## デモビデオ

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/ODHh-die9tY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>
</div> -->