[img-working-with-repo]:        ../../../../images/integration-guides/repo-mirroring/centos/common/working-with-repo.png
[img-repo-creds]:               ../../../../images/integration-guides/repo-mirroring/centos/common/repo-creds.png
[img-repo-code-snippet]:        ../../../../images/integration-guides/repo-mirroring/centos/common/repo-code-snippet.png

[doc-repo-mirroring]:           how-to-mirror-repo-artifactory.md
[doc-install-postanalytics]:    ../../../installation-postanalytics-en.md


#   CentOS用ローカルJFrog ArtifactoryリポジトリからWallarmパッケージをインストールする方法

NGINXフィルタノード専用のホストで[JFrog Artifactoryリポジトリ][doc-repo-mirroring]からWallarmパッケージをインストールするには、このホストで次の操作を実行します。
1.  ドメイン名またはIPアドレス（例: `http://jfrog.example.local:8081/artifactory`）でJFrog ArtifactoryのWeb UIにアクセスします。

    ユーザーアカウントでWeb UIにログインします。
    
2.  メニュー項目*Artifacts*をクリックし、Wallarmパッケージを含むリポジトリを選択します。

3.  リンク*Set Me Up*をクリックします。

    ![リポジトリの操作][img-working-with-repo]
    
    ポップアップウィンドウが表示されます。*Type Password*フィールドにユーザーアカウントのパスワードを入力し、*Enter*を押します。これで、このウィンドウに表示される手順に認証情報が含まれるようになります。
    
    ![認証情報の入力][img-repo-creds]

4.  `yum`の設定例までスクロールし、この例をクリップボードにコピーするために`Copy Snippet to Clipboard`ボタンをクリックします。

    ![設定例][img-repo-code-snippet]
    
5.  `yum`の設定ファイル（例: `/etc/yum.repos.d/artifactory.repo`）を作成し、コピーしたスニペットを貼り付けます。

    !!! warning "重要"
        `baseurl`パラメータから<PATH_TO_REPODATA_FOLDER>の部分を削除し、`baseurl`がリポジトリのルートを指すようにしてください。
    
    `wallarm-centos-upload-local`サンプルリポジトリ向けの`/etc/yum.repos.d/artifactory.repo`ファイルの例:

    ```bash
    [Artifactory]
    name=Artifactory
    baseurl=http://user:password@jfrog.example.local:8081/artifactory/wallarm-centos-upload-local/
    enabled=1
    gpgcheck=0
    #任意 - GPG署名鍵がインストールされている場合は、以下のフラグを使用してリポジトリメタデータの署名を検証します:
    #gpgkey=http://user:password@jfrog.example.local:8081/artifactory/wallarm-centos-upload-local/<PATH_TO_REPODATA_FOLDER>/repomd.xml.key
    #repo_gpgcheck=1
    ```
    
6.  ホストに`epel-release`パッケージをインストールします。
    
    ```
    sudo yum install -y epel-release
    ```

これでCentOS向けの任意のインストール手順に従うことができます。ローカルリポジトリを設定済みのため、リポジトリを追加する手順はスキップする必要があります。