[img-working-with-repo]:        ../../../../images/integration-guides/repo-mirroring/centos/common/working-with-repo.png
[img-repo-creds]:               ../../../../images/integration-guides/repo-mirroring/centos/common/repo-creds.png
[img-repo-code-snippet]:        ../../../../images/integration-guides/repo-mirroring/centos/common/repo-code-snippet.png

[doc-repo-mirroring]:           how-to-mirror-repo-artifactory.md
[doc-install-postanalytics]:    ../../../installation-postanalytics-en.md


# CentOS için Yerel JFrog Artifactory Deposundan Wallarm Paketlerini Yükleme

Bir NGINX filtre düğümüne adanmış ana bilgisayarda [JFrog Artifactory deposundaki][doc-repo-mirroring] Wallarm paketlerini yüklemek için, bu ana bilgisayarda aşağıdaki adımları uygulayın:
1.  JFrog Artifactory web arayüzüne, alan adı veya IP adresi üzerinden erişin (örn. `http://jfrog.example.local:8081/artifactory`).

    Bir kullanıcı hesabı ile web arayüzüne giriş yapın.
    
2.  *Artifacts* menü öğesine tıklayın ve Wallarm paketlerini içeren bir depoyu seçin.

3.  *Set Me Up* bağlantısına tıklayın.

    ![Depo ile çalışma][img-working-with-repo]
    
    Bir açılır pencere görünecektir. *Type Password* alanına kullanıcı hesabınızın şifresini yazın ve *Enter* tuşuna basın. Artık, bu penceredeki talimatlar kimlik bilgilerinizi içerecektir.
    
    ![Kimlik bilgilerini yazma][img-repo-creds]

4.  `yum` yapılandırma örneğine kadar aşağı kaydırın ve bu örneği panonuza kopyalamak için `Copy Snippet to Clipboard` düğmesine tıklayın.

    ![Yapılandırma örneği][img-repo-code-snippet]
    
5.  Bir `yum` yapılandırma dosyası oluşturun (örn. `/etc/yum.repos.d/artifactory.repo`) ve panoya kopyaladığınız parçayı içine yapıştırın.

    !!! warning "Önemli!"
        `baseurl` parametresinden `<PATH_TO_REPODATA_FOLDER>` parçasını kaldırdığınızdan emin olun, böylece `baseurl` deponun köküne işaret eder.
    
    `wallarm-centos-upload-local` örnek deposu için `/etc/yum.repos.d/artifactory.repo` dosya örneği:

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
    
6.  Ana bilgisayarda `epel-release` paketini yükleyin:
    
    ```
    sudo yum install -y epel-release
    ```

Artık CentOS için herhangi bir kurulum talimatını uygulayabilirsiniz. Depo ekleme adımını atlamanız gerekecektir çünkü yerel bir depo yapılandırdınız.