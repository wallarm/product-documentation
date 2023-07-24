[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]: ../settings/applications.md

# IPアドレスのグレイリスト

**グレイリスト**は、**セーフブロッキング**の[フィルタリングモード](../../admin-en/configure-wallarm-mode.md)でノードによって処理される疑わしいIPアドレスのリストです。グレイリストされたIPが悪意のあるリクエストを生成した場合、ノードはそれらをブロックし、正当なリクエストは許可されます。

グレイリストされたIPからの悪意のあるリクエストは、以下の攻撃の兆候を含むものです：

* [入力検証攻撃](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)
* [vpatchタイプの攻撃](../rules/vpatch-rule.md)
* [正規表現に基づいて検出される攻撃](../rules/regex-rule.md)

グレイリストとは対照的に、[denylist](../ip-lists/denylist.md)は、アプリケーションにまったく到達できないようにしなければならないIPアドレスを指します。ノードは、denylistedソースによって生成された正当なトラフィックもブロックします。IPのグレイリストは、[誤検出](../../about-wallarm/protecting-against-attacks.md#false-positives)を減らすことを目的としたいくつかのオプションのうちの一つです。

許可リストにもグレイリストされたIPアドレスがある場合、フィルタリングノードの動作が異なる可能性があります。[リストの優先順位についてさらに詳しく知りましょう](overview.md#algorithm-of-ip-lists-processing)。

Wallarm Console → **IPリスト** → **グレイリスト**で、グレイリストされたIPアドレスを次のように管理できます。

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.ja.md"

![!IPグレイリスト](../../images/user-guides/ip-lists/graylist.png)

!!! info "リストの古い名前"
    IPアドレスのグレイリストの古い名前は「IPアドレスのグレイリスト」です。

## IPグレイリストの使用例

* 連続した複数の攻撃が発生したIPアドレス

    攻撃には、1つのIPアドレスから発生し、異なるタイプの悪意のあるペイロードを含む複数のリクエストが含まれる場合があります。このIPアドレスから発生したほとんどの悪意のあるリクエストをブロックし、正当なリクエストを許可する方法の1つは、このIPをグレイリストに登録することです。ソースIPのグレイリストのしきい値と適切な反応を設定することで、自動的にソースIPをグレイリストに登録するように設定できます。（[トリガー](../triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)）。

    ソースIPのグレイリストは、[誤検出](../../about-wallarm/protecting-against-attacks.md#false-positives)の数を大幅に減らすことができます。
* 悪意のあるトラフィックを生成することが多いIPアドレス、国、地域、データセンター、ネットワーク（例えば、Tor）をグレイリストに登録します。Wallarmノードは、グレイリストに登録されたオブジェクトから生成された正当なリクエストを許可し、悪意のあるリクエストをブロックします。

## リストへのオブジェクトの追加

IPアドレスを**自動的に疑わしいトラフィックがある場合にグレイリスト登録するためにWallarmを使用させることもできますし**、オブジェクトを**手動で**グレイリスト登録することもできます。

!!! info "マルチテナントノードにIPアドレスをリストに追加する方法"
    [マルチテナントノード](../../installation/multi-tenant/overview.md)をインストールした場合は、リストにIPアドレスが追加される[テナントのアカウント](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure)に最初に切り替えてください。

    自動的なIPのグレイリスト登録のトリガーも、テナントレベルで設定する必要があります。

### 自動グレイリスト登録（推奨）

[トリガー](../../user-guides/triggers/triggers.md)機能は、以下の条件によってIPの自動グレイリスト登録を可能にします：

* 次のタイプの悪意のあるリクエスト： [`Brute force`, `Forced browsing`](../../admin-en/configuration-guides/protecting-against-bruteforce.md), [`BOLA`](../../admin-en/configuration-guides/protecting-against-bola.md)。
* IPによって生成される`悪意のあるペイロードの数`。
* 新しい企業アカウントは、1時間以内に3つ以上の異なる悪意のあるペイロードを生成した場合にIPをグレイリストに登録する[設定済みの（デフォルト）トリガー](../../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers)が付属しています。

`IPアドレスのグレイリスト登録`という反応を持つトリガーは、リストされたイベントに対して指定された期間に自動的にIPをグレイリストに登録します。トリガーは、Wallarm Console → **トリガー**で設定できます。

### 手動グレイリスト登録

IPアドレス、サブネット、或いはIPアドレスのグループを手動でリストに追加するには:

1. Wallarm Console → **IPリスト** → **グレイリスト**を開き、**オブジェクトを追加**をクリックします。
2. 次の方法のいずれかでIPアドレスまたはIPアドレスのグループを指定します:

    * 1つの**IPアドレス**または**サブネット**を入力します。

        !!! info "サポートされているサブネットマスク" 
            IPv6アドレスの場合、サポートされる最大サブネットマスクは`/32`で、IPv4アドレスの場合は`/12`です。
    
    * すべてのIPアドレスがこの国または地域に登録されている**国**や**地域**（ジオロケーション）を選択します。
    * このタイプに属するすべてのIPアドレスを追加するために **source type** を選択します 例えば：
        * **Tor** TorネットワークのIPアドレス
        * **Proxy** 公開されているまたはWebプロキシサーバーのIPアドレス
        * **Search Engine Spiders** 検索エンジンのスパイダーのIPアドレス
        * **VPN** 仮想プライベートネットワークのIPアドレス
        * **AWS** Amazon AWSに登録されているIPアドレス
3. 指定されたIPアドレスに対してアクセスを許可または制限するアプリケーションを選択します。
4.  IPアドレスまたはIPアドレスのグループをリストに追加する期間を選択します。最小値は5分、最大値は永久です。
5.  IPアドレスまたはIPアドレスのグループをリストに追加する理由を指定します。

![!リストにIPを追加(アプリ)](../../images/user-guides/ip-lists/add-ip-to-list-app.png)

### 自動的なボットのIPのグレイリスト登録

--8<-- "../include/waf/features/ip-lists/autopopulation-by-antibot.ja.md"

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-allow-apps.ja.md"
