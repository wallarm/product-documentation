## Gereksinimler

* Bir AWS hesabı
* AWS EC2, Security Groups konularında bilgi sahibi olmak
* Seçtiğiniz herhangi bir AWS bölgesi, Wallarm node dağıtımı için bölgeye özgü kısıtlamalar yoktur
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da iki faktörlü kimlik doğrulamanın kapalı olduğu **Administrator** rolüne sahip hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` erişimi veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` erişimi. Eğer erişim sadece proxy sunucusu üzerinden yapılandırılabiliyorsa, o zaman [instructions][wallarm-api-via-proxy] talimatlarını kullanın.
* Güncelleme indirmeleri, [API specifications][api-spec-enforcement-docs] ve [allowlisted, denylisted, or graylisted][ip-lists-docs] ülkeler, bölgeler veya veri merkezleri için hassas IP'leri almak amacıyla aşağıdaki IP adreslerine erişim

    --8<-- "../include/wallarm-cloud-ips.md"
* Tüm komutları bir Wallarm örneğinde süper kullanıcı (ör. `root`) olarak çalıştırma

## 1. AWS'de Bir SSH Anahtar Çifti Oluşturma

Dağıtım sürecinde, sanal makineye SSH üzerinden bağlanmanız gerekecektir. Amazon EC2, örneğe bağlanmak için kullanılabilecek adlandırılmış bir genel ve özel SSH anahtar çifti oluşturulmasına izin verir.

Bir anahtar çifti oluşturmak için:

1. Amazon EC2 gösterge panelinde **Key pairs** sekmesine gidin.
2. **Create Key Pair** düğmesine tıklayın.
3. Bir anahtar çifti adı girin ve **Create** düğmesine tıklayın.

PEM formatında bir özel SSH anahtarı otomatik olarak indirilmeye başlayacaktır. Gelecekte oluşturulan örneğe bağlanmak için anahtarı saklayın.

SSH anahtarlarının oluşturulmasıyla ilgili detaylı bilgileri görmek için [AWS documentation][link-ssh-keys]'a gidin.

## 2. Bir Security Group Oluşturma

Bir Security Group, sanal makineler için izin verilen ve yasaklanan gelen ve giden bağlantıları tanımlar. Nihai bağlantı listesi, korunan uygulamaya bağlıdır (örneğin, TCP/80 ve TCP/443 portlarına gelen tüm bağlantılara izin vermek).

Filtreleme düğümü için bir security group oluşturmak üzere:

1. Amazon EC2 gösterge panelinde **Security Groups** sekmesine gidin ve **Create Security Group** düğmesine tıklayın.
2. Açılan iletişim kutusuna bir security group adı ve isteğe bağlı bir açıklama girin.
3. Gerekli VPC'yi seçin.
4. **Inbound** ve **Outbound** sekmelerinde gelen ve giden bağlantı kurallarını yapılandırın.
5. Security group'u oluşturmak için **Create** düğmesine tıklayın.

![Creating a security group][img-create-sg]

!!! uyarı "Security group'tan çıkan bağlantı kuralları"
    Bir security group oluşturulurken, tüm giden bağlantılar varsayılan olarak izin verilir. Eğer filtreleme düğümünden çıkan bağlantıları kısıtlıyorsanız, düğüme bir Wallarm API sunucusuna erişim izni verildiğinden emin olun. Kullanılan Wallarm Cloud'a bağlı olarak Wallarm API sunucusunun seçimi şunlardır:

    * US Cloud kullanıyorsanız, düğümünüzün `us1.api.wallarm.com` adresine erişimi olmalıdır.
    * EU Cloud kullanıyorsanız, düğümünüzün `api.wallarm.com` adresine erişimi olmalıdır.
    
    Filtreleme düğümünün düzgün çalışabilmesi için bir Wallarm API sunucusuna erişim gereklidir.

Security group oluşturmayla ilgili detaylı bilgileri görmek için [AWS documentation][link-sg]'a gidin.

## 3. Bir Wallarm Node Örneği Başlatma

Wallarm filtreleme düğümüne sahip bir örnek başlatmak için, bu [link](https://aws.amazon.com/marketplace/pp/B073VRFXSD)'e gidin ve filtreleme düğümüne abone olun.

Bir örnek oluştururken, aşağıdaki gibi daha önce oluşturulan [anchor1] security group'unu belirtmeniz gerekir:

1. Launch Instance Sihirbazı ile çalışırken, ilgili sekmeye tıklayarak **6. Configure Security Group** örnek başlatma adımına gidin.
2. **Assign a security group** ayarı altında **Select an existing security group** seçeneğini seçin.
3. Görünen listeden security group'u seçin.

Gerekli tüm örnek ayarlarını belirttikten sonra, **Review and Launch** düğmesine tıklayın, örneğin doğru yapılandırıldığından emin olun ve **Launch** düğmesine tıklayın.

Açılan pencerede, aşağıdaki adımları izleyerek daha önce oluşturulan [anchor2] key pair'i belirtin:

1. İlk açılır listeden **Choose an existing key pair** seçeneğini seçin.
2. İkinci açılır listeden anahtar çiftinin adını seçin.
3. İkinci açılır listede belirttiğiniz SSH key pair'ine ait PEM formatındaki özel anahtara erişiminiz olduğundan emin olun ve bunu onaylamak için kutucuğu işaretleyin.
4. **Launch Instances** düğmesine tıklayın.

Örnek, önceden yüklenmiş filtreleme düğümü ile başlatılacaktır.

AWS'de örnek başlatmayla ilgili detaylı bilgileri görmek için [AWS documentation][link-launch-instance]'a gidin.

## 4. SSH ile Filtreleme Düğümü Örneğine Bağlanma

Bir örneğe SSH ile bağlanma yöntemleriyle ilgili detaylı bilgileri görmek için [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)'a gidin.

Örneğe bağlanmak için `admin` kullanıcı adını kullanmanız gerekmektedir.

!!! bilgi "SSH ile bağlanmak için anahtarın kullanılması"
    Örneğe SSH ile bağlanmak için daha önce oluşturduğunuz [anchor2] PEM formatındaki özel anahtarı kullanın. Bu, örnek oluşturulurken belirttiğiniz SSH key pair'inin özel anahtarı olmalıdır.

## 5. Bir Örneği Wallarm Cloud'a Bağlamak için Token Oluşturma

Yerel Wallarm filtreleme düğümünün, Wallarm Cloud ile Wallarm token'ı kullanarak bağlantı kurması gerekmektedir. Bir API token'ı, Wallarm Console UI üzerinde bir node grubunun oluşturulmasını sağlar; bu da node örneklerinizi etkin bir şekilde organize etmenize yardımcı olur.

![Grouped nodes][img-grouped-nodes]

Token'ı aşağıdaki şekilde oluşturun:

=== "API token"

    1. Wallarm Console → **Settings** → **API tokens** bölümünü [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) veya [EU Cloud](https://my.wallarm.com/settings/api-tokens)'da açın.
    1. `Deploy` kaynak rolüne sahip bir API token'ı bulun veya oluşturun.
    1. Bu token'ı kopyalayın.
=== "Node token"

    1. Wallarm Console → **Nodes** bölümünü [US Cloud](https://us1.my.wallarm.com/nodes) veya [EU Cloud](https://my.wallarm.com/nodes)'da açın.
    1. Aşağıdakilerden birini yapın: 
        * **Wallarm node** tipinde bir node oluşturun ve oluşturulan token'ı kopyalayın.
        * Mevcut bir node grubunu kullanın - node menüsünü kullanarak token'ı kopyalayın → **Copy token**.