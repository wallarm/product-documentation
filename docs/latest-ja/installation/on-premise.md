# Wallarmオンプレミス展開

Wallarmは、パートナー、大企業、包括的なオンプレミスセキュリティシステムを求めるあらゆる組織向けに設計されたオンプレミスソリューションを提供します．この提供により、Wallarmのセキュリティインフラストラクチャをそのまま自社環境に統合することが可能です．本記事では、この提供の利用方法とアクセス方法について説明します．

!!! info "お問い合わせ先"
    オンプレミス展開に関するご質問やご要望につきましては、[Wallarmの営業チーム](mailto:sales@wallarm.com)までご連絡ください．

Wallarmアーキテクチャは、[2つの主要コンポーネント](../about-wallarm/overview.md#how-wallarm-works)を中心に構築されています:

* フィルタリングノード：自社インフラ内に展開し、ニーズに合わせた柔軟な展開オプションを可能にします．
* Wallarm Cloud：従来はWallarmが外部でホストしますが，オンプレミス展開モデルでは、Wallarm Cloudを自社インフラ内に展開する方法を提供します．このアプローチはサービス展開が包括的であるため、インフラ全体の整理が必要となります．必要なすべてのサービスを自動的に起動するスクリプトを提供することで、このプロセスを簡略化しています．

![オンプレミス展開](../images/waf-installation/on-premise.png)

## Wallarm Cloudのオンプレミス展開

オンプレミス展開では、Wallarm Cloudを自社インフラに展開する必要があります．Wallarmは、バックエンドとフロントエンドコンポーネント（Wallarm Console UI）の両方を含む必要なCloudサービスを数ステップで展開するスクリプトを提供することで、このプロセスを簡素化します．

### 要件

Wallarm Cloudのオンプレミス展開には、以下の条件を満たすコンピュートインスタンスの準備が必要です．

**オペレーティングシステム**

* Ubuntu LTS 18.04,20.04,22.04
* Debian 11.x,12.x
* Red Hat Enterprise Linux 8.x

**システム要件**

* サーバーはスタンドアロンとして専用に確保し、専用の電力供給が推奨されます．
* インストール、アップグレード、デバッグには`root`特権が必要です．

最小リソース要件:

* 16コア以上
* 48GB以上のメモリ
* 300GBのSSDルートストレージ（HDDはパフォーマンスが低いため不適切です．NVMeは許容されますが必須ではありません）．サーバーの構成は、ルートディレクトリおよび必要に応じて`/boot`のデフォルトのOSマウントのみを含むようにし，追加のディスクボリュームまたはストレージパーティションの設定は避けてください．
* 月間1億リクエストごとに追加で100GBのストレージが必要です（1年間分のデータを保存するため）．

月間10億リクエスト以上の場合、推奨リソース要件:

* 32コア以上
* 80GB以上のメモリ（120GB推奨）
* 500GBのSSDルートストレージ（HDDはパフォーマンスが低いため不適切です．NVMeは許容されますが必須ではありません）．サーバーの構成は、ルートディレクトリおよび必要に応じて`/boot`のデフォルトのOSマウントのみを含むようにし，追加のディスクボリュームまたはストレージパーティションの設定は避けてください．
* 月間1億リクエストごとに追加で100GBのストレージが必要です（1年間分のデータを保存するため）．

<a name="network_reqs_cloud"></a>**ネットワーク要件**

* ライセンスキーおよびインストール／アップグレードパッケージのダウンロードのため、ポート80および443を使用して`https://onprem.wallarm.com`および`https://meganode.wallarm.com`への発信接続を許可してください．このドメインは静的IPアドレスで運用され、DNSもそれを解決する必要があります．
* インスタンス用に3〜5階層のDNSワイルドカードレコードを設定します（例：`*.wallarm.companyname.tld`）．

    これらのDNSレコードにより、Wallarmフィルタリングノードおよび必要なクライアントからインスタンスにアクセスできるようにしてください．アクセスは貴社のセキュリティ要件に応じて、VPNで制限するか外部アクセスを許可するか選択できます．

    ??? info "代替ドメイン名"
        ワイルドカードCommon Name (CN)が利用できない場合は、以下の個別ドメイン名を設定してください．

        * `wallarm.companyname.tld`
        * `my.wallarm.companyname.tld`
        * `api.wallarm.companyname.tld`
        * `sso.wallarm.companyname.tld`
        * `ldap.wallarm.companyname.tld`
        * `console.wallarm.companyname.tld`
        * `ui.wallarm.companyname.tld`
        * `ql.wallarm.companyname.tld`
        * `minio.wallarm.companyname.tld`
        * `minio-ui.wallarm.companyname.tld`
        * `prometheus.wallarm.companyname.tld`
        * `alertmanager.wallarm.companyname.tld`
        * `grafana.wallarm.companyname.tld`
* 信頼できるCAもしくは内部CAから発行された有効なSSL／TLSワイルドカード証明書（およびキー）が必要です．すべてのフィルタリングノードインスタンスおよびブラウザは、このSSL／TLS証明書／キーのペアを信頼済みとして認識する必要があります．

**ソフトウェア依存関係**

最小限のソフトウェアのみが含まれるクリーンなOSインストールから開始してください．展開プロセスにより、その後に追加のパッケージ（containerd、Kubernetesなど）がインストールされます．以下の条件を満たしていることを確認してください．

* TCPポート22でSSHdサービスが動作しており、SSH鍵認証が有効になっています．
* 以下のパッケージが事前にインストールされていること（ほとんどのシステムではデフォルトで含まれています）:

    * `iproute`
    * `iptables`
    * `bash`
    * `curl`
    * `ca-certificates`

    === "DebianベースのOS"
        ```
        apt-get install iproute2 iptables bash curl ca-certificates
        ```
    === "Red HatベースのOS"
        ```
        yum install iproute iptables bash curl ca-certificates
        ```
* SELinuxは完全に無効化されている必要があります．パフォーマンス上の理由から、許容モードでは不十分です．
* ネットワーク制限を回避するために、`firewalld`や`ufw`などのファイアウォールは完全に無効化してください．
* SWAPメモリは無効化してください．

    ```
    swapon -s
    ```

### 手順

用意されたコンピュートインスタンス上にWallarm Cloudをオンプレミス展開する手順は以下の通りです．

1. 当社の[sales team](mailto:sales@wallarm.com?subject=Wallarm%20on-premise%20deployment&body=Dear%20Wallarm%20Sales%20Team%2C%0A%0AI%20am%20writing%20to%20express%20my%20interest%20in%20deploying%20the%20Wallarm%20platform%20on-premise.%20Could%20you%20please%20provide%20me%20with%20the%20necessary%20scripts%20for%20deployment%2C%20detailed%20information%20on%20the%20appropriate%20subscription%20plans%2C%20and%20comprehensive%20instructions%3F)にご連絡いただき、Cloudサービス展開用のスクリプト、対応する手順、および初期認証情報を入手してください．
1. 上記の要件に従って、仮想マシン（または物理マシン）を準備します．
1. インストールパッケージを用意したインスタンスにアップロードし、ソリューションコンポーネントを展開するために実行します．
1. インスタンスのIPアドレスを指すDNSワイルドカードレコード（例：`*.wallarm.companyname.tld`）を設定します．

    `my.wallarm.companyname.tld`や`api.wallarm.companyname.tld`などのサブドメインおよび他の[必要な個別ドメイン名](#network_reqs_cloud)がこのIPアドレスを解決することを確認してください．
1. インストールパッケージに同梱されている初期設定ガイドに従って設定を行います．
1. 設定が完了したら、`https://my.wallarm.companyname.tld`（または設定した該当ドメインレコード）にアクセスし、初期認証情報を使用してログインを試みてください．

これで、ホスト型Cloud版と同様にオンプレミスUI経由でWallarmプラットフォームの設定が可能となります．例えば:

* [ノード展開用トークンの生成](../user-guides/settings/api-tokens.md)
* [攻撃およびHitsの確認](../user-guides/events/check-attack.md)
* [トラフィックフィルタリングルールの変更](../user-guides/rules/rules.md)
* [API Discovery](../api-discovery/overview.md)などの追加プラットフォームモジュールの管理

すべての機能はこのドキュメントサイトに記載されています．記事内でWallarm Console UIリンクが異なるCloud環境を参照する場合は、オンプレミスのWallarm Cloudを展開したインターフェースおよび貴社独自のドメインを使用してください．

## Wallarmフィルタリングノードの展開

オンプレミスのWallarmフィルタリングノードの展開プロセスは、標準のフィルタリングノード展開手順と類似しています．ニーズおよびインフラに合わせた展開オプションを選択し、選択した展開方法に固有の要件に沿ってガイドに従ってください．

### 要件

フィルタリングノードを展開するためには、以下の条件を満たすコンピュートインスタンスを準備してください:

* ノードの運用をサポートする十分なCPU、メモリ、ストレージ（トラフィック量に合わせたもの）．一般的なリソース割り当ての推奨事項については[こちら](../admin-en/configuration-guides/allocate-resources-for-node.md)を参照してください．
* オンプレミスCloudインスタンスのTCP/80およびTCP/443ポートへアクセス可能であること．
* 選択した展開方法の記事に記載されているその他の要件に従ってください．

### 手順

オンプレミスでフィルタリングノードを展開する手順は以下の通りです:

1. 利用可能なオプションから[展開オプション](supported-deployment-options.md)を選択し、提供された手順に従ってください．すべてのオプション（インラインおよびアウトオブバンド(OOB)の構成を含む）はオンプレミス展開をサポートします．

    ノード設定中、Wallarm Cloudホストを定義するパラメーターにおいて、以前に作成したWallarm Cloudインスタンスのドメインである`wallarm.companyname.tld`の代わりに`api.wallarm.companyname.tld`を指定してください．
1. 実行中のインスタンスのドメインがそのIPアドレスを解決することを確認してください．例えば、ドメインが`wallarm.node.com`として構成されている場合、このドメインはインスタンスのIPアドレスを指す必要があります．

## 展開のテスト

展開のテストを行うには、以下の手順に従ってください:

1. フィルタリングノードインスタンスを対象としたパストラバーサル攻撃のテストを実行します:

    ```bash
    curl http://localhost/etc/passwd
    ```
1. 展開したWallarm Console UIを開き、対応する攻撃が攻撃リストに表示されていることを確認してください．

## 制限事項

現時点でオンプレミスWallarmソリューションでは、以下の機能はサポートされていません:

* [Exposed Asset Scanner](../user-guides/scanner.md)
* [Threat Replay Testing](../vulnerability-detection/threat-replay-testing/overview.md)
* [API Leaks](../api-attack-surface/security-issues.md#api-leaks)