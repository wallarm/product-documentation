## Gereksinimler

* Bir GCP hesabı
* [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/) için Wallarm Konsolunda iki faktörlü kimlik doğrulamanın devre dışı bırakıldığı **Yönetici** rolüne sahip hesaba erişim
* ABD Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com:444` veya AB Wallarm Bulutu ile çalışmak için `https://api.wallarm.com:444`e erişim. Eğer erişim yalnızca proxy sunucusu üzerinden yapılandırılabilir ise, o zaman [talimatlara][wallarm-api-via-proxy] başvurun
* Tüm komutları bir Wallarm örneğinde süper kullanıcı (ör. `root`) olarak çalıştırma

## 1. Bir filtreleme düğümü örneğini başlatın

### Google Cloud UI ile örneği başlatma

Google Cloud UI üzerinden filtreleme düğümü örneğini başlatmak için lütfen [Google Cloud Marketplace'teki Wallarm düğüm resmine](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) gidin ve **BAŞLAT**'a tıklayın.

Örneği, önceden yüklenmiş bir filtreleme düğümü ile başlatır. Google Cloud'da örnekleri başlatma hakkında detaylı bilgi almak için lütfen [resmi Google Cloud Platform belgeleri][link-launch-instance]'ne gitin.

### Terraform veya diğer araçlar ile örneği başlatma

Filtreleme düğümü örneğini Wallarm GCP resmi ile başlatmak için bir araç (örneğin Terraform) kullanırken, bu resmin ismini Terraform yapılandırmasında sağlamamız gerekebilir.

* Resim adı aşağıdaki formatı kendisinde tutmaktadır:

    ```bash
    wallarm-node-195710/wallarm-node-<RESIM_VERSIYONU>-build
    ```
* Sürüm 4.6 olan filtreleme düğümü ile örneği başlatmak için aşağıdaki resim adını kullanın:

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

Resmin adını almak için aşağıdaki adımları da izleyebilirsiniz:

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) 'yi yükleyin.
2. Aşağıdaki parametrelerle [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) komutunu çalıştırın:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-6-*'" --no-standard-images
    ```
3. Mevcut en son resmin adından versiyon değerini kopyalayın ve kopyalanan değeri sağlanan resim adı formatına yapıştırın. Örnek olarak, filtreleme düğümü versiyon 4.6 resmi aşağıdaki adı tutacaktır:

    ```bash
    wallarm-node-195710/wallarm-node-4-6-20230630-122224
    ```

## 2. Filtreleme düğümü örneğini yapılandırın

Başlatılan filtreleme düğümü örneğini yapılandırmak için aşağıdaki işlemleri gerçekleştirin:

1. Menünün **Hesaplama Motoru** bölümündeki **VM örnekleri** sayfasına gidin.
2. Başlatılan filtreleme düğümü örneğini seçin ve **Düzenle** düğmesine tıklayın.
3. Gereken trafik türlerine gelen trafiği kabul etmek için **Firewalls** ayarında karşılık gelen kutucukları işaretleyin.
4. Gerekirse, projenin SSH anahtarları ile örneğe bağlanmaktan kaçının ve bu örneğe bağlanmak için özel bir SSH anahtar çifti kullanın. Bunu yapmak için aşağıdaki işlemleri gerçekleştirin:
    1. **SSH Keys** ayarındaki **Block project-wide** kutucuğunu işaretleyin.
    2. SSH anahtarı girişi için genişletecek olanıdır **SSH Keys** ayarıdaki **Show and edit** düğmesine tıklayın.
    3. Birer tane ortak ve özel SSH anahtarı çifti oluşturun. Örneğin, `ssh-keygen` ve `PuTTYgen` yardımcı programlarını kullanabilirsiniz.
       
        ![PuTTYgen kullanarak SSH anahtarları oluşturma][img-ssh-key-generation]

    4. Kullanılan anahtar oluşturucunun arayüzünden OpenSSH formatında bir açık anahtar kopyalayın (mevcut örnekte, oluşturulan ortak anahtarın **Public key for pasting into OpenSSH authorized_keys file** alanından kopyalanması gerekir) ve **Enter entire key data** ipucunu içeren alana yapıştırın.
    5. Özel anahtarı kaydedin. Gelecekte, yapılandırılmış örnekte bağlantı kurmak için gereklidir.
5. Sayfanın altındaki **Save** düğmesine tıklayarak değişiklikleri uygulayın.

## 3. SSH üzerinden filtreleme düğümü örneğine bağlanın

Örneklere bağlanma hakkında detaylı bilgi için bu [bağlantıya](https://cloud.google.com/compute/docs/instances/connecting-to-instance) gidin.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. Filtreleme düğümünü Wallarm Bulutu'na bağlayın

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"