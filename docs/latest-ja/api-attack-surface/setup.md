[link-aasm-security-issue-risk-level]:  security-issues.md#issue-risk-level
[link-integrations-intro]:              ../user-guides/settings/integrations/integrations-intro.md
[link-integrations-email]:              ../user-guides/settings/integrations/email.md#setting-up-integration

# API Attack Surface Managementのセットアップ  <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

この記事では、[API Attack Surface Management](overview.md)を有効化および構成し、APIを持つ外部ホストを発見し、未導入のWAF/WAAPソリューションを特定し、APIリークやその他の脆弱性を軽減する方法を説明します。

## 有効化

AASMを使用するには、貴社のWallarmに[API Attack Surface](../about-wallarm/subscription-plans.md#api-attack-surface)サブスクリプションプランが有効である必要があります。有効化するには、次のいずれかを実施してください。

* まだWallarmアカウントがない場合は、Wallarmの公式サイト[こちら](https://www.wallarm.com/product/aasm)で価格情報を確認し、AASMを有効化してください。

    これによりCore (freemium)版が有効化され、使用したメールアドレスのドメインのスキャンが直ちに開始されます。有効化後、スコープに[ドメインを追加](setup.md)できます。

    Enterprise機能が不要である限り、Core版を必要なだけ継続して利用できます。各バージョンの違いは[こちら](https://www.wallarm.com/product/aasm-pricing)をご参照ください。

* すでにWallarmアカウントをお持ちの場合は、[sales@wallarm.com](mailto:sales@wallarm.com)までご連絡ください。

## Domains and hosts

### スコープへの追加

選択したドメイン配下のホストを検出し、これらのホストに関連するセキュリティ問題を検索するように[API Attack Surface Management](overview.md)を構成するには、次の手順を実行します。

1. Wallarm Consoleで、**AASM** → **API Attack Surface** → **Configure** → **Domains and hosts**に進みます。
1. ドメインをスコープに追加し、スキャン状況を確認します。

    新しく追加された各ドメインについて、[**Scan configuration**](#scan-configuration)で選択したデータのスキャンがWallarmにより直ちに開始されます。必要に応じて進行中のスキャンを停止できますが、その場合はすべての結果が消去されます。

1. 追加したドメインについては、ホストは自動的に検出されます。必要に応じて、手動でホストを追加できます。**Add host**をクリックし、カンマ、セミコロン、スペース、または改行で区切ったホストを貼り付けます。
1. ドメインをクリックすると、検出済みおよび追加済みの各ホストの詳細を表示できます。

    ![AASM - スコープの設定](../images/api-attack-surface/aasm-scope.png)

### スコープからの削除

スコープからドメインを削除できます。削除すると、このドメインに対してこれまでに検出されたホストおよび手動で追加されたホストはすべて一覧から削除されます。

1. **Domains and hosts**タブで、チェックボックスによりドメインを選択し、**Delete**をクリックします。
1. これらのドメインに対してセキュリティ問題が見つかっている可能性があるため、問題の扱いを選択する必要があります。選択肢は次のとおりです。

    * 関連するセキュリティ問題を保持
    * 関連するセキュリティ問題をクローズ
    * 関連するセキュリティ問題を誤検知としてマーク
    * 関連するセキュリティ問題を削除

## Scan configuration

[API Attack Surface Management](overview.md)により、ドメインに関連するどの種類のデータを検索・表示するかを選択できます。

### 一般設定

利便性のため、Wallarmはスキャン設定用の事前定義プロファイルを提供しています。内容を把握するため、プロファイルを切り替えてお試しください。

![AASM - スキャン設定](../images/api-attack-surface/aasm-scan-configuration.png)

プロファイルの概要:

| Profile | 説明 |
| --- | --- |
| **Full** | すべての種類のネットワークサービスを対象に検索し、WAAPカバレッジを包括的に確認し、あらゆる手法でAPIリークを探索し、すべての脆弱性検出モジュールを有効にする最も包括的なスキャンです。 |
| **Fast** | 攻撃対象領域と基本的な問題を迅速にスキャンします。外部API検出の除外、APIリーク検索からの公開HTML/JSコンテンツの除外、脆弱性検出モジュールの限定が可能です。 |
| **Vulnerabilities & API leaks** | セキュリティ問題の検出に特化したスキャンです。 |
| **Attack surface inventory** | セキュリティ問題を検索せずに、攻撃対象領域を迅速に特定・把握します。 |
| **API leaks - passive** | インフラストラクチャへの相互作用を行わず、APIリークのみを検索します。 |
| **Custom** | 他のプロファイルのいずれかに調整を加えると常に有効になります。 |

スキャンオプションを構成するには:

1. Wallarm Consoleで、**AASM** → **API Attack Surface** → **Configure** → **Scan configuration**に進みます。
1. 適切なプロファイルを選択します。
1. 必要に応じてプロファイルのオプションを手動で調整します。一部のオプションは特定のプロファイルからは除外できない点にご注意ください。

    !!! warning "編集中の変更を失わないようにしてください"
        オプションに加えた変更は、標準プロファイルを再度クリックすると失われることにご注意ください。

### Subdomain discovery

場合によっては、サブドメイン検出を無効にする（`example.com`はスキャンするが`app1.example.com`はスキャンしない）方が適切なことがあります。

* サブドメインの所有者ではない（子会社や支社が所有している可能性があります）
* すべてのサブドメインがワイルドカード（任意の名前のサブドメインが存在し得る）であり、サブドメイン数が無限
* スキャンのパフォーマンスをさらに最適化したい

構成でサブドメイン検出が有効（**Scan configuration** → **Scanning profile** → **Network service discovery** → **Subdomain discovery**）になっている場合、このオプションはドメインごとに調整できます。手順は次のとおりです。

1. **Domains and hosts**タブに移動します。
1. 各ドメインの**With subdomains**オプションをオフ/オンに切り替えます。

    グローバルオプションが優先される点に注意してください。グローバルで無効化されている場合、どこでもサブドメインは検索されません。グローバルで有効化されている場合、ドメイン単位のオプションで例外設定が可能です。

## Auto rescan

Auto rescanが有効な場合、追加済みドメインは7日ごとに自動的に再スキャンされます。新規ホストは自動的に追加され、再スキャン時に見つからなかった既存ホストも一覧に残ります。

Auto rescanを構成するには:

1. Wallarm Consoleで、**AASM** → **API Attack Surface** → **Configure** → **Scan configuration**に進み、**Auto rescan**オプションを有効化します。
1. **Domains and hosts**タブで、自動再スキャンの対象に含める/除外するドメインを選択します。

    グローバルオプションが優先されます。無効化されている場合、自動再スキャンは実行されません。ドメイン単位のオプションで、特定のドメインをAuto rescanから除外できます。

![AASM - Auto rescanの設定](../images/api-attack-surface/aasm-auto-rescan.png)

## 手動再スキャン

**AASM** → **API Attack Surface** → **Configure** → **Domains and hosts**で**Scan now**ボタンをクリックすると、任意のドメインに対して手動でスキャンを開始できます。

必要に応じて進行中のスキャンを停止できますが、その場合はすべての結果が消去されます。

## ブロックされないようにする

Wallarmに加えて、トラフィックを自動的にフィルタリングおよびブロックする追加の仕組み（ソフトウェアまたはハードウェア）を使用している場合は、API Attack Surface Management用のIPアドレスを含む[許可リストを構成](../admin-en/scanner-addresses.md)することを推奨します。

これにより、API Attack Surface Managementを含むWallarmのコンポーネントが、脆弱性の有無についてお客様のリソースをシームレスにスキャンできるようになります。

## Scanning status

ドメインがスコープに追加された時刻および最後にスキャンされた時刻の概要は、**AASM** → **API Attack Surface** → **Configure** → **Domains and hosts**に表示されます。

![AASM - スコープのドメイン設定](../images/api-attack-surface/aasm-scope.png)

設定ダイアログからメインのAPI Attack Surface画面に戻ると、まずHost scanning statusの概要が表示されます。その後、詳細なスキャン履歴を確認するにはScanning statusタブに切り替えます。以下の内容が含まれます。

* どのドメインがスキャンされたか（Target）
* スキャンの開始方法（手動か自動か）（Start-up option）
* このスキャンで検出されたホストの総数と新規ホスト数
* このスキャンで検出されたセキュリティ問題の総数と新規セキュリティ問題数
* スキャンのステータス、開始日時と終了日時

![AASM - 詳細なスキャン状況](../images/api-attack-surface/aasm-scanning-status.png)

## 通知

--8<-- "../include/api-attack-surface/aasm-notifications.md"