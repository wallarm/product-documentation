[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]:        ../settings/applications.md

# IP アドレスのグレイリスト

**グレイリスト**は、ノードが**安全ブロック**[フィルタリングモード](../../admin-en/configure-wallarm-mode.md)でのみ処理する怪しい IP アドレスのリストです。具体的には、グレイリストの IP から有害なリクエストが発生した場合、ノードはそれらをブロックし、合法的なリクエストは許可されます。

グレイリストの IP から発生した有害なリクエストとは、以下の攻撃の兆候を含むものです:

* [入力検証攻撃](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)
* [vpatch タイプの攻撃](../rules/vpatch-rule.md)
* [正規表現に基づいて検出された攻撃](../rules/regex-rule.md)

グレイリストとは対照的に、[denylist](../ip-lists/denylist.md)はあなたのアプリケーションに全く到達することを許されていない IP アドレスを指します - ノードは denylisted ソースが生成する合法的なトラフィックもブロックします。IP グレイリスティングは、[偽陽性](../../about-wallarm/protecting-against-attacks.md#false-positives)の削減を目指した選択肢の一つです。

フィルタリングノードの挙動は、グレイリスト化された IP アドレスが allowlisted でも異なる可能性があります。[リスト優先度について詳しく](overview.md#algorithm-of-ip-lists-processing)。

Wallarm のコンソール → **IP リスト** → **グレイリスト**で、グレイリスト化された IP アドレスを以下のように管理できます：

--8<-- "../include-ja/waf/features/ip-lists/common-actions-with-lists-overview.md"

![!IP グレイリスト](../../images/user-guides/ip-lists/graylist.png)

!!! info "リストの旧名称"
    IP アドレスのグレイリストの旧名称は "IP アドレスのグレイリスト"です。

## IPグレイリストの使用例

* 連続した攻撃が発生した IP アドレスをグレイリスト化します。

    攻撃は、一つの IP アドレスから発生し、異なるタイプの有害なペイロードを含む複数のリクエストを含むことがあります。この IP アドレスから発生した大部分の有害なリクエストをブロックし、合法的なリクエストを許可する方法の一つは、この IP をグレイリスト化することです。ソース IP のグレイリスト化の閾値と適切な反応を設定することで、ソース IP のグレイリスト化を自動的に設定することができます。[トリガー](../triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)。

    ソース IP のグレイリスティングは、[偽陽性](../../about-wallarm/protecting-against-attacks.md#false-positives)の数を大幅に減らすことができます。
* 通常有害なトラフィックを生成する IP アドレス、国、地域、データセンター、ネットワーク（例えば、Tor）をグレイリスト化します。 Wallarm のノードは、グレイリスト化されたオブジェクトが生成する合法的なリクエストを許可し、有害なリクエストをブロックします。

## リストへのオブジェクトの追加

Wallarmは**疑わしいトラフィックを生成する IP アドレスを自動的にグレイリスト化する**とともに、オブジェクトを**手動**でグレイリスト化することもできます。

!!! info "マルチテナントノード上のリストへの IP アドレスの追加"
    [マルチテナントノード](../../installation/multi-tenant/overview.md)をインストールしている場合、先に IP アドレスをリストに追加する[テナントのアカウント](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure)に切り替えてください。

    自動 IP グレイリストのトリガーもテナントレベルで設定する必要があります。

### 自動的なグレイリストの生成 (推奨)

[トリガー](../../user-guides/triggers/triggers.md)機能により、以下の条件で IP の自動的なグレイリスト化が可能になります:

* 次のタイプの有害なリクエスト：[`Brute force`, `Forced browsing`](../../admin-en/configuration-guides/protecting-against-bruteforce.md), [`BOLA`](../../admin-en/configuration-guides/protecting-against-bola.md)。
* IP によって生成された`有害なペイロードの数`。
* 新しい会社アカウントは、1時間以内に3つ以上の異なる有害なペイロードを発生させる IP をグレイリスト化する[既定のトリガー](../../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers)が付属しています。

リストされたイベントへの`グレイリスト IP アドレス`反応を持つトリガーは、指定した時間範囲で自動的に IP をグレイリスト化します。Wallarmのコンソール → **トリガー**でトリガーを設定できます。

### 手動によるグレイリストの作成

IP アドレス、サブネット、または IP アドレスのグループをリストに手動で追加するには:

1. Wallarm コンソール → **IPリスト** → **グレイリスト** を開き、**オブジェクトの追加**をクリックします。
2. 次の方法のいずれかで IP アドレスまたは IP アドレスのグループを指定します：

   * 単一の **IP アドレス** または **サブネット** を入力します

        !!! info "サポートされているサブネットマスク"
            IPv6 アドレスの最大サブネットマスクは `/32` 、IPv4 アドレスの最大サブネットマスクは `/12` です。

    * **国** または **地方** (ジオロケーション) を選択して、その国や地方で登録されているすべての IP アドレスを追加します。
    * 「このタイプに属するすべての IP アドレスを追加する」という **ソースタイプ** を選択します。例：
      * **Tor** は TOR ネットワークの IP アドレス
      * **Proxy** は公開プロキシまたは Web プロキシサーバーの IP アドレス
      * **検索エンジンスパイダー** は検索エンジンスパイダーの IP アドレス
      * **VPN** はバーチャルプライベートネットワークの IP アドレス
      * **AWS** は Amazon AWS で登録された IP アドレスです
3. 指定した IP アドレスに対してアクセスを許可または制限するアプリケーションを選択します。
4. IP アドレスまたは IP アドレスのグループをリストに追加する期間を選択します。最小値は5分、最大値は永遠です。
5. IP アドレスまたは IP アドレスのグループをリストに追加する理由を指定します。

![!リストへの IP の追加 (アプリとともに)](../../images/user-guides/ip-lists/add-ip-to-list-app.png)

### 自動的なボットの IP グレイリスティング

--8<-- "../include-ja/waf/features/ip-lists/autopopulation-by-antibot.md"

--8<-- "../include-ja/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"