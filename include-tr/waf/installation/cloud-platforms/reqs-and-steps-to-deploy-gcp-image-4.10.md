## Gereksinimler

* Bir GCP hesabı
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da iki faktörlü kimlik doğrulaması devre dışı bırakılmış **Administrator** rolüne sahip hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` adresine veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` adresine erişim. Erişim sadece proxy sunucusu aracılığıyla yapılandırılabiliyorsa, [bu talimatları][wallarm-api-via-proxy] uygulayın
* Saldırı tespit kurallarına güncelleme indirmek ve [API spesifikasyonlarını][api-spec-enforcement-docs] alabilmek, ayrıca [izin verilen, engellenen veya gri listeye alınan][ip-lists-docs] ülkeler, bölgeler veya veri merkezleri için kesin IP'leri elde edebilmek amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Wallarm örneği üzerinde tüm komutları süper kullanıcı (ör. `root`) olarak çalıştırma

## 1. Bir filtreleme düğümü örneği başlatma

### Google Cloud UI üzerinden örneği başlatma

Google Cloud UI aracılığıyla filtreleme düğümü örneğini başlatmak için lütfen [Google Cloud Marketplace'deki Wallarm node image](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) sayfasını açın ve **GET STARTED** düğmesine tıklayın.

Örnek, önceden yüklenmiş bir filtreleme düğümü ile başlatılacaktır. Google Cloud'da örnek başlatma hakkında ayrıntılı bilgi için [resmi Google Cloud Platform dokümantasyonuna][link-launch-instance] bakınız.

### Terraform veya diğer araçlar aracılığıyla örneği başlatma

Wallarm GCP image kullanarak filtreleme düğümü örneğini başlatmak için Terraform gibi bir araç kullanıldığında, Terraform konfigürasyonunda bu imajın adını belirtmeniz gerekebilir.

* İmaj adı aşağıdaki formatta olmalıdır:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* Filtreleme düğümü sürümü 4.10 ile örneği başlatmak için lütfen aşağıdaki imaj adını kullanın:

    ```bash
    wallarm-node-195710/wallarm-node-4-10-20240220-234618
    ```

İmaj adını almak için şu adımları da izleyebilirsiniz:

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) yükleyin.
2. Aşağıdaki parametrelerle [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) komutunu çalıştırın:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-4-10-*'" --no-standard-images
    ```
3. Mevcut en son imajın adından sürüm değerini kopyalayın ve kopyalanan değeri sağlanan imaj adı formatına yapıştırın. Örneğin, filtreleme düğümü sürümü 4.10 imajı aşağıdaki adı alacaktır:

    ```bash
    wallarm-node-195710/wallarm-node-4-10-20240220-234618
    ```

## 2. Filtreleme düğümü örneğini yapılandırma

Başlatılmış filtreleme düğümü örneğini yapılandırmak için aşağıdaki işlemleri gerçekleştirin:

1. Menüdeki **Compute Engine** bölümünde yer alan **VM instances** sayfasına gidin.
2. Başlatılan filtreleme düğümü örneğini seçin ve **Edit** düğmesine tıklayın.
3. **Firewalls** ayarında ilgili gelen trafik türlerinin işaretlenmesiyle gerekli trafik tiplerine izin verin.
4. Gerekirse, örneğe proje SSH anahtarları ile bağlanmayı kısıtlayabilir ve bu örneğe bağlanmak için özel bir SSH anahtar çifti kullanabilirsiniz. Bunu yapmak için aşağıdaki işlemleri gerçekleştirin:
    1. **SSH Keys** ayarında **Block project-wide** kutusunu işaretleyin.
    2. SSH anahtarının girileceği alanı genişletmek için **Show and edit** düğmesine tıklayın.
    3. Bir çift genel ve özel SSH anahtarı oluşturun. Örneğin, `ssh-keygen` ve `PuTTYgen` yardımcı programlarını kullanabilirsiniz.
       
        ![Generating SSH keys using PuTTYgen][img-ssh-key-generation]

    4. Kullanılan anahtar oluşturucusunun arayüzünden (bu örnekte, PuTTYgen arayüzündeki **Public key for pasting into OpenSSH authorized_keys file** alanından kopyalanan) OpenSSH formatında bir açık anahtarı kopyalayın ve **Enter entire key data** ipucunu içeren alana yapıştırın.
    5. Özel anahtarı kaydedin. Gelecekte yapılandırılmış örneğe bağlanmak için gerekli olacaktır.
5. Değişiklikleri uygulamak için sayfanın altındaki **Save** düğmesine tıklayın. 

## 3. Filtreleme düğümü örneğine SSH ile bağlanma

Örneklerle bağlanma yöntemleri hakkında ayrıntılı bilgi için lütfen bu [linke](https://cloud.google.com/compute/docs/instances/connecting-to-instance) bakın.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. Bir örneği Wallarm Cloud'a bağlamak için token oluşturma

Yerel Wallarm filtreleme düğümünün, [uygun türdeki][wallarm-token-types] bir Wallarm token kullanarak Wallarm Cloud ile bağlantı kurması gerekir. Bir API token, Wallarm Console UI içerisinde bir düğüm grubu oluşturmanıza olanak tanır ve bu, düğüm örneklerinizi etkili bir şekilde organize etmenize yardımcı olur.

![Grouped nodes][img-grouped-nodes]

Token oluşturmak için:

=== "API token"

    1. [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) için Wallarm Console → **Settings** → **API tokens** sayfasını açın.
    2. `Deploy` kaynak rolüne sahip API token'ı bulun veya oluşturun.
    3. Bu token'ı kopyalayın.
=== "Node token"

    1. [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) için Wallarm Console → **Nodes** sayfasını açın.
    2. Aşağıdakilerden birini yapın: 
        * **Wallarm node** türünde bir düğüm oluşturun ve üretilen token'ı kopyalayın.
        * Mevcut bir düğüm grubunu kullanın - düğüm menüsü üzerinden → **Copy token** seçeneği ile token'ı kopyalayın.