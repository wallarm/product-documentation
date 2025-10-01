## Gereksinimler

* Bir GCP hesabı
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüne sahip hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` adresine veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, [talimatları][wallarm-api-via-proxy] kullanın
* Saldırı tespit kurallarının güncellemelerini ve [API spesifikasyonlarını][api-spec-enforcement-docs] indirmek ve [izinli, yasaklı veya gri listelenmiş][ip-lists-docs] ülkeleriniz, bölgeleriniz veya veri merkezleriniz için kesin IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Tüm komutların bir Wallarm örneğinde süper kullanıcı (örn. `root`) olarak yürütülmesi

## 1. Bir filtreleme düğümü örneği başlatın

### Google Cloud UI üzerinden örneği başlatın

Filtreleme düğümü örneğini Google Cloud UI üzerinden başlatmak için lütfen [Google Cloud Marketplace’teki Wallarm node imajını](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) açın ve **GET STARTED**’a tıklayın.

Örnek, önceden yüklenmiş filtreleme düğümüyle başlatılacaktır. Google Cloud’da örnek başlatma hakkında ayrıntılı bilgi için lütfen [resmî Google Cloud Platform dokümantasyonuna][link-launch-instance] bakın.

### Terraform veya diğer araçlarla örneği başlatın

Terraform gibi bir araç kullanarak Wallarm GCP imajı ile filtreleme düğümü örneğini başlatırken, Terraform yapılandırmasında bu imajın adını belirtmeniz gerekebilir.

* İmaj adı aşağıdaki formattadır:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* Filtreleme düğümü sürümü 5.x olan örneği başlatmak için lütfen aşağıdaki imaj adını kullanın:

    ```bash
    wallarm-node-195710/wallarm-node-5-3-15-20250605-140709
    ```

İmaj adını almak için şu adımları da izleyebilirsiniz:

1. [Google Cloud SDK’yı](https://cloud.google.com/sdk/docs/install) kurun.
2. Aşağıdaki parametrelerle [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) komutunu çalıştırın:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-5-3-*'" --no-standard-images
    ```
3. En son mevcut imajın adından sürüm değerini kopyalayın ve kopyaladığınız değeri sağlanan imaj adı formatına yapıştırın. Örneğin, filtreleme düğümü sürümü 4.10 imajının adı şu şekilde olacaktır:

    ```bash
    wallarm-node-195710/wallarm-node-5-3-15-20250605-140709
    ```

## 2. Filtreleme düğümü örneğini yapılandırın

Başlatılan filtreleme düğümü örneğini yapılandırmak için aşağıdaki işlemleri gerçekleştirin:

1.  Menüde **Compute Engine** bölümündeki **VM instances** sayfasına gidin.
2.  Başlatılan filtreleme düğümü örneğini seçin ve **Edit** düğmesine tıklayın.
3.  **Firewalls** ayarında ilgili onay kutularını işaretleyerek gerekli türde gelen trafiğe izin verin.
4.  Gerekirse, örneğe proje SSH anahtarlarıyla bağlanmayı kısıtlayabilir ve bu örneğe bağlanmak için özel bir SSH anahtar çifti kullanabilirsiniz. Bunu yapmak için aşağıdaki adımları uygulayın:
    1.  **SSH Keys** ayarında **Block project-wide** onay kutusunu işaretleyin.
    2.  **SSH Keys** ayarında **Show and edit** düğmesine tıklayarak SSH anahtarı girme alanını genişletin.
    3.  Genel ve özel SSH anahtarlarından oluşan bir çift oluşturun. Örneğin, `ssh-keygen` ve `PuTTYgen` yardımcı programlarını kullanabilirsiniz.
       
        ![PuTTYgen kullanarak SSH anahtarları oluşturma][img-ssh-key-generation]

    4.  Kullanılan anahtar üreticisinin arayüzünden OpenSSH formatında bir açık anahtarı kopyalayın (mevcut örnekte oluşturulan genel anahtar, PuTTYgen arayüzündeki **Public key for pasting into OpenSSH authorized_keys file** alanından kopyalanmalıdır) ve **Enter entire key data** ipucunu içeren alana yapıştırın.
    5.  Özel anahtarı kaydedin. Bu, gelecekte yapılandırılan örneğe bağlanmak için gerekecektir.
5.  Değişiklikleri uygulamak için sayfanın altındaki **Save** düğmesine tıklayın. 

## 3. SSH üzerinden filtreleme düğümü örneğine bağlanın

Örneklere bağlanma yöntemleri hakkında ayrıntılı bilgi için bu [bağlantıya](https://cloud.google.com/compute/docs/instances/connecting-to-instance) gidin.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. Bir örneği Wallarm Cloud’a bağlamak için bir token oluşturun

Yerel Wallarm filtreleme düğümünün, [uygun türdeki][wallarm-token-types] bir Wallarm tokenı kullanarak Wallarm Cloud ile bağlantı kurması gerekir. Bir API tokenı, Wallarm Console UI içinde bir düğüm grubu oluşturmanıza olanak tanır; bu da düğüm örneklerinizi etkili şekilde organize etmenize yardımcı olur.

![Gruplanmış düğümler][img-grouped-nodes]

Tokenı şu şekilde oluşturun:

=== "API token"

    1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinde açın.
    1. Kullanım türü `Node deployment/Deployment` olan bir API tokenı bulun veya oluşturun.
    1. Bu tokenı kopyalayın.
=== "Node token"

    1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinde açın.
    1. Şunlardan birini yapın: 
        * **Wallarm node** türünde bir düğüm oluşturun ve oluşturulan tokenı kopyalayın.
        * Mevcut düğüm grubunu kullanın - düğümün menüsünden → **Copy token** ile tokenı kopyalayın.