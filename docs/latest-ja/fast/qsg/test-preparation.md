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

[anchor1]:  #1-基準リクエストの準備                       
[anchor2]:  #2-xss脆弱性に対象したテストポリシーの作成
   
    
#   テストのための環境設定

この章では、Google GruyereアプリケーションのXSS脆弱性を検出するためのFASTの設定手順を説明します。必要なすべての手順を完了したら、HTTPS基準リクエストをFASTノードを経由してプロキシし、XSS脆弱性を見つけることができるようになります。

セキュリティテストセットを生成するためには、Wallarm FASTが以下を要求します：
* 基準リクエストをプロキシするFASTノードのデプロイ
* FASTノードとWallarmクラウドの接続 
* 基準リクエスト
* テストポリシー

[前の章][link-previous-chapter]でFASTノードのデプロイとクラウド接続に成功したことになります。この章では、[テストポリシー][gl-testpolicy]と基準リクエストの作成に焦点を当てます。

![使用するテストスキーム][img-test-scheme]

!!! info "テストポリシーの作成"
    テスト対象の各アプリケーションごとに専用のポリシーを作成することを強くお勧めします。ただし、Wallarmクラウドが自動的に作成するデフォルトのポリシーを使用することもできます。このドキュメントでは、専用のポリシーの作成手順を説明しますが、デフォルトのポリシーはこのガイドの対象外です。

テスト用の環境を設定するには、以下の手順を実行します：

1.  [基準リクエストの準備][anchor1]
2.  [XSS脆弱性に対象したテストポリシーの作成][anchor2]
   
!!! info "ターゲットアプリケーション"
    現在の例では、[Google Gruyere][link-https-google-gruyere]をターゲットアプリケーションとして使用しています。あなたのローカルアプリケーションに対して基準リクエストを構築する場合は、Google Gruyereのアドレスの代わりに、このアプリケーションを実行しているマシンのIPアドレスを使用してください。
    
    IPアドレスを取得するには、`ifconfig`や`ip addr`のようなツールを使用できます。

 ##  1.  基準リクエストの準備

1.  提供される基準リクエストは[Google Gruyere][link-https-google-gruyere]アプリケーションに対象しているため、まずはアプリケーションのインスタンスを作成し、そのインスタンスの一意の識別子を取得する必要があります。

    それには、この[リンク][link-https-google-gruyere-start]にナビゲートしてください。Google Gruyereのインスタンスの識別子が与えられますので、コピーしてください。利用規約を読み、**同意して開始**ボタンを選択します。

    ![Google Gruyereの開始ページ][img-google-gruyere-startpage]

    隔離されたGoogle Gruyereのインスタンスが実行されます。次のアドレスでアクセス可能になります：

    `https://google-gruyere.appspot.com/<あなたのインスタンスID>/`

2.  Google Gruyereアプリケーションのインスタンスに対する基準リクエストを構築します。このガイドでは、合法的なリクエストを使用することを提案します。

    リクエストは次のとおりです：

    ```
    https://google-gruyere.appspot.com/<あなたのインスタンスID>/snippets.gtl?password=paSSw0rd&uid=123
    ```

    !!! info "リクエストの例"
        <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>
   
##  2.  XSS脆弱性に対象したテストポリシーの作成

1.  [ワイルラームポータル][link-wl-console]にログインします。[以前][link-previous-chapter]作成したアカウントを使用します。

2.  「テストポリシー」タブを選択し、**テストポリシー作成**ボタンをクリックします。

    ![テストポリシーの作成][img-policy-screen]

3.  「一般」タブにて、ポリシーに意味のある名前と説明を設定します。このガイドでは、`DEMO POLICY`という名前を使用することを提案します。

    ![テストポリシーウィザード："一般"タブ.][img-wizard-general]

4.  「挿入点」タブにて、セキュリティテストセットのリクエスト生成プロセス中に処理が可能な[基準リクエスト要素][gl-element]を設定します。このガイドの目的のためには、すべてのGETパラメーターの処理を許可するだけで十分です。これを許可するには、「含める場所」ブロックに`GET_.*`表現を追加してください。ポリシーを作成する際、FASTは一部のパラメーターの処理をデフォルトで許可します。それらは「ー」記号を使用して削除できます。

    ![テストポリシーウィザード："挿入点"タブ.][img-wizard-insertion-points]

5. 「攻撃テスト」タブで、ターゲットアプリケーションの脆弱性を悪用する一種の攻撃、すなわちXSSを選択します。

6.  最右の列にあるポリシープレビューが以下のようになっていることを確認します：

    ```
    X-Wallarm-Test-Policy: 
    type=xss; 
    insertion=include:'GET_.*'; 
    ```

7.  **保存**ボタンを選択してポリシーを保存します。

8.  **テストポリシーに戻る**ボタンを選択してテストポリシーリストに戻ります。
    
    
!!! info "テストポリシーの詳細"
    テストポリシーについての詳細情報は、[リンク][doc-policy-in-detail]からご覧いただけます。

以上で、Google GruyereアプリケーションへのHTTPS基準リクエストと、XSS脆弱性に対象したテストポリシーの2つの目標をすべて達成したはずです。