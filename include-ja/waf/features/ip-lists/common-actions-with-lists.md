リストにオブジェクトを追加する

リストにIPアドレス、サブネット、またはIPアドレスのグループを追加するには:

1. **オブジェクトを追加** ボタンをクリックします。
2. 次の方法のいずれかで IP アドレスまたは IP アドレスのグループを指定します。

    * 単一の **IP アドレス** または **サブネット** を入力します
        
        !!! info "サポートされているサブネットマスク"
            IPv6 アドレスの最大サポートサブネットマスクは `/32` で、IPv4 アドレスの最大サポートサブネットマスクは `/12` です。
    
    * この国/地域で登録されているすべての IP アドレスを追加するために **国** または **地域** (ジオロケーション) を選択します
    * このタイプに属するすべての IP アドレスを追加するために **ソースタイプ** を選択します。例えば：
        * **Tor** でTorネットワークの IP アドレス
        * **プロキシ** でパブリックまたはウェブプロキシサーバーの IP アドレス
        * **検索エンジンのクローラー** で検索エンジンのクローラーの IP アドレス
        * **VPN** で仮想プライベートネットワークの IP アドレス
        * **AWS** で Amazon AWS に登録されている IP アドレス
3. リストに IP アドレスまたは IP アドレスのグループを追加する期間を選択します。最小値は 5 分で、最大値は無期限です。
4. リストに IP アドレスまたは IP アドレスのグループを追加する理由を指定します。
5. リストへの IP アドレスまたは IP アドレスのグループの追加を確認します。

![!アプリ（はありません）からリストにIPを追加する](../../images/user-guides/ip-lists/add-ip-to-list-without-app.png)

リストに追加されたオブジェクトを分析する

Wallarm Consoleでは、リストに追加された各オブジェクトについて次のデータを表示します。

* **オブジェクト** - リストに追加された IP アドレス、サブネット、国/地域または IP ソース。
* **アプリケーション** - オブジェクトへのアクセス設定が適用されるアプリケーション。 [オブジェクトのアクセス設定を特定のアプリケーションに適用することが制限されている](overview.md#known-caveats-of-ip-lists-configuration) ため、この列には常に **すべて** の値が表示されます。
* **ソース** - 単一の IP アドレスやサブネットのソース：
    * 単一の IP アドレスやサブネットが登録されている国/地域（IP2Location などのデータベースで見つかった場合）
    * ソースタイプ（**Publicプロキシ**、**Webプロキシ**、**Tor** などのIPが登録されているクラウドプラットフォーム、など）（IP2Locationなどのデータベースで見つかった場合）
* **理由** - IP アドレスまたは IP アドレスのグループをリストに追加する理由。理由は、オブジェクトをリストに追加する際に手動で指定するか、[トリガー](../triggers/triggers.md) によって IP がリストに追加されるときに自動的に生成されます。
* **追加日** - オブジェクトがリストに追加された日時。
* **削除** - オブジェクトがリストから削除されるまでの期間。

リストのフィルタリング

リスト内のオブジェクトを次の方法でフィルタリングできます。

* 検索文字列で指定された IP アドレスまたはサブネット
* リストのステータスを取得したい期間
* IP アドレスやサブネットが登録されている国/地域
* IP アドレスやサブネットが属するソース

リストにあるオブジェクトの時間を変更する

リストにある IP アドレスの時間を変更するには:

1. リストからオブジェクトを選択します。
2. 選択したオブジェクトのメニューで、**期間を変更** をクリックします。
3. オブジェクトをリストから削除する新しい日付を選択し、操作を確認します。

リストからオブジェクトを削除する

リストからオブジェクトを削除するには:

1. リストから1つまたは複数のオブジェクトを選択します。
2. **削除** をクリックします。