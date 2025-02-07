[img-working-with-repo]:        ../../../../images/integration-guides/repo-mirroring/centos/common/working-with-repo.png
[img-repo-creds]:               ../../../../images/integration-guides/repo-mirroring/centos/common/repo-creds.png
[img-repo-code-snippet]:        ../../../../images/integration-guides/repo-mirroring/centos/common/repo-code-snippet.png

[doc-repo-mirroring]:           how-to-mirror-repo-artifactory.md
[doc-install-postanalytics]:    ../../../installation-postanalytics-en.md


# CentOS向けローカルJFrog ArtifactoryリポジトリからのWallarmパッケージのインストール方法

NGINXフィルターノード専用のホストで[JFrog Artifactoryリポジトリ][doc-repo-mirroring]からWallarmパッケージをインストールするには、以下の手順を実行します。

1.  ドメイン名またはIPアドレスを使用してJFrog ArtifactoryのWeb UIにアクセスします（例: `http://jfrog.example.local:8081/artifactory`）。

    ユーザーアカウントでWeb UIにログインしてください。
    
2.  *Artifacts*メニュー項目をクリックし、Wallarmパッケージを含むリポジトリを選択します。

3.  *Set Me Up*リンクをクリックします。

    ![リポジトリの操作][img-working-with-repo]
    
    ポップアップウィンドウが表示されます。*Type Password*フィールドにユーザーアカウントのパスワードを入力し、*Enter*キーを押してください。これにより、このウィンドウの指示にあなたの認証情報が含まれるようになります。
    
    ![認証情報の入力][img-repo-creds]

4.  下にスクロールして`yum`の設定例を表示し、`Copy Snippet to Clipboard`ボタンをクリックして、この例をクリップボードにコピーします。

    ![設定例の表示][img-repo-code-snippet]
    
5.  `yum`設定ファイル（例: `/etc/yum.repos.d/artifactory.repo`）を作成し、コピーしたスニペットを貼り付けます。

    !!! warning "重要"
        `baseurl`パラメータから`<PATH_TO_REPODATA_FOLDER>`部分を削除し、`baseurl`がリポジトリのルートを指すようにしてください。
    
    `wallarm-centos-upload-local`サンプルリポジトリのための`/etc/yum.repos.d/artifactory.repo`ファイルの例:

    ```bash
    [Artifactory]
    name=Artifactory
    baseurl=http://user:password@jfrog.example.local:8081/artifactory/wallarm-centos-upload-local/
    enabled=1
    gpgcheck=0
    #Optional - if you have GPG signing keys installed, use the below flags to verify the repository metadata signature:
    #gpgkey=http://user:password@jfrog.example.local:8081/artifactory/wallarm-centos-upload-local/<PATH_TO_REPODATA_FOLDER>/repomd.xml.key
    #repo_gpgcheck=1
    ```
    
6.  ホストに`epel-release`パッケージをインストールします:
    
    ```
    sudo yum install -y epel-release
    ```

これでCentOS向けのインストール手順に進むことができます。ローカルリポジトリをセットアップ済みのため、リポジトリ追加の手順はスキップしてください。