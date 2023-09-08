[img-new-local-repo]:                   ../../../../images/integration-guides/repo-mirroring/centos/common/new-local-repo.png
[img-artifactory-repo-settings]:        ../../../../images/integration-guides/repo-mirroring/centos/common/new-local-repo-settings.png
[img-import-into-artifactory]:          ../../../../images/integration-guides/repo-mirroring/centos/common/import-repo-into-artifactory.png
[img-local-repo-ok]:                    ../../../../images/integration-guides/repo-mirroring/centos/common/local-repo-ok.png

[link-jfrog-installation]:              https://www.jfrog.com/confluence/display/RTF/Installing+on+Linux+Solaris+or+Mac+OS
[link-jfrog-comparison-matrix]:         https://www.jfrog.com/confluence/display/RTF/Artifactory+Comparison+Matrix
[link-artifactory-naming-agreement]:    https://jfrog.com/whitepaper/best-practices-structuring-naming-artifactory-repositories/

[doc-installation-from-artifactory]:    how-to-use-mirrored-repo.md

[anchor-fetch-repo]:                    #1-ウォールアームリポジトリのローカルコピーを作成する
[anchor-setup-repo-artifactory]:        #2-JFrog Artifactory内でローカルRPMリポジトリを作成する
[anchor-import-repo]:                   #3-ローカルのウォールアームリポジトリをJFrog Artifactoryに取り込む


#   CentOS用ウォールアームリポジトリのミラーリング方法

ウォールアームリポジトリのローカルコピー（*ミラー*とも呼ばれます）を作成して利用することで、インフラストラクチャ内のすべてのフィルターノードが単一のソースからデプロイされ、同じバージョン番号になることを確認できます。

このドキュメントでは、JFrog Artifactoryリポジトリマネージャを介したCentOS 7サーバー用ウォールアームリポジトリのミラーリングプロセスを説明します。


!!! info "事前準備"
    以下の条件を満たしてから次のステップを進めてください：
    
    *   サーバーに以下のコンポーネントがインストールされています：
    
        *   CentOS 7オペレーティングシステム
        *   `yum-utils`と`epel-release`パッケージ
        *   RPMリポジトリを作成可能なJFrog Artifactoryソフトウェア ([インストール手順][link-jfrog-installation])
            
            JFrog Artifactoryのエディションと機能については[こちら][link-jfrog-comparison-matrix]を参照してください。
        
    *   JFrog Artifactoryが稼働しています。
    *   サーバーはインターネット接続があります。


ウォールアームリポジトリのミラーリングには、以下が含まれます
1.  [ウォールアームリポジトリのローカルコピーを作成する][anchor-fetch-repo]
2.  [JFrog Artifactory内でローカルRPMリポジトリを作成する][anchor-setup-repo-artifactory]
3.  [ローカルのウォールアームリポジトリをJFrog Artifactoryに取り込む][anchor-import-repo]

##  1.  ウォールアームリポジトリのローカルコピーを作成する

ウォールアームリポジトリのローカルコピーを作成するには、以下の手順を実行します：
1.  以下のコマンドを実行してウォールアームリポジトリを追加します：

    ```bash
    sudo rpm --install https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
    ```

2.  一時ディレクトリ（例：`/tmp`）へ移動し、以下のコマンドを実行してこのディレクトリにウォールアームリポジトリを同期させます：

    ```bash
    reposync -r wallarm-node -p .
    ```

`reposync`コマンドが正常に終了した場合、ウォールアームパッケージは一時ディレクトリの`wallarm-node/Packages`サブディレクトリ（例：`/tmp/wallarm-node/Packages`）に置かれます。 


##  2.  JFrog Artifactory内でローカルRPMリポジトリを作成する

JFrog Artifactory内でローカルRPMリポジトリを作成するには、以下の手順を実行します：
1.  ドメイン名またはIPアドレス（例：`http://jfrog.example.local:8081/artifactory`）でJFrog ArtifactoryウェブUIへ移動します。

    管理者アカウントでウェブUIにログインします。

2.  *Admin*メニュー項目をクリックし、その後*Repositories*セクションの*Local*リンクをクリックします。

3.  新しいローカルリポジトリを作成するために*New*ボタンをクリックします。

    ![ローカルリポジトリの新規作成][img-new-local-repo]

4.  パッケージタイプに“RPM”を選択します。

5.  *Repository Key*フィールドにリポジトリ名を入力します。この名前はJFrog Artifactory内で一意である必要があります。[Artifactoryリポジトリの命名規則][link-artifactory-naming-agreement]に従った名前の選択をお勧めします（例：`wallarm-centos-upload-local`）。

    *Repository* Layoutのドロップダウンリストから“maven-2-default”レイアウトを選択します。
    
    他の設定はそのままにしておいて構いません。

    ローカルArtifactoryリポジトリを作成するために*Save & Finish*ボタンをクリックします。
    
    ![リポジトリ設定][img-artifactory-repo-settings]

    これで、新しく作成されたリポジトリがローカルリポジトリリストに表示されるはずです。

ウォールアームリポジトリのミラーリングを完了するには、同期パッケージをローカルArtifactoryリポジトリに[取り込みます][anchor-fetch-repo]。


##  3.  ローカルのウォールアームリポジトリをJFrog Artifactoryに取り込む

ArtifactoryのローカルRPMリポジトリにウォールアームパッケージを取り込むには、以下の手順を実行します：
1.  管理者アカウントでJFrog ArtifactoryウェブUIにログインします。

2.  *Admin*メニュー項目をクリックし、その後*Import & Export*セクションの*Repositories*リンクをクリックします。

3.  *Import Repository from Path*セクションで、*Repository from Path*ドロップダウンリストから先ほど[こちらで作成した][anchor-setup-repo-artifactory]ローカルリポジトリを選択します。

4.  *Browse*ボタンをクリックし、先ほど[作成した][anchor-fetch-repo]ウォールアームパッケージがあるディレクトリを選択します。

5.  *Import*ボタンをクリックしてディレクトリからウォールアームパッケージを取り込みます。

    ![パッケージの取り込み][img-import-into-artifactory]
    
6.  *Artifacts*メニュー項目をクリックし、所望のローカルリポジトリにインポートしたウォールアームパッケージが存在することを確認します。

    ![リポジトリ内のパッケージ][img-local-repo-ok]
    


これで、ウォールアームリポジトリのローカルミラーを使用して[Wallarmフィルターノードをデプロイできるようになります][doc-installation-from-artifactory]。
