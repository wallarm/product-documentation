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

# テスト環境の設定

本章では、Google GruyereアプリケーションにおけるXSS脆弱性を検出するためにFASTを構成する手順を案内します。必要なすべての手順を完了すると、HTTPS基準リクエストをFASTノード経由でプロキシし、XSS脆弱性を検出する準備が整います。

セキュリティテストセットを生成するために、Wallarm FASTは以下が必要です：
* プロキシとして機能する基準リクエスト用のデプロイ済みFASTノード
* Wallarm Cloudに接続されたFASTノード
* 基準リクエスト
* テストポリシー

前章でFASTノードを正常にデプロイし、Wallarm Cloudに接続しました。本章では[テストポリシー][gl-testpolicy]と基準リクエストの作成に焦点を当てます。

![利用中のテストスキーム][img-test-scheme]

!!! info "Creating a test policy"  
    テスト対象の各アプリケーションに専用のポリシーを作成することを強く推奨します。しかしながら、Wallarm Cloudが自動的に作成するデフォルトポリシーを利用することも可能です。本書では専用ポリシーの作成手順を案内します。なお、デフォルトポリシーの詳細は本ガイドの対象外です。

テスト環境を設定するために、以下の手順を実行します：

1.  [基準リクエストの準備][anchor1]
2.  [XSS脆弱性を対象としたテストポリシーの作成][anchor2]
    
!!! info "Target application"  
    現在の例では対象アプリケーションとして[Google Gruyere][link-https-google-gruyere]を使用します。ローカルのアプリケーションに対して基準リクエストを構築する場合は、Google Gruyereのアドレスの代わりに、このアプリケーションを実行しているマシンのIPアドレスを使用してください。  
    
    IPアドレスを取得するには、`ifconfig`や`ip addr`などのツールを使用してください。
        
##  1.  基準リクエストの準備

1.  提供された基準リクエストは[Google Gruyere][link-https-google-gruyere]アプリケーションを対象としているため、まずアプリケーションのサンドボックスインスタンスを作成してください。その後、インスタンスのユニークな識別子を取得してください。
    
    そのためには、この[リンク][link-https-google-gruyere-start]にアクセスしてください。そこでGoogle Gruyereインスタンスの識別子が表示されるので、コピーしてください。利用規約をお読みになり、**Agree & Start**ボタンを選択してください。
    
    ![Google Gruyereスタートページ][img-google-gruyere-startpage]

    サンドボックス化されたGoogle Gruyereインスタンスが稼働し、以下のアドレスでアクセス可能になります：
    
    `https://google-gruyere.appspot.com/<your instance ID>/`

2.  自身のGoogle Gruyereアプリケーションインスタンスに向けて基準リクエストを構築してください。本ガイドでは正規のリクエストを使用することを推奨します。

    リクエストは以下の通りです：
    
    ```
    https://google-gruyere.appspot.com/<your instance ID>/snippets.gtl?password=paSSw0rd&uid=123
    ```

    !!! info "Example of a request"  
        <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>
    
##  2.  XSS脆弱性を対象としたテストポリシーの作成

1.  以前に作成したアカウントを使用して[My Wallarm portal][link-wl-console]にログインしてください。

2.  “Test policies”タブを選択し、**Create test policy**ボタンをクリックしてください。

    ![テストポリシー作成画面][img-policy-screen]

3.  “General”タブでポリシーの名称と説明を適切に設定してください。本ガイドでは`DEMO POLICY`の名称を使用することを推奨します。

    ![テストポリシーウィザード： “General”タブ.][img-wizard-general]

4.  “Insertion points”タブで、セキュリティテストセットのリクエスト生成時に処理対象となる[基準リクエスト要素][gl-element]を設定してください。本ガイドの目的のためには、すべてのGETパラメータの処理を許可するだけで十分です。これを実現するために、“Where to include”ブロックに`GET_.*`式を追加してください。ポリシー作成時、FASTはデフォルトで一部のパラメータを処理するため、必要に応じて«—»記号を使用して削除してください。

    ![テストポリシーウィザード： “Insertion points”タブ.][img-wizard-insertion-points]

5.  “Attacks to test”タブで、対象アプリケーションの脆弱性を悪用する攻撃タイプとしてXSSを選択してください。

6.  右側のカラムに表示されるポリシープレビューが以下のようになっていることを確認してください：
    
    ```
    X-Wallarm-Test-Policy: 
    type=xss; 
    insertion=include:'GET_.*'; 
    ```

7.  **Save**ボタンを選択してポリシーを保存してください。

8.  **Back to test policies**ボタンを選択してテストポリシー一覧に戻ってください。
    
    
!!! info "Test policy details"  
    テストポリシーの詳細情報は[こちら][doc-policy-in-detail]に記載されています。

これで、Google Gruyereアプリケーションに対するHTTPS基準リクエストとXSS脆弱性を対象としたテストポリシーの作成という、本章のすべての目標が達成されました。