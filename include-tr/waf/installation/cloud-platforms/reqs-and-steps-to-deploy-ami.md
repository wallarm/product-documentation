## Gereksinimler

* Bir AWS hesabı
* AWS EC2, Güvenlik Grupları hakkında bilgi 
* Seçtiğiniz herhangi bir AWS bölgesi, Wallarm düğümünün dağıtımı için belirli bir bölge sınırlaması yoktur
* Wallarm Konsolunda iki faktörlü kimlik doğrulama iptal edilmiş **Yönetici** rolüne sahip hesaba erişim - [ABD Bulutu](https://us1.my.wallarm.com/) veya [AB Bulutu](https://my.wallarm.com/)
* ABD Wallarm Bulutu ile çalışmak için `https://us1.api.wallarm.com:444` adresine veya AB Wallarm Bulutu ile çalışmak için `https://api.wallarm.com:444` adresine erişim. Eğer erişim sadece proxy sunucu üzerinden yapılandırılabilirse, bu [talimatları][wallarm-api-via-proxy] kullanın
* Tüm komutların bir Wallarm örneğinde bir süper kullanıcı olarak (örneğin, `root`) yürütülmesi

## 1. AWS'da bir SSH anahtarı çifti oluşturun

Dağıtım süreci boyunca, SSH üzerinden sanal makineye bağlanmanız gerekecektir. Amazon EC2, örneğe bağlanmak için kullanılabilecek adlandırılmış bir çift kamusal ve özel SSH anahtarı oluşturmaya izin verir.

Bir anahtar çifti oluşturmak için:

1. Amazon EC2 kontrol panelindeki **Anahtar çiftleri** sekmesine gidin.
2. **Anahtar Çifti Oluştur** düğmesini tıklayın.
3. Bir anahtar çifti adı girin ve **Oluştur** düğmesini tıklayın.

Özel bir SSH anahtarı PEM formatında otomatik olarak indirmeye başlayacaktır. Gelecekte oluşturulan örneğe bağlanmak için anahtarı kaydedin.

SSH anahtarları hakkında ayrıntılı bilgi için, [AWS belgeleri][link-ssh-keys]ne geçin.

## 2. Bir Güvenlik Grubu oluşturun

Bir Güvenlik Grubu, sanal makineler için izin verilen ve yasaklanan gelen ve giden bağlantıları tanımlar. Son bağlantılar listesi, korunan uygulamaya bağlıdır (örneğin, TCP/80 ve TCP/443 bağlantı noktalarına tüm gelen bağlantılara izin verilir).

Filtreleme düğümü için bir güvenlik grubu oluşturmak için:

1. Amazon EC2 kontrol panelindeki **Güvenlik Grupları** sekmesine gidin ve **Güvenlik Grubu Oluştur** düğmesini tıklayın.
2. Bir güvenlik grubu adı ve isteğe bağlı bir açıklama girin ve görünen diyalog kutusuna yazın.
3. Gerekli VPC'yi seçin.
4.  **Gelen** ve **Giden** sekmesindeki gelen ve giden bağlantı kurallarını yapılandırın.
5.  Güvenlik grubunu oluşturmak için **Oluştur** düğmesini tıklayın.

![Bir güvenlik grubu oluşturma][img-create-sg]

!!! uyarı "Güvenlik grubundan giden bağlantılar için kurallar"
    Bir güvenlik grubu oluştururken, giden tüm bağlantılara varsayılan olarak izin verilir. Filtreleme düğümünden giden bağlantıları sınırlarsanız, bir Wallarm API sunucusuna erişim sağlandığından emin olun. Wallarm API sunucusunun seçimi, kullanılan Wallarm Buluta bağlıdır:

    *   Eğer ABD Bulutunu kullanıyorsanız, düğümünüzün `us1.api.wallarm.com` adresine erişim yetkisi verilmesi gerekiyor.
    *   Eğer AB Bulutunu kullanıyorsanız, düğümünüzün `api.wallarm.com` adresine erişim yetkisi verilmesi gerekiyor.
    
    Filtreleme düğümü, doğru işlem için bir Wallarm API sunucusuna erişim gerektirir.

Güvenlik grubu oluşturma hakkında ayrıntılı bilgi için, [AWS belgeleri][link-sg]'ne geçin.

## 3. Bir Wallarm düğüm örneği başlatın

Filtreleme düğümüyle bir örnek başlatmak için, bu [bağlantıya](https://aws.amazon.com/marketplace/pp/B073VRFXSD) gidin ve filtreleme düğümüne abone olun.

Bir örnek oluştururken, aşağıdaki gibi [daha önce oluşturulan][anchor1] güvenlik grubunu belirtmeniz gerekir:

1.  Örnek Başlatma Sihirbazı ile çalışırken, ilgili sekmeyi tıklayarak **6. Güvenlik Grubunu Yapılandır** örnek başlatma adımına geçin.
2. **Güvenlik grubu atama** ayarında **Mevcut bir güvenlik grubunu seç** seçeneğini seçin.
3. Görünen listeden güvenlik grubunu seçin.

Tüm gerekli örnek ayarlarını belirttikten sonra, **İncele ve Başlat** düğmesini tıklayın, örneğin doğru yapılandırıldığından emin olun ve **Başlat** düğmesini tıklayın.

Görünen pencerede, aşağıdaki işlemleri yaparak [daha önce oluşturulan][anchor2] anahtar çiftini belirtin:

1. İlk açılır listede, **Mevcut bir anahtar çifti seç** seçeneğini seçin.
2. İkinci açılır listede, anahtar çiftinin adını seçin. 
3. İkinci açılır listede belirttiğiniz anahtar çiftinden PEM formatında özel anahtara sahip olduğunuzdan emin olun ve bunu onaylamak için onay kutusunu işaretleyin.
4. **Örnekleri Başlat** düğmesini tıklayın.

Örnek, önceden yüklenmiş filtreleme düğümü ile başlatılacaktır.

AWS'de örneklerin nasıl başlatıldığı hakkında ayrıntılı bilgi için, [AWS belgeleri][link-launch-instance]'ne geçin.

## 4. SSH üzerinden filtreleme düğümü örneğine bağlanın

Bir örneğe SSH üzerinden nasıl bağlanılacağı hakkında ayrıntılı bilgi için, [AWS belgeleri](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html)'ne geçin.

Örneğe bağlanmak için `admin` kullanıcı adını kullanmanız gerekmektedir.

!!! bilgi "SSH aracılığıyla bağlanmak için anahtar kullanımı"
    SSH üzerinden örneğe bağlanmak için [daha önce oluşturduğunuz][anchor2] PEM formatında özel anahtarı kullanın. Bu, bir örnek oluştururken belirttiğiniz SSH anahtar çiftinden özel anahtar olmalıdır.

## 5. Filtreleme düğümünü Wallarm Bulutuna bağlayın

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6-only-with-postanalytics.md"