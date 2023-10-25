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

# Wallarm Deposu için CentOS'ta Aynalama Nasıl Yapılır?

Alt yapınızdaki tüm filtre nodlarının tek bir kaynaktan ve aynı sürüm numarasından dağıtıldığından emin olmak için Wallarm deposunun yerel bir kopyasını (aynalama olarak da bilinir) oluşturabilir ve kullanabilirsiniz.

Bu belge, bir CentOS 7 sunucusu için Wallarm deposunu JFrog Artifactory'in deposu yöneticisi aracılığıyla aynalamak için sizi rehberlik edecektir.

!!! info "Ön Koşullar"
    Aşağıdaki koşulların herhangi bir adım atmadan önce karşılandığından emin olun:

    *   Sunucunuzda bu bileşenlerin kurulu olduğu:
   
        *   CentOS 7 işletim sistemi
        *   `yum-utils` ve `epel-release` paketleri
        *   RPM depoları oluşturabilen JFrog Artifactory yazılımı ([kurulum talimatları][link-jfrog-installation])

            JFrog Artifactory sürümleri ve özellikleri hakkında daha fazla bilgi [burada][link-jfrog-comparison-matrix].
        
    *   JFrog Artifactory çalışıyor.
    *   Sunucunun internet erişimi var.

Wallarm deposunun aynalanması şunları içerir:
1.  [Wallarm deposunun yerel bir kopyasını oluşturma][anchor-fetch-repo]
2.  [JFrog Artifactory'de bir yerel RPM deposu oluşturma][anchor-setup-repo-artifactory]
3.  [Yerel Wallarm deposu kopyasını JFrog Artifactory'ye aktarma][anchor-import-repo]

##  1.  Wallarm Deposunun Yerel Bir Kopyasını Oluşturma

Wallarm deposunun yerel bir kopyasını oluşturmak için aşağıdakileri yapın:
1.  Aşağıdaki komutu çalıştırarak Wallarm deposunu ekleyin:

    ```bash
    sudo rpm --install https://repo.wallarm.com/centos/wallarm-node/7/4.8/x86_64/wallarm-node-repo-4.8-0.el7.noarch.rpm
    ```

2.  Geçici bir dizine (örneğin, `/tmp`) gidin ve aşağıdaki komutu çalıştırarak Wallarm deposunu bu dizine senkronize edin:

    ```bash
    reposync -r wallarm-node -p .
    ```
    
Eğer `reposync` komutu başarılı bir şekilde tamamlanırsa, Wallarm paketleri geçici dizinin `wallarm-node/Packages` alt dizinine yerleştirilecektir (örneğin, `/tmp/wallarm-node/Packages`).


##  2.  JFrog Artifactory'de Bir Yerel RPM Deposu Oluşturma

JFrog Artifactory'de yerel bir RPM deposu oluşturmak için aşağıdakileri yapın:
1.  Domain adı veya IP adresi aracılığıyla JFrog Artifactory web UI'ına geçin (örneğin, `http://jfrog.example.local:8081/artifactory`).

    Yönetici hesabı ile web UI'ına giriş yapın.

2.  *Admin* menü girişine tıkladıktan sonra *Reposlar* bölümünde *Yerel* bağlantısına tıklayın.

3.  Yeni bir yerel depo oluşturmak için *Yeni* düğmesine tıklayın.

    ![Yeni yerel depo oluşturma][img-new-local-repo]

4.  Paket türü olarak "RPM" seçin.

5.  Depo adını *Depo Anahtarı* alanına doldurun. Bu adın JFrog Artifactory'de benzersiz olması gerekmektedir. Artifactory depolarının adlandırılması en iyi pratiklere uygun bir isim seçmenizi öneririz (örneğin, `wallarm-centos-upload-local`).

    *Depo* Düzeni açılır listesinden "maven-2-default" düzenini seçin.

    Diğer ayarları olduğu gibi bırakabilirsiniz.

    Yerel Artifactory deposunu oluşturmak için *Kaydet & Bitir* düğmesine tıklayın.
    
    ![Depo ayarları][img-artifactory-repo-settings]

    Şimdi, yeni oluşturulan depo yerel depo listesinde görüntülenmelidir.

Wallarm deposunun aynalamasını bitirmek için, senkronize paketleri yerel Artifactory deposuna [ithal et][anchor-fetch-repo].


##  3.  Yerel Wallarm Reposu Kopyasını JFrog Artifactory'ye Aktarma

Wallarm paketlerini Artifactory yerel RPM deposuna aktarmak için aşağıdakileri yapın:
1.  Yönetici hesabı ile JFrog Artifactory web UI'ına giriş yapın.

2.  *Admin* menü girişine tıklayın, ardından *İçe Aktar & Dışa Aktar* bölümünde *Reposları* bağlantısına tıklayın.

3.  *Yol İçindeki Deposuyu İçe Aktar* bölümünde, *Yol İçindeki Depodan* açılır listesinden [daha önce oluşturduğunuz] yerel depoyu seçin.

4.  *Gözat* düğmesine tıklayın ve [daha önce oluşturduğunuz] Wallarm paketlerinin bulunduğu dizini seçin.

5.  Wallarm paketlerini dizinden içe aktarmak için *İçeri Aktar* düğmesine tıklayın.

    ![Paketlerin içe aktarılması][img-import-into-artifactory]
    
6.  *Eserler* menü girişine tıklayın ve istenen yerel depoda içe aktarılan Wallarm paketlerinin bulunduğundan emin olun.

    ![Depodaki Paketler][img-local-repo-ok]
    
Artık yerel Wallarm deposunun aynasını kullanarak Wallarm filtre nodlarını [dağıtabilirsiniz][doc-installation-from-artifactory].
