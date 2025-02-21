# IPによるフィルタリング

Wallarm Consoleの**IPリスト**セクションでは、IPアドレス、地理的位置、データセンターまたはソースタイプによる許可リスト、拒否リスト、グレイリストでお客様のアプリケーションへのアクセスを制御できます。

* **Allowlist（許可リスト）** は、Wallarm保護をバイパスし、チェックなしでお客様のアプリケーションへアクセス可能な信頼できるソースのリストです。
* **Denylist（拒否リスト）** は、お客様のアプリケーションへアクセスできないソースのリストであり、それらからのすべてのリクエストがブロックされます。
* **Graylist（グレイリスト）** は、疑わしいソースのリストであり、ノードが**Safe blocking** [filtration mode](../../admin-en/configure-wallarm-mode.md) の場合に、以下のように処理されます：グレイリストに含まれるIPが悪意のあるリクエストを発生させた場合、ノードはそれらをブロックし、正当なリクエストは許可します。

    グレイリストに含まれるIPから発生する悪意のあるリクエストは、以下の攻撃の兆候を含むものです：

    * [入力検証攻撃](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)
    * [vpatch型攻撃](../rules/vpatch-rule.md)
    * [正規表現に基づいて検出された攻撃](../rules/regex-rule.md)

![すべてのIPリスト](../../images/user-guides/ip-lists/ip-lists-home-apps.png)

## Allowlist、Denylist、Graylistの連携方法

フィルタリングノードは、選択された運用 [mode](../../admin-en/configure-wallarm-mode.md) に基づき、IPリストを解析する際に異なるアプローチを採用します。あるモードでは、allowlist、denylist、graylistの3種類のIPリストすべてを評価しますが、他のモードでは特定のIPリストのみを対象とします。

以下の画像は、各運用モードにおけるIPリストの優先順位および組み合わせを視覚的に表現し、それぞれの場合に考慮されるリストを強調しています：

![IPリストの優先順位](../../images/user-guides/ip-lists/ip-lists-priorities.png)

これは以下を意味します：

* どのモードでも、対象のIPが先のリストに存在する場合、後続のリストは考慮されません。
* Graylistは`Safe blocking`モードの場合にのみ考慮されます。

!!! warning "例外"
    もし[`wallarm_acl_access_phase off`](../../admin-en/configure-parameters-en.md#wallarm_acl_access_phase)の場合、Wallarmノードは`Monitoring`モードにおいて拒否リストに含まれるIPからのリクエストをブロックしません。

## IPリストの設定

手順：

1. 目的に応じて使用するリストを決定します。
1. オブジェクトの種類を選択します [どのオブジェクトを追加するか](#select-object)：IP、サブネット、場所、ソースタイプ。
1. オブジェクトがリストに保持される期間を[選択](#select-time-to-stay-in-list)します（通常は無期限ではありません）。
1. 対象の[applications](../../user-guides/settings/applications.md)によって制限します（すべてのリクエストではなく、特定のアプリケーションを対象とする場合のみ）。

### オブジェクトの選択

**Add object** を使用して、以下の項目をいずれかのIPリストに追加します：

* **IPまたはサブネット** - IPv6アドレスの場合、サポートされる最大サブネットマスクは`/32`、IPv4アドレスの場合は`/12`です。
* **Location**（国または地域） - この国または地域に登録されているすべてのIPアドレスを追加します。
* **Source type** - このソースタイプに属するすべてのIPアドレスを追加します。利用可能なタイプは：
    * 検索エンジン
    * データセンター（AWS、GCP、Oracleなど）
    * 匿名ソース（Tor、Proxy、VPN）
    * [Malicious IPs](#malicious-ip-feeds)

![IPリストにオブジェクトを追加](../../images/user-guides/ip-lists/add-ip-to-list.png)

!!! info "IPリストの自動入力"
    オブジェクトを手動で追加する以外に、[自動追加](#automatic-listing)を使用することも可能であり、そちらが推奨です。

### リストに保持する期間の選択

オブジェクトをリストに追加する際、保持期間を指定します。最短時間は5分、デフォルトは1時間、最大は無期限です。指定された期間が経過すると、オブジェクトは自動的にリストから削除されます。

指定された期間は、後からいつでも変更可能です。これを行うには、オブジェクトのメニューで**Change time period**をクリックし、調整します。

この期間設定と手動でのオブジェクトの追加および削除により、IPリストの状態は時間とともに変化します。すべてのリストの過去の状態を[表示](#ip-list-history)できます。

### 対象アプリケーションによる制限

オブジェクトをリストに追加する際、デフォルトではそのIPアドレスからのすべてのリクエストが処理されます。しかし、対象の[applications](../../user-guides/settings/applications.md)によって制限することが可能で、1つまたは複数のアプリケーションを選択することで、そのアプリケーションへのリクエストのみが処理されます。

## 悪意のあるIPフィード

IPリストに**Malicious IPs**[source type](#select-object)を追加する場合、公共の情報源に記載され、専門家の分析により確認された、悪意のある活動で知られるすべてのIPアドレスが含まれることに注意してください。これらのデータは、以下のリソースから組み合わせて取得しています：

* [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
* [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
* [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
* [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
* [www.blocklist.de](https://www.blocklist.de/en/export.html)
* [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
* [IPsum](https://github.com/stamparm/ipsum)

## IPリストの履歴

IPリストは現在の状態だけでなく、過去の状態も保持しており、内容が異なる場合があります。特定の日付を選択してIPリストの内容を確認すると、システムは追加された正確な日時および方法（手動または自動）を含む詳細な**履歴**を返します。レポートには、変更を担当した人物および各追加の理由に関するデータも提供され、監査や報告のための履歴管理に役立ちます。

![IPリストの履歴](../../images/user-guides/ip-lists/ip-list-history.png)

**Now**タブに切り替えることで、現在のIPリストの状態、すなわちリストに現在含まれているオブジェクトを確認できます。

## 自動リスト追加

疑わしいトラフィックを発生させた場合、WallarmがIPアドレスを自動でdenylistもしくはgraylistに追加するよう有効にできます。これは以下の場合に実施が可能です：

* [API abuse prevention](../../api-abuse-prevention/overview.md)
* [Brute force protection](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Forced browsing protection](../../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [BOLA protection](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [Multi-attack protection](../../admin-en/configuration-guides/protecting-with-thresholds.md)

もし自動追加されたIPアドレスを手動で削除した場合でも、新たな悪意のある活動が検出されると自動的に再追加されますが、以下の条件があります：

* **Not before** 前回の期間の半分経過後

    例えば、BOLA攻撃によりIPアドレスが自動で4時間denylistされ、denylistから削除した場合、そのIPは次の2時間以内に（攻撃が発生しても）再追加されません。

* **API Abuse Prevention** の場合は、即時です

## 拒否リストに含まれるIPからのリクエスト

IPがdenylistに含まれていても、そのIPからの後続リクエストに関する情報を取得することは有益です。これにより、IPの挙動の正確な分析が可能となります。Wallarmは、拒否リストに含まれるソースIPからのブロックされたリクエストに関する統計情報を収集および表示します。

!!! info "機能の利用可能性"
    この機能は、NGINXベースのノードにおいて、バージョン4.8以降で利用可能です。[wallarm_acl_export_enable](../../admin-en/configure-parameters-en.md#wallarm_acl_export_enable)ディレクティブで制御できます.

この情報は以下に利用可能です：

* 手動でdenylistされたIP
* 自動でdenylistされたIP：
    * [API abuse prevention](../../api-abuse-prevention/overview.md)
    * [Brute force protection](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
    * [Forced browsing protection](../../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
    * [BOLA protection](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)
    * [Multi-attack protection](../../admin-en/configuration-guides/protecting-with-thresholds.md)

ここで挙げた行動による攻撃は、一定の統計情報が蓄積された後でのみ検出可能であり、その必要な量は各トリガーの閾値によって異なります。そのため、denylistに追加する前の段階では、Wallarmはこの情報を収集しますが、リクエストはすべて通過し、`Monitoring`ステータスの攻撃として表示されます。

トリガーの閾値を超えると、WallarmはIPをdenylistに追加し、以降のリクエストをブロックします。そのIPからのリクエストは攻撃リストに`Blocked`として表示されます。これは手動でdenylistされたIPにも適用されます。

![拒否リストに含まれるIPに関連するイベント - 送信データが有効](../../images/user-guides/events/events-denylisted-export-enabled.png)

denylistに含まれるIPからのリクエストを検索するには、以下の検索タグを使用してください： [API abuse related](../../attacks-vulns-list.md#api-abuse)、自動追加の場合は`brute`、`dirbust`、`bola`、`multiple_payloads`、手動の場合は`blocked_source`。

なお、検索/フィルターでは、各攻撃タイプについて`Monitoring`ステータスのみならず、送信情報が有効な場合には`Blocked`ステータスの攻撃も表示されます。手動でdenylistされたIPについては、`Monitoring`ステータスの攻撃は存在しません。

`Blocked`ステータスの攻撃の中では、タグを使用してdenylistの理由―BOLA設定、API Abuse Prevention、トリガーまたはdenylistに記録された原因―に切り替えます。

## 拒否リストに含まれるIPの通知を受け取る

日常的に使用するメッセンジャーまたはSIEMシステムを通じて、新たにdenylistされたIPについて通知を受けることができます。通知を有効にするには、**Triggers**セクションで**Denylisted IP**条件を設定した1つまたは複数のトリガーを構成してください。例：

![denylist IP用のトリガー例](../../images/user-guides/triggers/trigger-example4.png)

**トリガーのテスト方法：**

1. Wallarm Console → **Integrations** に移動し、[US](https://us1.my.wallarm.com/integrations/) または [EU](https://my.wallarm.com/integrations/) クラウドで[integration with Slack](../../user-guides/settings/integrations/slack.md)を構成します。
1. **Triggers** 内で、上記のようにトリガーを作成します。
1. Wallarm Consoleの**IP Lists** → **Denylist**に移動し、理由「It is a malicious bot」を指定して`1.1.1.1`のIPを追加します。
1. Slackチャンネル内のメッセージを確認します。例：
    ```
    [wallarm] New IP address has been denylisted

    Notification type: ip_blocked

    IP address 1.1.1.1 has been denylisted until 2024-01-19 15:02:16 +0300 
    for the reason "It is a malicious bot". You can review denylisted IP addresses
    in the "IP lists → Denylist" section of Wallarm Console.

    This notification was triggered by the "Notify about new denylisted IPs" trigger.
    The IP is blocked for the application default.

    Client: Your Company
    Cloud: EU
    ```

## ロードバランサーおよびCDN背後で稼働するノードのIPリスト対応設定

WallarmノードがロードバランサーまたはCDNの背後に配置されている場合、エンドユーザーのIPアドレスを正しく報告するようにWallarmノードの設定を行ってください：

* [NGINXベースのWallarmノードの設定方法](../../admin-en/using-proxy-or-balancer-en.md)（AWS/GCPの画像およびDockerノードコンテナを含む）
* [Wallarm Kubernetes Ingress controllerとして展開されたフィルタリングノードの設定方法](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## APIによるリスト管理

Wallarm APIを直接呼び出すことで、任意のIPリストの内容の取得、オブジェクトの追加、および削除が可能です。[詳細なAPI request examples](../../api/request-examples.md#api-calls-to-get-populate-and-delete-ip-list-objects)をご参照ください。