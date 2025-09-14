## Gereksinimler

* Bir GCP hesabı
* [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) için Wallarm Console’da **Administrator** rolüne sahip hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` adresine veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, [talimatları][wallarm-api-via-proxy] kullanın
* Tüm komutların bir Wallarm örneğinde süper kullanıcı (örn. `root`) olarak yürütülmesi

## 1. Bir filtreleme düğümü örneği başlatın

### Örneği Google Cloud UI üzerinden başlatın

Filtreleme düğümü örneğini Google Cloud UI üzerinden başlatmak için lütfen [Google Cloud Marketplace üzerindeki Wallarm node imajını](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) açın ve **GET STARTED**’a tıklayın.

Örnek, önceden kurulu bir filtreleme düğümü ile başlatılacaktır. Google Cloud’da örnek başlatma hakkında ayrıntılı bilgi için lütfen [resmi Google Cloud Platform dokümantasyonuna][link-launch-instance] bakın.

### Örneği Terraform veya diğer araçlarla başlatın

Terraform gibi bir araç kullanarak Wallarm GCP imajını kullanıp filtreleme düğümü örneği başlatırken, bu imajın adını Terraform yapılandırmasında belirtmeniz gerekebilir.

* İmaj adı aşağıdaki biçimdedir:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* Filtreleme düğümünün 4.8 sürümüyle örnek başlatmak için lütfen aşağıdaki imaj adını kullanın:

    ```bash
    wallarm-node-195710/wallarm-node-4-8-20231019-221905
    ```

İmaj adını almak için şu adımları da izleyebilirsiniz:

1. [Google Cloud SDK’yı](https://cloud.google.com/sdk/docs/install) kurun.
2. [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) komutunu aşağıdaki parametrelerle çalıştırın:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-8-*'" --no-standard-images
    ```
3. En son kullanılabilir imajın adından sürüm değerini kopyalayın ve kopyalanan değeri sağlanan imaj adı biçimine yapıştırın. Örneğin, 4.8 sürümündeki filtreleme düğümü imajının adı aşağıdaki gibi olacaktır:

    ```bash
    wallarm-node-195710/wallarm-node-4-8-20231019-221905
    ```

## 2. Filtreleme düğümü örneğini yapılandırın

Başlatılan filtreleme düğümü örneğini yapılandırmak için aşağıdaki işlemleri gerçekleştirin:

1. Menüdeki **Compute Engine** bölümünde **VM instances** sayfasına gidin.
2. Başlatılan filtreleme düğümü örneğini seçin ve **Edit** düğmesine tıklayın.
3. **Firewalls** ayarında ilgili onay kutularını işaretleyerek gerekli gelen trafik türlerine izin verin.
4. Gerekirse, örneğe proje SSH anahtarlarıyla bağlantıyı kısıtlayabilir ve bu örneğe bağlanmak için özel bir SSH anahtar çifti kullanabilirsiniz. Bunu yapmak için şu adımları uygulayın:
    1. **SSH Keys** ayarında **Block project-wide** onay kutusunu işaretleyin.
    2. **SSH Keys** ayarında bir SSH anahtarı girme alanını genişletmek için **Show and edit** düğmesine tıklayın.
    3. Açık ve gizli SSH anahtarlarından oluşan bir çift oluşturun. Örneğin, `ssh-keygen` ve `PuTTYgen` yardımcı programlarını kullanabilirsiniz.
       
        ![PuTTYgen kullanarak SSH anahtarları oluşturma][img-ssh-key-generation]

    4. Kullanılan anahtar üreticisinin arayüzünden OpenSSH formatındaki açık anahtarı kopyalayın (mevcut örnekte, üretilen açık anahtar PuTTYgen arayüzündeki **Public key for pasting into OpenSSH authorized_keys file** alanından kopyalanmalıdır) ve onu **Enter entire key data** ipucunu içeren alana yapıştırın.
    5. Özel anahtarı kaydedin. Gelecekte yapılandırılmış örneğe bağlanmak için gerekecektir.
5. Değişiklikleri uygulamak için sayfanın altındaki **Save** düğmesine tıklayın. 

## 3. Filtreleme düğümü örneğine SSH ile bağlanın

Örneklerle bağlantı kurma yöntemleri hakkında ayrıntılı bilgi için bu [bağlantıya](https://cloud.google.com/compute/docs/instances/connecting-to-instance) gidin.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. Filtreleme düğümünü Wallarm Cloud’a bağlayın

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"