## Gereksinimler

* Bir AWS hesabı
* AWS EC2 ve Güvenlik Grupları konusunda bilgi
* Tercihinize bağlı herhangi bir AWS bölgesi, Wallarm node dağıtımı için belirli bir bölge kısıtlaması yoktur
* [US Cloud](https://us1.my.wallarm.com/) veya [EU Cloud](https://my.wallarm.com/) için Wallarm Console'da iki faktörlü kimlik doğrulaması devre dışı bırakılmış **Administrator** rolüne sahip hesaba erişim
* US Wallarm Cloud ile çalışmak için `https://us1.api.wallarm.com:444` veya EU Wallarm Cloud ile çalışmak için `https://api.wallarm.com:444` adresine erişim. Eğer erişim yalnızca proxy sunucusu üzerinden yapılandırılabiliyorsa, [talimatları][wallarm-api-via-proxy] kullanın
* Bir Wallarm örneğinde tüm komutları süper kullanıcı (örneğin, `root`) olarak çalıştırma

## 1. AWS'de Bir SSH Anahtar Çifti Oluşturun

Dağıtım süreci sırasında, sanal makineye SSH üzerinden bağlanmanız gerekecektir. Amazon EC2, örneğe bağlanmak için kullanılabilecek, isimlendirilmiş bir genel ve özel SSH anahtar çifti oluşturmanıza olanak tanır.

Bir anahtar çifti oluşturmak için:

1. Amazon EC2 panosunda **Key pairs** sekmesine gidin.
2. **Create Key Pair** düğmesine tıklayın.
3. Bir anahtar çifti adı girin ve **Create** düğmesine tıklayın.

PEM formatında özel bir SSH anahtarı otomatik olarak indirmeye başlayacaktır. Gelecekte oluşturulan örneğe bağlanmak için anahtarı kaydedin.

SSH anahtarları oluşturma ile ilgili ayrıntılı bilgileri görmek için [AWS documentation][link-ssh-keys]'e gidin.

## 2. Bir Güvenlik Grubu Oluşturun

Bir Güvenlik Grubu, sanal makineler için izin verilen ve yasaklanan gelen ve giden bağlantıları tanımlar. Bağlantıların nihai listesi, korunan uygulamaya bağlıdır (örneğin, TCP/80 ve TCP/443 portlarına tüm gelen bağlantılara izin vermek gibi).

Filtreleme düğümü için bir güvenlik grubu oluşturmak için:

1. Amazon EC2 panosunda **Security Groups** sekmesine gidin ve **Create Security Group** düğmesine tıklayın.
2. Açılan iletişim kutusuna bir güvenlik grubu adı ve isteğe bağlı bir açıklama girin.
3. Gerekli VPC'yi seçin.
4. **Inbound** ve **Outbound** sekmelerinde gelen ve giden bağlantı kurallarını yapılandırın.
5. Güvenlik grubunu oluşturmak için **Create** düğmesine tıklayın.

![Creating a security group][img-create-sg]

!!! warning "Güvenlik Grubundan Giden Bağlantılar İçin Kurallar"
    Bir güvenlik grubu oluşturulurken, varsayılan olarak tüm giden bağlantılara izin verilir. Eğer filtreleme düğümünden giden bağlantıları kısıtlıyorsanız, düğümün bir Wallarm API sunucusuna erişim izni almasını sağlayın. Kullanılan Wallarm Cloud'a bağlı olarak Wallarm API sunucusunun seçimi şu şekildedir:

    *   US Cloud kullanıyorsanız, düğümünüzün `us1.api.wallarm.com` adresine erişim izni alması gerekir.
    *   EU Cloud kullanıyorsanız, düğümünüzün `api.wallarm.com` adresine erişim izni alması gerekir.
    
    Filtreleme düğümünün doğru çalışabilmesi için bir Wallarm API sunucusuna erişimi gereklidir.

Güvenlik grubu oluşturma ile ilgili ayrıntılı bilgileri görmek için [AWS documentation][link-sg]'e gidin.

## 3. Bir Wallarm Düğüm Örneği Başlatın

Wallarm filtreleme düğümü ile bir örnek başlatmak için, bu [link](https://aws.amazon.com/marketplace/pp/B073VRFXSD)'e gidin ve filtreleme düğümüne abone olun.

Bir örnek oluştururken, [önceden oluşturulmuş][anchor1] güvenlik grubunu aşağıdaki gibi belirtmeniz gerekir:

1. Launch Instance Sihirbazı ile çalışırken, ilgili sekmeye tıklayarak **6. Configure Security Group** örnek başlatma adımına gidin.
2. **Assign a security group** ayarında **Select an existing security group** seçeneğini seçin.
3. Görünen listeden güvenlik grubunu seçin.

Gerekli tüm örnek ayarlarını belirledikten sonra **Review and Launch** düğmesine tıklayın, örneğin doğru şekilde yapılandırıldığından emin olun ve **Launch** düğmesine tıklayın.

Açılan pencerede, [önceden oluşturulmuş][anchor2] anahtar çiftini aşağıdaki işlemleri yaparak belirtin:

1. İlk açılır listede **Choose an existing key pair** seçeneğini seçin.
2. İkinci açılır listede, anahtar çiftinin adını seçin.
3. İkinci açılır listede belirttiğiniz anahtar çiftine ait PEM formatındaki özel anahtara erişiminiz olduğundan emin olun ve bunu onaylamak için onay kutusunu işaretleyin.
4. **Launch Instances** düğmesine tıklayın.

Örnek, önceden yüklenmiş filtreleme düğümü ile başlatılacaktır.

AWS'de örnek başlatma ile ilgili ayrıntılı bilgileri görmek için [AWS documentation][link-launch-instance]'e gidin.

## 4. Filtreleme Düğümü Örneğine SSH ile Bağlanın

Bir örneğe SSH üzerinden bağlanma yöntemleri hakkında ayrıntılı bilgileri görmek için [AWS documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)'e gidin.

Örneğe bağlanmak için `admin` kullanıcı adını kullanmanız gerekir.

!!! info "SSH Üzerinden Bağlanmak İçin Anahtarın Kullanılması"
    Örneğe SSH üzerinden bağlanmak için daha önce [oluşturduğunuz][anchor2] PEM formatında özel anahtarı kullanın. Bu, örnek oluşturulurken belirttiğiniz SSH anahtar çiftinin özel anahtarı olmalıdır.

## 5. Filtreleme Düğümünü Wallarm Cloud'a Bağlayın

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"