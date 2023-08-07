初期に検出された攻撃を基に、**アクティブな脅威検証**モジュールは同じエンドポイントを攻撃する様々なペイロードを持つ新規テストリクエストを多数作成します。このメカニズムにより、Wallarmは攻撃中に潜在的に悪用される可能性のある脆弱性を検出することが可能になります。アクティブな脅威検証のプロセスは、アプリケーションが特定の攻撃ベクトルに対して脆弱でないことを確認するか、実際のアプリケーションのセキュリティ問題を見つけます。

[モジュールが検出できる脆弱性のリスト](../attacks-vulns-list.md)

**アクティブな脅威検証**の過程では、以下のロジックを使用して保護アプリケーションの可能性のあるWebおよびAPIセキュリティ脆弱性をチェックします:

1. Wallarmフィルタリングノードが検出し、接続されたWallarm Cloudにアップロードした各悪意のあるリクエスト群（すべての攻撃）ごとに、システムは攻撃された特定のエンドポイント（URL、リクエスト文字列パラメータ、JSON属性、XMLフィールド等）と攻撃者が悪用しようとした特定の脆弱性（SQLi、RCE、XSS等）を分析します。例として以下の悪意のあるGETリクエストを見てみましょう:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=UNION SELECT username, password
    ```

    このリクエストから、システムは以下の詳細を学びます:
    
    * 攻撃されたURLは `https://example.com/login`です
    * 使用された攻撃の種類はSQLiです（`UNION SELECT username, password`のペイロードによります）
    * パラメータ`user`が攻撃の対象です
    * リクエストで提供された追加情報はリクエスト文字列パラメータ `token=IyEvYmluL3NoCg`です（おそらくアプリケーションがユーザーを認証するために使用されているでしょう）
2. 収集した情報を使用して、**アクティブな脅威検証** モジュールは元の攻撃対象だったエンドポイントへの約100-150のテストリクエストのリストを作成しますが、それらは同種の攻撃（SQLiなど）に対して異なる種類の悪意のあるペイロードを使用します。例えば:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=1')+WAITFOR+DELAY+'0 indexpt'+AND+('wlrm'='wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1+AND+SLEEP(10)--+wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1);SELECT+PG_SLEEP(10)--
    https://example.com/login?token=IyEvYmluL3NoCg&user=1'+OR+SLEEP(10)+AND+'wlrm'='wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1+AND+1=(SELECT+1+FROM+PG_SLEEP(10))
    https://example.com/login?token=IyEvYmluL3NoCg&user=%23'%23\x22%0a-sleep(10)%23
    https://example.com/login?token=IyEvYmluL3NoCg&user=1';+WAITFOR+DELAY+'0code:10'--
    https://example.com/login?token=IyEvYmluL3NoCg&user=1%27%29+OR+SLEEP%280%29+AND+%28%27wlrm%27%3D%27wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=SLEEP(10)/*'XOR(SLEEP(10))OR'|\x22XOR(SLEEP(10))OR\x22*/
    ```

    !!! info "悪意のあるペイロードはリソースを損ないません"
        生成されたリクエストの悪意のあるペイロードには実際の悪意ある構文は含まれません、それらはただ攻撃の原理を模倣することを意図しています。その結果、リソースに損害はありません。
3. **アクティブな脅威検証** モジュールは生成されたテストリクエストをWallarm保護をバイパスしてアプリケーションに送信し（[許可リスト機能][allowlist-scanner-addresses]を使用して）、特定のエンドポイントでアプリケーションが特定の攻撃タイプに対して脆弱でないことを確認します。モジュールはアプリケーションに実際のセキュリティ脆弱性があると疑われる場合、[インシデント](../user-guides/events/check-attack.md#incidents)タイプのイベントを作成します。

    !!! info "リクエストの `User-Agent` HTTPSヘッダー値"
        **アクティブな脅威検証**モジュールのリクエストにおける`User-Agent`HTTPヘッダーは `Wallarm Threat-Verification (v1.x)`という値を持つことになります。
4. 検出されたセキュリティインシデントはWallarmコンソールで報告され、利用可能なサードパーティーの[インテグレーション](../user-guides/settings/integrations/integrations-intro.md)や[トリガー](../user-guides/triggers/triggers.md)を経由してあなたのセキュリティチームに通知することが可能です。