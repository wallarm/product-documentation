[img-new-local-repo]:                   ../../../../images/integration-guides/repo-mirroring/centos/common/new-local-repo.png
[img-artifactory-repo-settings]:        ../../../../images/integration-guides/repo-mirroring/centos/common/new-local-repo-settings.png
[img-import-into-artifactory]:          ../../../../images/integration-guides/repo-mirroring/centos/common/import-repo-into-artifactory.png
[img-local-repo-ok]:                    ../../../../images/integration-guides/repo-mirroring/centos/common/local-repo-ok.png

[link-jfrog-installation]:              https://www.jfrog.com/confluence/display/RTF/Installing+on+Linux+Solaris+or+Mac+OS
[link-jfrog-comparison-matrix]:         https://www.jfrog.com/confluence/display/RTF/Artifactory+Comparison+Matrix
[link-artifactory-naming-agreement]:    https://jfrog.com/whitepaper/best-practices-structuring-naming-artifactory-repositories/

[doc-installation-from-artifactory]:    how-to-use-mirrored-repo.md

[anchor-fetch-repo]:                    #1-wallarm-リポジトリのローカルコピーを作成する
[anchor-setup-repo-artifactory]:        #2-JFrog-アーティファクトリーでローカル-RPMリポジトリを作成する
[anchor-import-repo]:                   #3-ローカル-Wallarm-リポジトリのコピーを-JFrog-artifactoryにインポートする

#   WallarmリポジトリをCentOS用にミラーリングする方法

あなたは、インフラのすべてのフィルタノードが同じソースからデプロイされ、同じバージョン番号であることを確認するために、Wallarmリポジトリのローカルコピー（*ミラー*とも呼ばれる）を作成して使用することができます。

このドキュメントでは、JFrog Artifactoryリポジトリマネージャを使用して、CentOS 7サーバ用のWallarmリポジトリのミラーリングを行う手順について説明します。

!!! info "前提条件"
    以下の条件が満たされていることを確認してから、次のステップに進んでください。

    *   サーバに以下のコンポーネントがインストールされています。

        *   CentOS 7オペレーティングシステム
        *   `yum-utils`および`epel-release`パッケージ
        *   RPMリポジトリの作成が可能なJFrog Artifactoryソフトウェア（[インストール手順][link-jfrog-installation]）

            JFrog Artifactoryのエディションと機能について[こちら][link-jfrog-comparison-matrix]で詳細を確認してください。

    *   JFrog Artifactoryが起動して稼働しています。
    *   サーバーはインターネットに接続されています。

Wallarmリポジトリのミラーリングは、次のような構成になります。
1.  [Wallarmリポジトリのローカルコピーを作成する][anchor-fetch-repo]
2.  [JFrog ArtifactoryでローカルRPMリポジトリを作成する][anchor-setup-repo-artifactory]
3.  [ローカルのWallarmリポジトリのコピーをJFrog Artifactoryにインポートする][anchor-import-repo]

##  1.  Wallarmリポジトリのローカルコピーを作成する

Wallarmリポジトリのローカルコピーを作成するには、以下の手順を実行します。
1.  次のコマンドを実行して、Wallarmリポジトリを追加します。

    ```bash
    sudo rpm --install https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
    ```

2.  一時ディレクトリ（例：`/tmp`）に移動し、次のコマンドを実行して、Wallarmリポジトリをこのディレクトリに同期させます。

    ```bash
    reposync -r wallarm-node -p .
    ```

`reposync`コマンドが正常に終了すると、Wallarmパッケージが一時ディレクトリ（例：`/tmp/wallarm-node/Packages`）の`wallarm-node/Packages`サブディレクトリに配置されます。

##  2.  JFrog ArtifactoryでローカルRPMリポジトリを作成する

JFrog ArtifactoryでローカルRPMリポジトリを作成するには、以下の手順を実行します。
1.  ドメイン名またはIPアドレス（例：`http://jfrog.example.local:8081/artifactory`）を使用して、JFrog Artifactory Web UIに移動します。

    管理者アカウントでWeb UIにログインします。

2.  *Admin*メニューエントリをクリックし、*Repositories*セクションの*Local*リンクをクリックします。

3.  *New*ボタンをクリックして、新しいローカルリポジトリを作成します。

    ![!新しいローカルリポジトリを作成する][img-new-local-repo]

4.  「RPM」パッケージタイプを選択します。

5.  *Repository Key*フィールドにリポジトリ名を入力します。この名前は、JFrog Artifactory内で一意である必要があります。 [Artifactoryリポジトリネーミングのベストプラクティス][link-artifactory-naming-agreement]に準拠する名前を選択することをお勧めします（例：`wallarm-centos-upload-local`）。

    *Repository*レイアウトのドロップダウンリストから「maven-2-default」レイアウトを選択してください。

    他の設定はそのままにしておいて構いません。

    *Save & Finish*ボタンをクリックして、ローカルArtifactoryリポジトリを作成します。

    ![!リポジトリ設定][img-artifactory-repo-settings]

    これで、新しく作成されたリポジトリがローカルリポジトリのリストに表示されるようになります。

Wallarmリポジトリのミラーリングを完了するには、ローカルArtifactoryリポジトリに[同期したパッケージをインポートします][anchor-fetch-repo]。

##  3.  ローカルWallarmリポジトリのコピーをJFrog Artifactoryにインポートする

ArtifactoryローカルRPMリポジトリにWallarmパッケージをインポートするには、以下の手順を実行します。
1.  管理者アカウントでJFrog Artifactory Web UIにログインします。

2.  *Admin*メニューエントリをクリックし、*Import & Export*セクションの*Repositories*リンクをクリックします。

3.  *Import Repository from Path*セクションで、*Repository from Path*ドロップダウンリストから、[以前に作成した][anchor-setup-repo-artifactory]ローカルリポジトリを選択します。

4.  *Browse*ボタンをクリックし、[以前に作成した][anchor-fetch-repo]Wallarmパッケージが入ったディレクトリを選択します。

5.  *Import*ボタンをクリックして、ディレクトリからWallarmパッケージをインポートします。

    ![!パッケージをインポートする][img-import-into-artifactory]

6.  *Artifacts*メニューエントリをクリックし、インポートされたWallarmパッケージが、目的のローカルリポジトリに存在することを確認します。

    ![!リポジトリのパッケージ][img-local-repo-ok]



これで、Wallarmリポジトリのローカルミラーを使用して[Wallarmフィルタノードをデプロイできます。][doc-installation-from-artifactory]