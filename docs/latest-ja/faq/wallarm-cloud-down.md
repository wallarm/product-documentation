# Wallarm Cloudがダウンした場合

Wallarm Cloudがダウンしている場合でも、Wallarmノードは一部の制限付きで攻撃の緩和を継続します。詳細は本トラブルシューティングガイドをご参照ください。

## Wallarm Cloudがダウンしている場合、Wallarmノードはどのように動作しますか？

Wallarm Cloudは非常に安定かつスケーラブルなサービスです。加えて、お客様のアカウントデータは[バックアップ](#how-does-wallarm-protect-its-cloud-data-from-loss)によって保護されています。

しかし、まれにWallarm Cloudが一時的にダウンする場合（たとえばメンテナンスのための停止など）でも、Wallarmノードは一部の制限付きで動作を継続します。

!!! info "Wallarm Cloudの稼働状況の確認"
    Wallarm Cloudのステータスは[status.wallarm.com](https://status.wallarm.com/)で確認できます。最新情報を受け取るには更新通知を購読してください。

継続して動作するもの:

* Cloudとノード間の直近の正常な[同期](../admin-en/configure-cloud-node-synchronization-en.md)時にノードへアップロードされたルールを用い、設定済みの[モード](../admin-en/configure-wallarm-mode.md#available-filtration-modes)でのトラフィック処理。以下の要素の最新版はスケジュールに従ってCloudからノードへアップロードされ、ノード内にローカル保存されるため、ノードは処理を継続できます:

    * [カスタムルールセット](../user-guides/rules/rules.md#ruleset-lifecycle)
    * [proton.db](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors)

* [IP lists](../user-guides/ip-lists/overview.md)もノードにアップロードされ、ノード内に保存されます。アップロード済みのアドレスは有効期限日時までは処理され続けます。

    これらの日時はCloudの復旧と同期が行われるまで更新されません。また、Cloudの復旧・同期までは新規/削除されたアドレスも反映されません。

    なお、リスト内の一部IPアドレスが期限切れになると、それらに関連する[ブルートフォース攻撃](../admin-en/configuration-guides/protecting-against-bruteforce.md)に対する保護は停止します。

* Cloudからノードへの直近の正常なアップロードでノードに取り込まれた仕様に基づく[API仕様の強制](../api-specification-enforcement/overview.md)。

停止するもの:

* [API Attack Surface Management (AASM)](../api-attack-surface/overview.md)。
* [クレデンシャルスタッフィングの検出](../about-wallarm/credential-stuffing.md)。
* [API乱用防止](../api-abuse-prevention/overview.md)。
* ノードは検出した攻撃や脆弱性に関するデータを収集しますが、Cloudへ送信できません。なお、ノードの[postanalyticsモジュール](../admin-en/installation-postanalytics-en.md)にはインメモリストレージ（wstore）があり、収集データはCloudへ送信されるまで一時的にそこへ保存されます。Cloudが復旧すると、バッファリングされたデータは送信されます。

    !!! warning "ノードのインメモリストレージの制限"
        バッファサイズには[制限](../admin-en/configuration-guides/allocate-resources-for-node.md#wstore)があり、超過すると古いデータから削除されます。したがって、Cloudのダウン時間の長さやその間に収集された情報量によっては、Cloud復旧後にWallarm Consoleで一部のデータしか確認できない場合があります。

* ノードは処理済みトラフィックの[メトリクス](../admin-en/configure-statistics-service.md)を収集しますが、Cloudへ送信できません。
* [API Sessions](../api-sessions/overview.md) — Cloudがダウンしていた間に発生した正当なリクエストに関する情報はすべて失われます。攻撃に関する情報は提示されます（復旧後にCloudへアップロードされます）。
* [Triggers](../user-guides/triggers/triggers.md)は動作しなくなるため、次の影響があります:
    * [IP lists](../user-guides/ip-lists/overview.md)の更新が止まります。
    * [Trigger-based notifications](../user-guides/triggers/triggers.md)は表示されません。
* [APIインベントリの検出](../api-discovery/overview.md)は動作しません。
* [Threat Replay Testing](../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)は停止します。
* [ブルートフォース攻撃](../admin-en/configuration-guides/protecting-against-bruteforce.md)は検出されません。
* Integrationsは停止し、以下が発生します:
    * 即時およびメールの[通知](../user-guides/settings/integrations/integrations-intro.md)は表示されません。
    * レポーティングは停止します。
* Wallarm Consoleへアクセスできません。
* [Wallarm API](../api/overview.md)は応答しません。

なお、上記のような全体的なダウン状態だけでなく、一部のサービスのみが一時的に利用できず、他のサービスは動作し続ける場合もあります。その場合は、[status.wallarm.com](https://status.wallarm.com/)で該当する情報が提供されます。

## Cloud復旧後はどうなりますか？

Cloud復旧後は次のとおりです:

* Wallarm Consoleへのアクセスが復旧します。
* ノードはバッファリングされた情報をCloudへ送信します（上記の制限事項にご留意ください）。
* Triggersは新しいデータに反応し、通知の送信やIPの更新を行います。
* IPに変更がある場合は、次回の同期時にノードへ送信されます。
* [未完了のカスタムルールセット](#is-there-a-case-when-node-did-not-get-settings-saved-in-wallarm-console-before-wallarm-cloud-is-down)のビルドがあった場合は再開されます。
* Cloudとフィルタリングノードは通常どおりスケジュールに従って同期します。

## Wallarm Cloudがダウンする前にWallarm Consoleに保存した設定がノードへ反映されない場合はありますか？

はい、可能性があります。例として、[同期](../admin-en/configure-cloud-node-synchronization-en.md)間隔が3分で、次の状況を考えます。

1. 直近のカスタムルールセットのビルドは21分前にCloud上で完了し、20分前にノードへアップロードされました。
2. その後の6回の同期では、Cloud側に新しいものがなかったため何も取得されませんでした。
3. その後、Cloud上でルールが変更され新しいビルドが開始されました。ビルドの完了には4分必要でしたが、2分経過した時点でCloudがダウンしました。
4. ノードは完了したビルドのみを取得するため、その2分間の同期ではノードにアップロードするものはありません。
5. さらに1分後、ノードは新たな同期要求を送りますが、Cloudは応答しません。
6. ノードは「24分前の」カスタムルールセットに基づいてフィルタリングを継続し、Cloudがダウンしている間はその経過時間が増加し続けます。

## WallarmはCloudのデータをどのように損失から保護しますか？

Wallarm Cloudは、Wallarm Consoleでユーザーが提供したすべてのデータおよびノードからアップロードされたデータを保存します。前述のとおり、Wallarm Cloudが一時的にダウンすることは極めてまれです。仮に発生した場合でも、保存済みデータに影響が及ぶ可能性は非常に低いです。つまり、復旧後はすべてのデータをそのまま使用してすぐに作業を再開できます。

Wallarm Cloudの実データを保存しているハードドライブが破損するという低い可能性に備え、Wallarmは自動でバックアップを作成し、必要に応じてそこから復元します:

* RPO: 24時間ごとにバックアップを作成します
* RTO: 48時間以内にシステムが再び利用可能になります
* 直近14個のバックアップを保持します

!!! info "RPO/RTOの保護および可用性の指標"
    * **RPO（recovery point objective）**は、データバックアップの頻度を決定するために用いられる指標です。データを喪失し得る最大の時間幅を定義します。
    * **RTO（recovery time objective）**は、災害後に許容可能なサービスレベルで業務を復旧し、業務停止に伴う耐え難い影響を回避するために、ビジネスが確保すべき実時間の長さを指します。

Wallarmのディザスタリカバリ（DR）計画および貴社向けの詳細については、[Wallarmサポートにお問い合わせください](mailto:support@wallarm.com)。