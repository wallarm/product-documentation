# トリガーの使用方法

トリガーは、カスタム通知やイベントへの反応を設定するために使用されるツールです。トリガーを使用して、次のことができます。

- 日々のワークフローで使用するツールを通じて、重要なイベントに対するアラートを受信する（例：企業向けメッセンジャーやインシデント管理システム）。
- 一定数のリクエストまたは攻撃ベクトルが送信されたIPアドレスをブロックする。
- 一定のAPIエンドポイントに送信されたリクエストの数によって[行動の攻撃](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)を特定する。
- イベントリストを最適化する[グルーピング](../../about-wallarm/protecting-against-attacks.md#attack) 同じIPアドレスから来るヒットを一つの攻撃にまとめる

トリガーのすべてのコンポーネントを設定できます。

- **条件**： 通知されるべきシステムイベント。例：攻撃の一定量を得る、ブラックリストに載っているIPアドレス、アカウントに新しいユーザーが追加される。
- **フィルター**： 条件の詳細。例： 攻撃の種類。
- **反応**： 指定された条件とフィルターが満たされた場合に実行するアクション。例： [統合](../settings/integrations/integrations-intro.md) として設定されたSlackや他のシステムに通知を送る、IPアドレスをブロックする、ブルートフォース攻撃としてリクエストにマーク付け。

トリガーは、Wallarmコンソールの**トリガー**セクションで設定されます。このセクションは、**管理者** [ロール](../settings/users.md) を持つユーザーにのみ利用できます。

![!トリガーを設定するセクション](../../images/user-guides/triggers/triggers-section.png)

## トリガーの作成

1. **トリガーの作成**ボタンをクリックします。
2. 条件を[選択](#step-1-choosing-a-condition)します。
3. フィルターを[追加](#step-2-adding-filters)します。
4. 反応を[追加](#step-3-adding-reactions)します。
5. トリガーを[保存](#step-4-saving-the-trigger)します。

### ステップ1： 条件の選択

条件は、通知されるべきシステムイベントです。次の条件が通知のために利用可能です。

- [ブルートフォース](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
- [フォースドブラウジング](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
- [BOLA](../../admin-en/configuration-guides/protecting-against-bola.md)
- [弱いJWT](trigger-examples.md#detect-weak-jwts)
- [攻撃ベクトル（悪意のあるペイロード）](../../glossary-en.md#malicious-payload)の数（[カスタム正規表現](../rules/regex-rule.md)に基づく実験的ペイロードはカウントされません）
- [攻撃](../../glossary-en.md#attack)の数（[カスタム正規表現](../rules/regex-rule.md)に基づく実験的攻撃はカウントされません）
- [ヒット](../../glossary-en.md#hit)の数を除きます。

    * [カスタム正規表現](../rules/regex-rule.md)に基づいて検出された実験的ヒット。非実験的ヒットはカウントされます。
    * [サンプル](../events/analyze-attack.md#sampling-of-hits)に保存されてい...
## 事前設定されたトリガー（デフォルトトリガー）

新しい会社のアカウントには、以下の事前設定されたトリガー（デフォルトトリガー）が搭載されています：

* 同じIPから来るグループヒットを1つの攻撃にまとめる

    このトリガーは、同じIPアドレスから送信されたすべての[ヒット](../../glossary-en.md#hit)をイベントリストの1つの攻撃にグループ化します。これにより、イベントリストが最適化され、攻撃分析が高速化されます。

    このトリガーは、単一のIPアドレスが15分以内に50回以上のヒットを引き起こした場合に発動します。しきい値を超えた後に送信されたヒットのみが攻撃にグループ化されます。

    ヒットは、異なる攻撃タイプ、悪意のあるペイロード、およびURLを持つことがあります。これらの攻撃パラメータは、イベントリストで`[複数]`タグでマークされます。

    グループ化されたヒットのパラメータ値が異なるため、[誤検知としてマークする](../events/false-attack.md#mark-an-attack-as-a-false-positive)ボタンは、攻撃全体に対して使用できませんが、特定のヒットを誤検知としてマークすることはできます。[攻撃のアクティブ検証](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)も利用できません。

    Brute force、Forced browsing、Resource overlimit、Data bomb、またはVirtual patchの攻撃タイプを持つヒットは、このトリガーでは考慮されません。
* 1時間以内に3つ以上の異なる[悪意のあるペイロード](../../glossary-en.md#malicious-payload)を引き起こした場合、1時間だけIPをグレーリストに登録する

    [グレーリスト](../ip-lists/graylist.md)とは、ノードが次のように処理する疑わしいIPアドレスのリストです：グレーリスト化されたIPが悪意のあるリクエストを行うと、ノードはそれをブロックしながら正当なリクエストを許可します。グレーリストとは対照的に、[denylist](../ip-lists/denylist.md)は、アプリケーションに全くアクセスできないIPアドレスを指します。denylistに登録されたソースが生成する正当なトラフィックもノードはブロックします。IPグレーリスト化は、[誤検知](../../about-wallarm/protecting-against-attacks.md#false-positives)の削減を目的としたオプションのひとつです。

    このトリガーは、ノードのフィルタリングモードに関係なくリリースされるため、ノードのモードに関係なくIPアドレスをグレーリスト化します。

    ただし、ノードは**安全なブロック**モードでのみグレーリストを分析します。グレーリスト化されたIPからの悪意のあるリクエストをブロックするには、まずその機能を学んだ後、ノードの[モード](../../admin-en/configure-wallarm-mode.md#available-filtration-modes)を安全なブロックに切り替えます。
* 弱いJWTを検出する

    [JSON Web Token（JWT）](https://jwt.io/)は、APIなどのリソース間で安全にデータを交換するために使用される一般的な認証標準です。JWTの侵害は、攻撃者の一般的な目標であり、認証メカニズムを破ることで、完全にWebアプリケーションとAPIへのアクセスが可能になります。JWTが弱ければ弱いほど、侵害される可能性が高くなります。

    このトリガーを有効にすると、Wallarmは、受信リクエスト内の弱いJWTを自動的に検出し、対応する[脆弱性](../vulnerabilities/check-vuln.md)を記録します。

デフォルトでは、トリガーは会社アカウント内のすべてのトラフィックで動作しますが、任意のトリガー設定を変更できます。

## トリガーを無効にし、削除する

* 通知とイベントへの反応の送信を一時的に停止するには、トリガーを無効にできます。無効にされたトリガーは、**すべて**および**無効**のトリガーリストに表示されます。通知とイベントへの反応の送信を再度有効にするには、**有効にする**オプションを使用します。
* 通知とイベントへの反応の送信を完全に停止するには、トリガーを削除できます。トリガーの削除は元に戻すことができません。トリガーはトリガーリストから永久に削除されます。

トリガーを無効にしたり削除したりするには、トリガーメニューから適切なオプションを選択し、必要に応じてアクションを確認してください。

<!-- ## デモビデオ

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/ODHh-die9tY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->