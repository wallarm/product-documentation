# IPアドレスの拒否リスト

**拒否リスト**は、正当なリクエストが発生してもアプリケーションにアクセスが許可されていないIPアドレスのリストです。任意の [モード](../../admin-en/configure-wallarm-mode.ja.md)でのフィルタリングノードは、拒否リストに含まれるIPアドレスからのすべてのリクエストをブロックします(ただし、IPアドレスが [許可リスト](allowlist.ja.md) に重複している場合を除く)。

Wallarm Console → **IPリスト** → **拒否リスト**では、次の方法でブロックされたIPアドレスを管理できます。

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.ja.md"

![!IP denylist](../../images/user-guides/ip-lists/denylist-apps.png)

!!! info "リストの古い名前"
    IPアドレス拒否リストの古い名前は「IPアドレス ブラックリスト」です。

## IP拒否リストの使用例

* 連続した攻撃が発生したIPアドレスをブロックする。

    攻撃は、1つのIPアドレスから発生し、さまざまなタイプの悪意のあるペイロードを含む複数のリクエストで構成される場合があります。このような攻撃をブロックする方法の1つは、リクエストの発生元をブロックすることです。[トリガー](../triggers/trigger-examples.ja.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)でソースIPブロックの閾値と適切な反応を設定することで、自動的にソースIPをブロックするように構成できます。
  
* ブロックベースの攻撃をブロックする。

    Wallarmフィルタリングノードは、悪意のあるペイロードが検出された場合、リクエストごとにほとんどの有害なトラフィックをブロックできます。ただし、すべての単一のリクエストが正当である行動ベースの攻撃\(例: ユーザー名/パスワードのペアを使用したログイン試行\)では、発生元によるブロックが必要になる場合があります。

    デフォルトでは、行動攻撃源の自動ブロックが無効になっています。[ブルートフォース保護の設定方法 →](../../admin-en/configuration-guides/protecting-against-bruteforce.ja.md#configuration-steps)

## リストへのオブジェクト追加方法

**いくつか疑わしいトラフィックが生成された場合、WallarmによるIPアドレスの自動拒否リスト**と**手動**でリストに追加されたオブジェクトの両方を利用できます。

!!! info "マルチテナントノードでのIPアドレスの追加方法"
    [マルチテナントノード](../../installation/multi-tenant/overview.ja.md)をインストールした場合は、まずリストにIPアドレスを追加するテナントの[アカウント](../../installation/multi-tenant/configure-accounts.ja.md#tenant-account-structure)に切り替えてください。

### 自動拒否リストの設定（推奨）

 [トリガー](../../user-guides/triggers/triggers.ja.md)機能は、次の条件でIPアドレスの自動拒否リストを有効にできます:

ログイン試行* 次のタイプの悪意のあるリクエスト: [`Brute force` , `Forced browsing`](../../admin-en/configuration-guides/protecting-against-bruteforce.ja.md) , [`BOLA`](../../admin-en/configuration-guides/protecting-against-bola.ja.md) 。
* IPによって生成された `悪意のあるペイロードの数`。

リストされたイベントへの`Denylist IP address`リアクションを持つトリガーは、指定された時間枠でIPアドレスを自動的に拒否リストに登録します。Wallarm Console → **Triggers**でトリガーを設定できます。

### 手動拒否リスト登録方法

IPアドレス、サブネット、またはIPアドレスのグループをリストに追加するには：

1. Wallarm Console→ **IPリスト** → **拒否リスト**を開き、 **オブジェクトの追加**ボタンをクリックします。
2. ドロップダウンリストから、新しいオブジェクトを追加するリストを選択します。
3. 次のいずれかの方法でIPアドレスまたはIPアドレスのグループを指定します:

    * 単一の **IPアドレス**または **サブネット**を入力

        !!! info "サポートされるサブネットマスク"
            サポートされる最大サブネットマスクはIPv6アドレスの場合は`/32`、IPv4アドレスの場合は`/12`です。

    * すべてのIPアドレスが登録されている **国**または **地域**（ジオロケーション）を選択して追加
    * このタイプに属しているすべてのIPアドレスを追加する **ソースタイプ**を選択 \(例：\) ：
        * **Tor**：TorネットワークのIPアドレス
        * **Proxy**：パブリックまたはWebプロキシサーバーのIPアドレス
        * **Search Engine Spiders**：検索エンジンスパイダーのIPアドレス
        * **VPN**：仮想プライベートネットワークのIPアドレス
        * **AWS**：Amazon AWSに登録されているIPアドレス
4. 指定したIPアドレスのアクセス許可または制限するアプリケーションを選択します。
5. IPアドレスまたはIPアドレスのグループをリストに追加する期間を選択します。最小値は5分、最大値は永遠です。
6. IPアドレスまたはIPアドレスグループをリストに追加する理由を指定します。

![!Add IP to the list (with app)](../../images/user-guides/ip-lists/add-ip-to-list-app.png)

### 自動ボットIP拒否リスト登録方法

--8<-- "../include/waf/features/ip-lists/autopopulation-by-antibot.ja.md"

## 拒否リストに登録されたIPへの通知の受け取り方

メッセンジャーや使用中のSIEMシステムを介して新たに拒否リストに登録されたIPについての通知を受け取ることができます。通知を有効にするには、適切な [トリガー](../triggers/triggers.ja.md) を設定します。例えば：

![!Example of trigger for denylisted IP](../../images/user-guides/triggers/trigger-example4.png)

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-allow-apps.ja.md"