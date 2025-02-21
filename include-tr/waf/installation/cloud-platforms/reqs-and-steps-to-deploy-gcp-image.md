## Gereksinimler

* Bir GCP hesabı
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da **Administrator** rolüyle erişim ve iki faktörlü kimlik doğrulamasının devre dışı bırakılmış olması
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` adresine erişim. Erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, [instructions][wallarm-api-via-proxy] yönergelerini kullanın
* Saldırı tespit kuralları güncellemelerini ve [API specifications][api-spec-enforcement-docs] belgelerini indirmenin yanı sıra [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeler, bölgeler veya veri merkezleri için hassas IP'ler alabilmek için aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Tüm komutları bir Wallarm örneğinde süper kullanıcı (örneğin `root`) olarak çalıştırma

## 1. Bir filtreleme düğümü örneği başlatın

### Google Cloud UI üzerinden örneği başlatın

Google Cloud UI üzerinden filtreleme düğümü örneğini başlatmak için, lütfen [Wallarm node image on the Google Cloud Marketplace](https://console.cloud.google.com/launcher/details/wallarm-node-195710/wallarm-node) sayfasını açın ve **GET STARTED** düğmesine tıklayın.

Örnek, önceden yüklenmiş bir filtreleme düğümü ile başlatılacaktır. Google Cloud'da örnek başlatma hakkında detaylı bilgi için lütfen [official Google Cloud Platform documentation][link-launch-instance] sayfasına gidin.

### Terraform veya diğer araçlar kullanılarak örneği başlatın

Wallarm GCP imajını kullanarak filtreleme düğümü örneğini başlatmak için Terraform gibi bir araç kullanırken, Terraform yapılandırmasında bu imajın adını belirtmeniz gerekebilir.

* İmaj adı aşağıdaki formatta olacaktır:

    ```bash
    wallarm-node-195710/wallarm-node-<IMAGE_VERSION>-build
    ```
* Filtreleme düğümü sürümü 5.x ile örneği başlatmak için lütfen aşağıdaki imaj adını kullanın:

    ```bash
    wallarm-node-195710/wallarm-node-5-3-20250129-150255
    ```

İmaj adını öğrenmek için şu adımları da izleyebilirsiniz:

1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) aracını yükleyin.
2. Aşağıdaki parametrelerle birlikte [`gcloud compute images list`](https://cloud.google.com/sdk/gcloud/reference/compute/images/list) komutunu çalıştırın:

    ```bash
    gcloud compute images list --project wallarm-node-195710 --filter="name~'wallarm-node-5-2-*'" --no-standard-images
    ```
3. En son kullanılabilir imajın adından sürüm değerini kopyalayın ve belirtilen imaj adı formatına yapıştırın. Örneğin, filtreleme düğümü sürümü 4.10 imajı aşağıdaki adı alacaktır:

    ```bash
    wallarm-node-195710/wallarm-node-5-3-20250129-150255
    ```

## 2. Filtreleme düğümü örneğini yapılandırın

Başlatılan filtreleme düğümü örneğini yapılandırmak için aşağıdaki adımları uygulayın:

1. Menünün **Compute Engine** bölümündeki **VM instances** sayfasına gidin.
2. Başlatılan filtreleme düğümü örneğini seçin ve **Edit** düğmesine tıklayın.
3. **Firewalls** ayarında ilgili gelen trafik türlerini işaretleyerek izin verin.
4. Gerekirse, örneğe yalnızca proje SSH anahtarları ile bağlanmayı kısıtlayabilir ve bu örneğe bağlanmak için özel bir SSH anahtar çifti kullanabilirsiniz. Bunun için şu adımları izleyin:
    1. **SSH Keys** ayarında **Block project-wide** kutucuğunu işaretleyin.
    2. SSH anahtarı girişi için alanı genişletmek adına **Show and edit** düğmesine tıklayın.
    3. Bir çift genel ve özel SSH anahtarı oluşturun. Örneğin, `ssh-keygen` ve `PuTTYgen` araçlarını kullanabilirsiniz.
       
        ![Generating SSH keys using PuTTYgen][img-ssh-key-generation]

    4. Kullanılan anahtar oluşturucusunun arayüzünden OpenSSH formatındaki açık anahtarı kopyalayın (bu örnekte, oluşturulan genel anahtar PuTTYgen arayüzündeki **Public key for pasting into OpenSSH authorized_keys file** alanından kopyalanmalıdır) ve **Enter entire key data** ipucunu içeren alana yapıştırın.
    5. Özel anahtarı kaydedin. Gelecekte yapılandırılan örneğe bağlanmak için bu anahtar gerekecektir.
5. Değişiklikleri uygulamak için sayfanın altındaki **Save** düğmesine tıklayın.

## 3. SSH üzerinden filtreleme düğümü örneğine bağlanın

Örneklerle bağlantı kurma yöntemleri hakkında detaylı bilgi için lütfen bu [linke](https://cloud.google.com/compute/docs/instances/connecting-to-instance) gidin.

--8<-- "../include/gcp-autoscaling-connect-ssh.md"

## 4. Bir örneğin Wallarm Cloud'a bağlanması için bir token oluşturun

Yerel Wallarm filtreleme düğümünün, uygun tipte bir Wallarm token kullanarak Wallarm Cloud ile bağlantı kurması gerekmektedir. Bir API token, Wallarm Console UI'da düğüm grubu oluşturmanıza olanak tanır ve bu da düğüm örneklerinizi etkili bir şekilde organize etmenizi sağlar.

![Grouped nodes][img-grouped-nodes]

Token'ı aşağıdaki şekilde oluşturun:

=== "API token"

    1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens) üzerinde açın.
    1. `Deploy` kaynak rolüne sahip API token'ı bulun veya oluşturun.
    1. Bu token'ı kopyalayın.
=== "Node token"

    1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes) üzerinde açın.
    1. Aşağıdakilerden birini yapın: 
        * **Wallarm node** türünde bir düğüm oluşturun ve oluşturulan token'ı kopyalayın.
        * Mevcut düğüm grubunu kullanın - düğüm menüsünden token'ı **Copy token** seçeneğiyle kopyalayın.