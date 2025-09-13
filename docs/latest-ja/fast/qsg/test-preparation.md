[img-test-scheme]:                  ../../images/fast/qsg/en/test-preparation/12-qsg-fast-test-prep-scheme.png
[img-google-gruyere-startpage]:     ../../images/fast/qsg/common/test-preparation/13-qsg-fast-test-prep-gruyere.png
[img-policy-screen]:                ../../images/fast/qsg/common/test-preparation/14-qsg-fast-test-prep-policy-screen.png
[img-wizard-general]:               ../../images/fast/qsg/common/test-preparation/15-qsg-fast-test-prep-policy-wizard-general.png
[img-wizard-insertion-points]:      ../../images/fast/qsg/common/test-preparation/16-qsg-fast-test-prep-policy-wizard-ins-points.png

[link-previous-chapter]:            deployment.md
[link-https-google-gruyere]:        https://google-gruyere.appspot.com
[link-https-google-gruyere-start]:  https://google-gruyere.appspot.com/start
[link-wl-console]:                  https://us1.my.wallarm.com

[doc-policy-in-detail]:             ../operations/test-policy/overview.md

[gl-element]:                       ../terms-glossary.md#baseline-request-element
[gl-testpolicy]:                    ../terms-glossary.md#test-policy

[anchor1]:  #1-prepare-the-baseline-request                       
[anchor2]:  #2-create-a-test-policy-targeted-at-xss-vulnerabilities
    
    
#   テストのための環境設定

本章では、Google GruyereアプリケーションにおけるXSS脆弱性を検出するためにFASTを構成する手順をご案内します。必要な手順をすべて完了すると、XSS脆弱性を見つけるためにHTTPSのベースラインリクエストをFAST node経由でプロキシする準備が整います。

セキュリティテストセットを生成するには、Wallarm FASTには以下が必要です:
* ベースラインリクエストをプロキシする展開済みのFAST node
* FAST nodeとWallarm cloudの接続
* ベースラインリクエスト
* テストポリシー

[前の章][link-previous-chapter]でFAST nodeを正常にデプロイし、クラウドに接続しました。本章では、[テストポリシー][gl-testpolicy]とベースラインリクエストの作成に注力します。

![使用するテストスキーム][img-test-scheme]

!!! info "テストポリシーの作成"
    テスト対象の各アプリケーションごとに専用のポリシーを作成することを強く推奨します。ただし、Wallarm cloudによって自動作成されるデフォルトポリシーを利用することもできます。本ドキュメントでは専用ポリシーの作成手順をご案内し、デフォルトポリシーの説明は本ガイドの範囲外です。
    
テスト用の環境を構築するには、次を実施します:

1.  [ベースラインリクエストを準備する][anchor1]
2.  [XSS脆弱性を対象としたテストポリシーを作成する][anchor2]
    
!!! info "対象アプリケーション"
    現在の例では、[Google Gruyere][link-https-google-gruyere]を対象アプリケーションとして使用します。ローカルアプリケーション向けにベースラインリクエストを作成する場合は、Google Gruyereのアドレスではなく、そのアプリケーションを実行しているマシンのIPアドレスを使用してください。
    
    IPアドレスを取得するには、`ifconfig`や`ip addr`などのツールを使用できます。
        
##  1.  ベースラインリクエストを準備する

1.  用意するベースラインリクエストは[Google Gruyere][link-https-google-gruyere]アプリケーションを対象とします。そのため、最初に当該アプリケーションのサンドボックス化されたインスタンスを作成します。次に、そのインスタンスの一意の識別子を取得します。
    
    そのためには、この[リンク][link-https-google-gruyere-start]にアクセスします。Google Gruyereインスタンスの識別子が表示されますので、コピーしてください。利用規約を読み、**Agree & Start**ボタンを選択します。
    
    ![Google Gruyereスタートページ][img-google-gruyere-startpage]

    隔離されたGoogle Gruyereインスタンスが起動します。次のアドレスでアクセスできるようになります:
    
    `https://google-gruyere.appspot.com/<your instance ID>/`

2.  Google Gruyereアプリケーションの自身のインスタンスに対するベースラインリクエストを作成します。     本ガイドでは正当なリクエストを使用することを推奨します。

    リクエストは次のとおりです:

    ```
    https://google-gruyere.appspot.com/<your instance ID>/snippets.gtl?password=paSSw0rd&uid=123
    ```

    !!! info "リクエストの例"
        <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>
    
##  2.  XSS脆弱性を対象としたテストポリシーを作成する

1.  [前の章][link-previous-chapter]で作成したアカウントを使用して、[My Wallarm portal][link-wl-console]にログインします。

2.  “Test policies”タブを選択し、**Create test policy**ボタンをクリックします。

    ![テストポリシーの作成][img-policy-screen]

3.  “General”タブで、ポリシーに意味のある名前と説明を設定します。本ガイドでは、名前に`DEMO POLICY`を使用することを提案します。 

    ![テストポリシーウィザード: “General”タブ。][img-wizard-general]

4.  “Insertion points”タブで、セキュリティテストセットのリクエスト生成時に処理対象とする[ベースラインリクエスト要素][gl-element]を設定します。本ガイドの目的には、すべてのGETパラメータの処理を許可すれば十分です。これを許可するには、“Where to include”ブロックに`GET_.*`という式を追加してください。ポリシーを作成する際、FASTは既定で一部のパラメータを処理可能にします。これらは«—»シンボルを使用して削除できます。

    ![テストポリシーウィザード: “Insertion points”タブ。][img-wizard-insertion-points]

5.  “Attacks to test”タブで、対象アプリケーションの脆弱性を突く攻撃タイプを1つ選択します—XSS。

6.  一番右の列にあるポリシープレビューが次のようになっていることを確認します:

    ```
    X-Wallarm-Test-Policy: 
    type=xss; 
    insertion=include:'GET_.*'; 
    ```

7.  **Save**ボタンを選択してポリシーを保存します。

8.  **Back to test policies**ボタンを選択してテストポリシー一覧に戻ります。
    
    
!!! info "テストポリシーの詳細"
    テストポリシーの詳細情報は[リンク][doc-policy-in-detail]からご覧いただけます。

これで、本章の目標はすべて完了し、Google Gruyereアプリケーション宛てのHTTPSベースラインリクエストと、XSS脆弱性を対象としたテストポリシーが用意できました。