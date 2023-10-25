[img-working-with-repo]:        ../../../../images/integration-guides/repo-mirroring/centos/common/working-with-repo.png
[img-repo-creds]:               ../../../../images/integration-guides/repo-mirroring/centos/common/repo-creds.png
[img-repo-code-snippet]:        ../../../../images/integration-guides/repo-mirroring/centos/common/repo-code-snippet.png

[doc-repo-mirroring]:           how-to-mirror-repo-artifactory.md
[doc-install-postanalytics]:    ../../../installation-postanalytics-en.md


#   CentOS için Lokal JFrog Artifactory Depolarından Wallarm Paketlerini Nasıl Yüklerim

Filtre düğümüne adanmış bir konak üzerinde [JFrog Artifactory deposundan][doc-repo-mirroring] Wallarm paketlerini yüklemek için, bu konak üzerinde aşağıdaki işlemleri gerçekleştirin:
1.  Alan adı veya IP adresi üzerinden JFrog Artifactory web kullanıcı arabirimine (ör., `http://jfrog.example.local:8081/artifactory`) gidin.

    Bir kullanıcı hesabıyla web kullanıcı arabirimine giriş yapın.
    
2.  *Artifacts* menu girişini tıklayın ve Wallarm paketlerini içeren bir depo seçin.

3.  *Set Me Up* bağlantısını tıklayın.

    ![Depoda çalışma][img-working-with-repo]
    
    Bir açılır pencere çıkacak. *Type Password* alanına kullanıcı hesabınızın şifresini yazın ve *Enter* tuşuna basın. Artık bu penceredeki yönergeler sizin kimlik bilgilerinizi içerecektir.
    
    ![Kimlik bilgilerinin girilmesi][img-repo-creds]

4.  `yum` yapılandırma örneğine kaydırın ve bu örneği panoya kopyalamak için `Copy Snippet to Clipboard` düğmesini tıklayın.

    ![Yapılandırma örneği][img-repo-code-snippet]
    
5. Bir `yum` yapılandırma dosyası oluşturun (ör., `/etc/yum.repos.d/artifactory.repo`) ve panoya kopyaladığınız örneği içine yapıştırın.

    !!! warning "Önemli!"
        `baseurl` parametresinin depo köküne işaret edebilmesi adına, lütfen `<PATH_TO_REPODATA_FOLDER>` gardıntısını `baseurl` parametresinden kaldırın.
    
    `wallarm-centos-upload-local` numune deposu için `/etc/yum.repos.d/artifactory.repo` dosya örneği:

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
    
6.  Konakta `epel-release` paketini yükleyin:
    
    ```
    sudo yum install -y epel-release
    ```

Şimdi CentOS için herhangi bir kurulum talimatını takip edebilirsiniz. Yerel bir depo kurduğunuz için deposu eklediğiniz aşamayı atlamanız gerekecek.
