[img-new-local-repo]:                   ../../../../images/integration-guides/repo-mirroring/centos/common/new-local-repo.png
[img-artifactory-repo-settings]:        ../../../../images/integration-guides/repo-mirroring/centos/common/new-local-repo-settings.png
[img-import-into-artifactory]:          ../../../../images/integration-guides/repo-mirroring/centos/common/import-repo-into-artifactory.png
[img-local-repo-ok]:                    ../../../../images/integration-guides/repo-mirroring/centos/common/local-repo-ok.png

[link-jfrog-installation]:              https://www.jfrog.com/confluence/display/RTF/Installing+on+Linux+Solaris+or+Mac+OS
[link-jfrog-comparison-matrix]:         https://www.jfrog.com/confluence/display/RTF/Artifactory+Comparison+Matrix
[link-artifactory-naming-agreement]:    https://jfrog.com/whitepaper/best-practices-structuring-naming-artifactory-repositories/

[doc-installation-from-artifactory]:    how-to-use-mirrored-repo.md

[anchor-fetch-repo]:                    #1-creating-a-local-copy-of-the-wallarm-repository
[anchor-setup-repo-artifactory]:        #2-creating-a-local-rpm-repository-in-jfrog-artifactory
[anchor-import-repo]:                   #3-importing-the-local-copy-of-the-wallarm-repository-into-jfrog-artifactory

# CentOS向けWallarmリポジトリのミラーリング方法

Wallarmリポジトリのローカルコピー（*mirror*とも呼ばれます）を作成および利用することで、インフラ内のすべてのNGINXフィルターノードが単一のソースから展開され、同一バージョン番号を持つことを保証できます。

本ドキュメントでは、JFrog Artifactoryリポジトリマネージャを介してCentOS 7サーバ上でWallarmリポジトリをミラーリングする手順を説明します。

!!! info "前提条件"
    次の条件がすべて満たされていることを確認してください:
    
    *   サーバに以下のコンポーネントがインストール済みであること:
    
        *   CentOS 7オペレーティングシステム
        *   `yum-utils`および`epel-release`パッケージ
        *   RPMリポジトリ作成が可能なJFrog Artifactoryソフトウェア ([installation instructions][link-jfrog-installation])
            
            JFrog Artifactoryのエディションおよび機能の詳細については[こちら][link-jfrog-comparison-matrix]をご覧ください。
        
    *   JFrog Artifactoryが正常に稼働していること
    *   サーバがインターネットに接続できること


Wallarmリポジトリのミラーリングは、以下の手順で構成されます:
1.  [Wallarmリポジトリのローカルコピーを作成][anchor-fetch-repo]
2.  [JFrog ArtifactoryにローカルRPMリポジトリを作成][anchor-setup-repo-artifactory]
3.  [WallarmリポジトリのローカルコピーをJFrog Artifactoryにインポート][anchor-import-repo]

## 1. Wallarmリポジトリのローカルコピーを作成

Wallarmリポジトリのローカルコピーを作成する手順は以下の通りです:
1.  次のコマンドを実行して、Wallarmリポジトリを追加します:

    ```bash
    sudo rpm --install https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```

2.  一時ディレクトリ（例: `/tmp`）に移動し、次のコマンドを実行してWallarmリポジトリをこのディレクトリに同期します:

    ```bash
    reposync -r wallarm-node -p .
    ```

`reposync`コマンドが正常に終了すれば、一時ディレクトリ内の`wallarm-node/Packages`サブディレクトリにWallarmパッケージが配置されます。


## 2. JFrog ArtifactoryにローカルRPMリポジトリを作成

JFrog ArtifactoryにローカルRPMリポジトリを作成する手順は以下の通りです:
1.  ドメイン名またはIPアドレス（例: `http://jfrog.example.local:8081/artifactory`）を使用して、JFrog Artifactoryのweb UIにアクセスします。

    管理者アカウントでweb UIにログインしてください。

2.  *Admin*メニュー項目をクリックし、*Repositories*セクション内の*Local*リンクをクリックします。

3.  *New*ボタンをクリックして、新しいローカルリポジトリを作成します。

    ![Creating a new local repository][img-new-local-repo]

4.  「RPM」パッケージタイプを選択します。

5.  *Repository Key*フィールドにリポジトリ名を入力します。この名前はJFrog Artifactory内で一意でなければなりません。[Artifactory repositories naming best practices][link-artifactory-naming-agreement]に準拠した名前（例: `wallarm-centos-upload-local`）の使用を推奨します。

    *Repository* Layoutドロップダウンリストから「maven-2-default」レイアウトを選択してください。
    
    他の設定は変更せずそのままで構いません。

    *Save & Finish*ボタンをクリックして、Artifactoryのローカルリポジトリを作成します。
    
    ![Repository settings][img-artifactory-repo-settings]

    作成されたリポジトリがローカルリポジトリ一覧に表示されるはずです。

Wallarmリポジトリのミラーリングを完了するには、ローカルArtifactoryリポジトリに[同期済みパッケージをインポート][anchor-fetch-repo]してください。


## 3. WallarmリポジトリのローカルコピーをJFrog Artifactoryにインポート

WallarmパッケージをArtifactoryのローカルRPMリポジトリにインポートする手順は以下の通りです:
1.  管理者アカウントでJFrog Artifactoryのweb UIにログインします。

2.  *Admin*メニュー項目をクリックし、*Import & Export*セクション内の*Repositories*リンクをクリックします。

3.  *Import Repository from Path*セクションで、*Repository from Path*ドロップダウンリストから[前に作成したローカルリポジトリ][anchor-setup-repo-artifactory]を選択します。

4.  *Browse*ボタンをクリックし、[前に作成したWallarmパッケージのディレクトリ][anchor-fetch-repo]を選択します。

5.  *Import*ボタンをクリックして、ディレクトリ内のWallarmパッケージをインポートします。

    ![Importing packages][img-import-into-artifactory]
    
6.  *Artifacts*メニュー項目をクリックし、対象のローカルリポジトリにインポートされたWallarmパッケージが存在することを確認します。

    ![Packages in the repository][img-local-repo-ok]
    

これで、ローカルミラーリングされたWallarmリポジトリを用いて[Wallarmフィルターノードを展開][doc-installation-from-artifactory]できます。