# IPアドレス拒否リスト

**拒否リスト**は、合法的なリクエストを起動してもあなたのアプリケーションにアクセスを許可しないIPアドレスのリストです。任意の[モード](../../admin-en/configure-wallarm-mode.md)でのフィルタリングノードは、拒否リストに記載されているIPアドレスからのすべてのリクエストをブロックします（IPが[許可リスト](allowlist.md)に重複していない限り）。

Wallarmのコンソール → **IPリスト** → **拒否リスト**にて、ブロックされたIPアドレスを以下のように管理できます：

--8<-- "../include-ja/waf/features/ip-lists/common-actions-with-lists-overview.md"

![!IP 拒否リスト](../../images/user-guides/ip-lists/denylist-apps.png)

!!! info "リストの古い名前"
    IPアドレスの拒否リストの古い名前は「IPアドレスブラックリスト」です。

## IP拒否リスト利用例

* 連続した攻撃が発生したIPアドレスをブロックします。

    攻撃は、一つのIPアドレスからの複数のリクエストを含み、それらは様々なタイプの悪意のあるペイロードを含むことがあります。このような攻撃をブロックする一つの方法は、リクエストの発信元をブロックすることです。あなたは、発信元IPのブロックの閾値と適切な反応を設定することにより、自動的な発信元IPのブロックを設定できます。[トリガー](../triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)を参照してください。
* 行動ベースの攻撃をブロックします。

    Wallarmのフィルタリングノードは、悪意のあるペイロードが検出されれば、最も有害なトラフィックのリクエストをリクエストごとにブロックできます。しかし、個々のリクエストが合法的な場合（例えば、ユーザー名/パスワードのペアでのログイン試行など）では、発信元によるブロックが必要な場合があります。

    デフォルトでは、行動攻撃の源の自動ブロックは無効になっています。[ブルートフォース保護の設定について](../../admin-en/configuration-guides/protecting-against-bruteforce.md#configuration-steps)

## リストへのオブジェクトの追加

あなたは**疑わしいトラフィックを出すIPアドレスを自動的に拒否リストに登録する**ようにWallarmを設定することも、**手動で**オブジェクトを拒否リストに登録することもできます。

!!! info "マルチテナントノード上でのIPアドレスのリストへの追加"
    [マルチテナントノード](../../installation/multi-tenant/overview.md)をインストールした場合は、先にあなたがIPアドレスをリストに追加する[テナントのアカウント](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure)に切り替えてください。

### 自動拒否リストポピュレーション（おすすめ）

[トリガー](../../user-guides/triggers/triggers.md)機能を利用して、以下の条件でIPの自動拒否リスト登録が可能です：

* 以下のタイプの悪意のあるリクエスト：[`Brute force`, `Forced browsing`](../../admin-en/configuration-guides/protecting-against-bruteforce.md), [`BOLA`](../../admin-en/configuration-guides/protecting-against-bola.md).
* IPによって生成された`Number of malicious payloads`。

リストされたイベントに対して`Denylist IP address`反応をもつトリガーは、指定した時間枠で自動的にIPを拒否リストに登録します。Wallarmのコンソール → **トリガー**でトリガーを設定できます。

### 手動での拒否リストポピュレーション

IPアドレス、サブネット、又はIPアドレスのグループをリストに追加するには：

1. Wallarmのコンソール → **IPリスト** → **拒否リスト**を開き、**Add object** ボタンをクリックします。
2. ドロップダウンリストから、新しいオブジェクトを追加するリストを選択します。
3. 下記の方法のいずれかでIPアドレス又はIPアドレスのグループを指定します：

    * **IPアドレス** 又は **サブネット**を入力します

        !!! info "サポートされているサブネットマスク"
            IPv6アドレスの最大サポートサブネットマスクは`/32`、IPv4アドレスの場合は`/12`です。

    * **国** 又は **地域**（ジオロケーション）を選択し、その国又は地域に登録されているすべてのIPアドレスを追加します
    * このタイプに属するすべてのIPアドレスを追加するための**ソースタイプ**を選択します、例えば：
        * **Tor** TorネットワークのIPアドレス
        * **Proxy** 公開又はウェブプロキシサーバのIPアドレス
        * **Search Engine Spiders** 検索エンジンスパイダーのIPアドレス
        * **VPN** 仮想プライベートネットワークのIPアドレス
        * **AWS** Amazon AWSに登録されているIPアドレス
4. 指定されたIPアドレスのアクセスを許可又は制限するアプリケーションを選択します。
5. IPアドレス又はIPアドレス群をリストに登録する期間を選択します。最小値は5分です、最大値は永続です。
6. IPアドレス又はIPアドレス群をリストに登録する理由を明記します。

![!Add IP to the list (with app)](../../images/user-guides/ip-lists/add-ip-to-list-app.png)

### 自動的なボットIPの拒否リスト登録

--8<-- "../include-ja/waf/features/ip-lists/autopopulation-by-antibot.md"

## 拒否リストに登録されたIPについての通知の受け取り

あなたは日常的に使用するメッセンジャーやSIEMシステムを通じて新たに拒否リストに登録されたIPについての通知を受け取ることができます。通知を有効にするために、適切な[トリガー](../triggers/triggers.md)を設定してください、例えば：

![!Example of trigger for denylisted IP](../../images/user-guides/triggers/trigger-example4.png)

--8<-- "../include-ja/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"