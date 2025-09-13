# IPによるフィルタリング

Wallarm Consoleの**IP lists**セクションでは、IPアドレス、地理的位置、データセンター、またはソース種別をAllowlist、Denylist、Graylistに登録することでアプリケーションへのアクセスを制御できます。

* **Allowlist**は信頼できるソースの一覧で、Wallarmの保護をバイパスしてチェックなしにアプリケーションへアクセスします。
* **Denylist**はアプリケーションにアクセスできないソースの一覧であり、これらからのすべてのリクエストはブロックされます。
* **Graylist**は疑わしいソースの一覧で、ノードが**safe blocking**[フィルタリングモード](../../admin-en/configure-wallarm-mode.md)の場合にのみ次のように処理されます: Graylistに登録されたIPから悪意のあるリクエストが発生した場合はそれらをブロックし、正当なリクエストは許可します。他のIPからのリクエストは、悪意のあるものが検出されて**Attacks**に`Monitoring`ステータスで表示されても、ブロックはされません。

    Graylistに登録されたIPからの悪意のあるリクエストとは、次の攻撃の兆候を含むものです:

    * [入力バリデーション攻撃](../../attacks-vulns-list.md#attack-types)
    * [vpatchタイプの攻撃](../rules/vpatch-rule.md)
    * [正規表現に基づいて検出される攻撃](../rules/regex-rule.md)

![すべてのIPリスト](../../images/user-guides/ip-lists/ip-lists-home-apps.png)

## Allowlist、Denylist、Graylistの連携動作

フィルタリングノードは、選択された動作[mode](../../admin-en/configure-wallarm-mode.md)に基づいてIPリストを解析する方法が異なります。あるモードではAllowlist、Denylist、Graylistの3種類すべてを評価しますが、別のモードでは特定のリストのみを対象とします。

以下の図は、各動作モードにおけるIPリストの優先順位と組み合わせを視覚的に示し、各ケースでどのリストが考慮されるかを強調しています:

![IPリストの優先順位](../../images/user-guides/ip-lists/ip-lists-priorities.png)

つまり、次のとおりです:

* どのモードでも、IPがより上位のリストで見つかった場合、その次のリストは考慮されません。
* Graylistは`Safe blocking`モードでのみ考慮されます。

!!! warning "例外"
    [`wallarm_acl_access_phase off`](../../admin-en/configure-parameters-en.md#wallarm_acl_access_phase)の場合、`Monitoring`モードではDenylistに登録されたIPからのリクエストはWallarmノードによってブロックされません。

## IPリストの設定

手順:

1. 目的に応じて使用するリストを決めます。
1. 追加する[オブジェクト](#select-object)を選択します: IP、サブネット、ロケーション、ソース種別。
1. オブジェクトをリストに保持する[期間](#select-time-to-stay-in-list)を選択します（通常は永続ではありません）。
1. 対象[アプリケーションで制限](#limit-by-target-application)します（すべてのリクエストではなく、特定アプリケーション宛てだけに適用します）。

### オブジェクトの選択

IP listsのいずれにも次の項目を追加するには、**Add object**を使用します:

* **IPまたはサブネット** - サポートされる最大サブネットマスクはIPv6アドレスで`/32`、IPv4アドレスで`/12`です。

* **ロケーション**（国または地域） - 指定した国または地域に登録されているすべてのIPアドレスを追加します。
* **ソース種別** - この種別に属するすべてのIPアドレスを追加します。利用可能な種別は次のとおりです:

    * Search Engines
    * Datacenters（AWS、GCP、Oracleなど）
    * Anonymous sources（Tor、Proxy、VPN）
    * [Malicious IPs](#malicious-ip-feeds)

![IPリストにオブジェクトを追加](../../images/user-guides/ip-lists/add-ip-to-list.png)

!!! info "IP listsの自動投入"
    手動での追加に加えて、[自動投入](#automatic-listing)も使用できます。こちらの方が推奨です。

### リストに保持する期間の選択

オブジェクトをリストに追加する際に、保持期間を指定します。最小は5分、デフォルトは1時間、最大は無期限です。期限が切れると、オブジェクトは自動的にリストから削除されます。

指定した期間は後からいつでも変更できます。行うには、該当オブジェクトのメニューで**Change time period**をクリックして調整します。

期間設定や手動での追加/削除により、時間の経過とともにIPリストの内容は変化します。すべてのリストの[過去の状態](#ip-list-history)を表示できます。

### 対象アプリケーションによる制限

オブジェクトをリストに追加すると、デフォルトでは当該IPからのすべてのリクエストが処理対象になります。ただし、対象[アプリケーション](../../user-guides/settings/applications.md)で制限できます。1つまたは複数のアプリケーションを選択すると、そのアプリケーション宛ての当該IPからのリクエストのみが処理されます。

## 悪意のあるIPフィード

「**Malicious IPs**」[ソース種別](#select-object)をいずれかのIPリストに追加する場合、公開情報で悪意のある活動が広く知られ、かつ専門家の分析で検証されたすべてのIPアドレスが含まれる点にご注意ください。これらのデータは、次の複数のリソースを組み合わせて取得しています:

* [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
* [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
* [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
* [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
* [www.blocklist.de](https://www.blocklist.de/en/export.html)
* [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
* [IPsum](https://github.com/stamparm/ipsum)

## IPリストの履歴

IPリストには現在の状態だけでなく、[過去の時点](#select-time-to-stay-in-list)の状態もあり、それらは異なります。特定の日付を選択してIPリストの内容を確認すると、手動か自動かを含む追加の正確なタイミングと方法を詳述した**History**が返されます。レポートには、変更の責任者や各追加の理由に関するデータも含まれます。これらの知見は、コンプライアンスやレポーティングのための監査証跡の維持に役立ちます。

![IPリストの履歴](../../images/user-guides/ip-lists/ip-list-history.png)

現在のIPリストの状態に戻るには、**Now**タブに切り替えると、現在リストに含まれているオブジェクトを確認できます。

## 自動登録

不審なトラフィックを発生させたIPアドレスを、Wallarmが自動的にDenylistやGraylistへ登録するよう有効化できます。次の用途で実施できます:

* [API乱用防止](../../api-abuse-prevention/overview.md)
* [ブルートフォース防御](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [強制ブラウジング対策](../../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [BOLA対策](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [マルチ攻撃対策](../../admin-en/configuration-guides/protecting-with-thresholds.md)

自動登録されたIPを手動で削除した場合でも、新たな悪意のある活動が検出されると自動的に再登録されます。ただし次の条件があります:

* 前回の期間の半分が経過するまでは再登録されません

    例: あるIPアドレスがBOLA攻撃により自動的に4時間のDenylist入りとなり、それをDenylistから手動で削除した場合、たとえ攻撃が発生しても、次の2時間内には再登録されません。

* **API Abuse Prevention**の場合 - 直ちに再登録されます

## Denylist登録IPからのリクエスト

IPがDenylistに登録されていても、その後のリクエストに関する情報があることは有用です。これにより、当該IPの振る舞いを精緻に分析できます。Wallarmは、Denylist登録の送信元IPからのブロックされたリクエストに関する統計を収集・表示します。

!!! info "機能の提供状況"
    この機能はノードバージョン4.8以降のNGINXベースのノードで利用可能です。設定は[wallarm_acl_export_enable](../../admin-en/configure-parameters-en.md#wallarm_acl_export_enable)ディレクティブで制御できます。

この情報は、次の場合に利用できます:

* 手動でDenylistに登録したIP
* 次により自動でDenylistに登録されたIP:

    * [API乱用防止](../../api-abuse-prevention/overview.md)
    * [ブルートフォース防御](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
    * [強制ブラウジング対策](../../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
    * [BOLA対策](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)
    * [マルチ攻撃対策](../../admin-en/configuration-guides/protecting-with-thresholds.md)

これらの挙動ベースの攻撃は、所定の統計が蓄積された後にのみ検出されます。必要量は対応するトリガーのしきい値に依存します。そのため、第1段階としてDenylist登録前はWallarmがこの情報を収集しますが、すべてのリクエストは通過し、攻撃として`Monitoring`ステータスで表示されます。

トリガーのしきい値を超えると、WallarmはIPをDenylistに追加し、以降のリクエストをブロックします。攻撃リストには、このIPからの`Blocked`リクエストが表示されます。これは手動でDenylistに登録したIPにも適用されます。

![Denylist登録IPに関連するイベント - 送信有効時](../../images/user-guides/events/events-denylisted-export-enabled.png)

Denylist登録IPからのリクエストを見つけるには、[検索/フィルターのタグ](../../user-guides/search-and-filters/use-search.md#search-by-attack-type)を使用します。[API乱用関連](../../attacks-vulns-list.md#api-abuse)、`brute`、`dirbust`、`bola`、`multiple_payloads`は自動登録、`blocked_source`は手動登録です。

検索/フィルターには、各攻撃タイプについて、`Monitoring`ステータスの攻撃と（送信が有効な場合は）`Blocked`ステータスの攻撃の両方が表示される点にご注意ください。手動でDenylistに登録したIPについては、`Monitoring`ステータスの攻撃は存在しません。

`Blocked`ステータスの攻撃の中では、タグを用いてDenylist登録の理由（BOLAの設定、API Abuse Prevention、トリガー、またはDenylistの該当レコード）へと遷移できます。

## Denylist登録IPの通知を受け取る

新たにDenylistに登録されたIPについて、日常使用しているメッセンジャーやSIEMで通知を受け取れます。通知を有効にするには、**Triggers**セクションで**Denylisted IP**条件を用いたトリガーを1つ以上設定します。例:

![Denylist登録IP用トリガーの例](../../images/user-guides/triggers/trigger-example4.png)

**トリガーをテストするには:**

1. Wallarm Console→**Integrations**（[US](https://us1.my.wallarm.com/integrations/)または[EU](https://my.wallarm.com/integrations/)クラウド）に移動し、[Slackとの連携](../../user-guides/settings/integrations/slack.md)を設定します。
1. **Triggers**で、上記のとおりトリガーを作成します。
1. **IP Lists**→**Denylist**に移動し、理由を"It is a malicious bot"として`1.1.1.1`のIPを追加します。
1. Slackチャンネルに次のようなメッセージが届くことを確認します:
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

## 負荷分散装置やCDN配下のノードでIPリストを利用するための設定

WallarmノードがロードバランサーやCDNの背後にある場合、エンドユーザーのIPアドレスを正しく報告できるようWallarmノードを必ず設定してください:

* [NGINXベースのWallarmノード向け手順](../../admin-en/using-proxy-or-balancer-en.md)（AWS/GCPイメージおよびDockerノードコンテナを含む）
* [Wallarm Kubernetes Ingress controllerとしてデプロイしたフィルタリングノード向け手順](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## APIによるリスト管理

任意のIPリストの内容取得、オブジェクトの追加、オブジェクトの削除を、[Wallarm APIを直接呼び出す](../../api/request-examples.md#api-calls-to-get-populate-and-delete-ip-list-objects)ことで実行できます。