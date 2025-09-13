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


#   CentOS向けWallarmリポジトリをミラーする方法

インフラ内のすべてのNGINXフィルタノードが単一のソースからデプロイされ、同じバージョン番号になるように、Wallarmリポジトリのローカルコピー（ミラーとも呼ばれます）を作成して使用できます。

本ドキュメントでは、JFrog Artifactoryリポジトリマネージャーを使用して、CentOS 7サーバー向けにWallarmリポジトリをミラーリングする手順を説明します。


!!! info "前提条件"
    次の手順に進む前に、以下の条件を満たしていることを確認します。
    
    *   サーバーに以下のコンポーネントがインストールされています:
    
        *   CentOS 7オペレーティングシステム
        *   `yum-utils`および`epel-release`パッケージ
        *   RPMリポジトリを作成可能なJFrog Artifactoryソフトウェア（[インストール手順][link-jfrog-installation]）
            
            JFrog Artifactoryのエディションと機能の詳細は[こちら][link-jfrog-comparison-matrix]をご覧ください。
        
    *   JFrog Artifactoryが稼働中です。
    *   サーバーがインターネットにアクセス可能です。


Wallarmリポジトリのミラーリングは次の手順から構成されます。
1.  [Wallarmリポジトリのローカルコピーの作成][anchor-fetch-repo]
2.  [JFrog ArtifactoryでのローカルRPMリポジトリの作成][anchor-setup-repo-artifactory]
3.  [WallarmリポジトリのローカルコピーをJFrog Artifactoryにインポート][anchor-import-repo]

##  1.  Wallarmリポジトリのローカルコピーの作成

Wallarmリポジトリのローカルコピーを作成するには、次を実行します:
1.  次のコマンドを実行してWallarmリポジトリを追加します:

    ```bash
    sudo rpm --install https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```

2.  一時ディレクトリ（例: `/tmp`）に移動し、次のコマンドを実行してWallarmリポジトリをこのディレクトリに同期します:

    ```bash
    reposync -r wallarm-node -p .
    ```

`reposync`コマンドが正常に終了すると、Wallarmパッケージは一時ディレクトリの`wallarm-node/Packages`サブディレクトリ（例: `/tmp/wallarm-node/Packages`）に配置されます。 


##  2.  JFrog ArtifactoryでのローカルRPMリポジトリの作成

JFrog ArtifactoryでローカルRPMリポジトリを作成するには、次を実行します:
1.  ドメイン名またはIPアドレス（例: `http://jfrog.example.local:8081/artifactory`）でJFrog Artifactoryのweb UIにアクセスします。

    管理者アカウントでweb UIにログインします。

2.  *Admin*メニューをクリックし、*Repositories*セクションの*Local*リンクをクリックします。

3.  *New*ボタンをクリックして新しいローカルリポジトリを作成します。

    ![新しいローカルリポジトリの作成][img-new-local-repo]

4.  “RPM”パッケージタイプを選択します。

5.  *Repository Key*フィールドにリポジトリ名を入力します。この名前はJFrog Artifactory内で一意である必要があります。[Artifactoryリポジトリ命名のベストプラクティス][link-artifactory-naming-agreement]に準拠した名前（例: `wallarm-centos-upload-local`）を選択することを推奨します。

    ドロップダウンリストの*Repository* Layoutから“maven-2-default”レイアウトを選択します。
    
    その他の設定は変更せずにそのままでかまいません。

    *Save & Finish*ボタンをクリックしてローカルArtifactoryリポジトリを作成します。
    
    ![リポジトリの設定][img-artifactory-repo-settings]

    これで、新しく作成したリポジトリがローカルリポジトリ一覧に表示されます。

Wallarmリポジトリのミラーリングを完了するには、ローカルArtifactoryリポジトリに[同期したパッケージをインポート][anchor-fetch-repo]します。


##  3.  WallarmリポジトリのローカルコピーをJFrog Artifactoryにインポート

WallarmパッケージをArtifactoryのローカルRPMリポジトリにインポートするには、次を実行します:
1.  管理者アカウントでJFrog Artifactoryのweb UIにログインします。

2.  *Admin*メニューをクリックし、*Import & Export*セクションの*Repositories*リンクをクリックします。

3.  *Import Repository from Path*セクションで、*Repository from Path*ドロップダウンリストから、以前[作成した][anchor-setup-repo-artifactory]ローカルリポジトリを選択します。

4.  *Browse*ボタンをクリックし、以前[作成した][anchor-fetch-repo]Wallarmパッケージを含むディレクトリを選択します。

5.  *Import*ボタンをクリックして、そのディレクトリからWallarmパッケージをインポートします。

    ![パッケージのインポート][img-import-into-artifactory]
    
6.  *Artifacts*メニューをクリックし、インポートしたWallarmパッケージが目的のローカルリポジトリに存在することを確認します。

    ![リポジトリ内のパッケージ][img-local-repo-ok]
    


これで、Wallarmリポジトリのローカルミラーを使用して[Wallarmフィルタノードをデプロイ][doc-installation-from-artifactory]できます。