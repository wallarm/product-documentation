[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Amazon CloudFront için Wallarm Connector

[CloudFront](https://aws.amazon.com/cloudfront/) Amazon Web Services tarafından işletilen bir içerik dağıtım ağıdır. Wallarm, CloudFront üzerinden dağıtılan trafiği korumak ve izlemek için bir connector olarak işlev görebilir.

Wallarm'ı CloudFront için bir connector olarak kullanmak için, Wallarm node'unuzu **harici olarak dağıtmanız** ve trafiği analiz için Wallarm node'una yönlendiren Wallarm tarafından sağlanan Lambda@Edge fonksiyonlarını **çalıştırmanız** gerekmektedir.

CloudFront connector'ü hem [in-line](../inline/overview.md) hem de [out-of-band](../oob/overview.md) trafik analizini destekler:

=== "In-line trafik akışı"

    Eğer Wallarm kötü niyetli aktiviteyi engelleyecek şekilde yapılandırıldıysa:

    ![CloudFront ile Wallarm - satır içi şema](../../images/waf-installation/gateways/cloudfront/traffic-flow-inline.png)
=== "Out-of-band trafik akışı"
    ![CloudFront ile Wallarm - hat dışı şema](../../images/waf-installation/gateways/cloudfront/traffic-flow-oob.png)

## Kullanım Durumları

Tüm desteklenen [Wallarm deployment options](../supported-deployment-options.md) arasında, trafik Amazon CloudFront üzerinden dağıtıldığında bu çözüm önerilmektedir.

## Sınırlamalar

* Lambda@Edge fonksiyon seviyesi kısıtlamalar:

    * Lambda@Edge fonksiyonları, HTTP durum kodları 4xx olan viewer yanıtlarıyla tetiklenmez.
    * Lambda@Edge, hem origin response hem de viewer response olaylarında yanıt gövdesine erişime izin vermez; bu, yanıt içeriğine dayalı herhangi bir işlemin gerçekleştirilmesi imkânını kısıtlar.
    * Gövde boyutu, viewer istekleri için 40 KB ve origin istekleri için 1 MB ile sınırlıdır.
    * Wallarm node'undan maksimum yanıt süresi, viewer istekleri için 5 saniye, origin istekleri için 30 saniyedir.
    * Lambda@Edge, özel ağları (VPC) desteklemez.
    * Bölge başına eşzamanlı isteklerin varsayılan limiti 1.000'dir, ancak bu limit on binlerceye kadar artırılabilir.
    * Wallarm Lambda@Edge fonksiyonları origin seviyesinde çalışır, yani CDN önbelleği tarafından işlenen istekleri izlemez. Bu nedenle, önbellekteki isteklerde gerçekleşen potansiyel saldırılar tespit edilemez.
* Özellik kısıtlamaları:
    * Lambda@Edge yanıt tetikleyici kısıtlamaları nedeniyle, [pasif tespit](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) ve API Discovery kapsamındaki API [yanıt yapısına](../../api-discovery/exploring.md#endpoint-details) dayalı zafiyet tespiti sınırlıdır. Wallarm fonksiyonları yanıt gövdelerini alamadığından ve onlara dayalı işlem yapamadığından, bu özellikler mevcut değildir.
    * Wallarm kuralı tarafından [rate limiting](../../user-guides/rules/rate-limiting.md) desteklenmez.
    * [Multitenancy](../multi-tenant/overview.md) henüz desteklenmemektedir.

## Gereksinimler

Dağıtıma devam edebilmek için aşağıdaki gereksinimlerin karşılandığından emin olun:

* AWS CloudFront ve Lambda teknolojilerinin anlaşılması.
* CloudFront CDN üzerinden akan API’lar veya trafik.

## Dağıtım

### 1. Bir Wallarm node'u dağıtın

Wallarm node, gelen trafiği inceleyen, kötü niyetli aktiviteleri tespit eden ve tehditleri azaltmak amacıyla yapılandırılabilen Wallarm platformunun temel bileşenidir.

Wallarm'ı, istediğiniz kontrol seviyesine bağlı olarak ya Wallarm tarafından barındırılan ya da kendi altyapınızda dağıtabilirsiniz.

=== "Edge node"
    Connector için Wallarm barındırmalı bir node dağıtmak adına, [talimatları](../se-connector.md) izleyin.
=== "Self-hosted node"
    Kendi kendinize barındırdığınız bir node dağıtımı için bir artifact seçin ve ekli talimatları takip edin:

    * Linux altyapıları için bare metal veya VM'lerde [All-in-one installer](../native-node/all-in-one.md)
    * Konteyner tabanlı dağıtımları kullanan ortamlar için [Docker image](../native-node/docker-image.md)
    * Kubernetes kullanan altyapılar için [Helm chart](../native-node/helm-chart.md)

### 2. Wallarm Lambda@Edge Fonksiyonlarını Edinip Dağıtın

CloudFront CDN'inizi Wallarm node'una bağlamak için AWS üzerinde Wallarm Lambda@Edge fonksiyonlarını dağıtmanız gerekmektedir.

İki Python tabanlı fonksiyon bulunmaktadır: biri istek iletimi ve analizi için, diğeri ise yanıt iletimi ve analizi için.

=== "Manuel İndirme ve Dağıtım"
    1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** yolunu izleyerek, platformunuza uygun bir kod paketini indirin.

        Eğer self-hosted node kullanıyorsanız, kod paketini almak için sales@wallarm.com ile iletişime geçin.
    1. AWS Console → **Services** → **Lambda** → **Functions** yolunu izleyin.
    1. [Lambda@Edge fonksiyonları için gerekli](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-how-it-works-tutorial.html#lambda-edge-how-it-works-tutorial-create-function) olan `us-east-1` (N. Virginia) bölgesini seçin.
    1. Aşağıdaki ayarlarla **Create function** oluşturun:

        * Runtime: Python 3.x.
        * Execution role: **Create a new role from AWS policy templates** → **Basic Lambda@Edge permissions (for CloudFront trigger)**.
        * Diğer ayarlar varsayılan olarak bırakılabilir.
    1. Fonksiyon oluşturulduktan sonra, **Code** sekmesinde Wallarm istek işleme kodunu yapıştırın.
    1. Kod içerisindeki şu parametreleri güncelleyin:

        * `wlrm_node_addr`: [Wallarm node instance](#1-deploy-a-wallarm-node) adresiniz.
        * `wlrm_inline`: Eğer [out-of-band](../oob/overview.md) modunu kullanıyorsanız, `False` olarak ayarlayın.
        * Gerekirse diğer parametreleri de değiştirin.
    1. **Actions** → **Deploy to Lambda@Edge** seçeneğine ilerleyin ve aşağıdaki ayarları belirtin:

        * Yeni CloudFront trigger yapılandırması.
        * Distribution: Korunmasını istediğiniz origin'e trafiği yönlendiren CDN'niz.
        * Cache behavior: Genellikle `*` olan Lambda fonksiyonu için cache behavior.
        * CloudFront event:
            
            * **Origin request**: Fonksiyon, yalnızca CloudFront CDN'in backend'den veri istediğinde çalışır. CDN önbellekten yanıt dönerse, fonksiyon tetiklenmez.
            * **Viewer request**: Fonksiyon, CloudFront CDN'e yapılan her istek için çalışır.
        * **Include body** seçeneğini işaretleyin.
        * **Confirm deploy to Lambda@Edge** seçeneğini işaretleyin.

        ![CloudFront fonksiyon dağıtımı](../../images/waf-installation/gateways/cloudfront/function-deploy.png)
    1. Wallarm tarafından sağlanan yanıt fonksiyonu için de aynı prosedürü tekrarlayın, yanıtları trigger olarak seçin.

        Yanıt tetikleyicisinin, istek tetikleyicisiyle (origin request için origin response, viewer request için viewer response) eşleştiğinden emin olun.
=== "AWS SAR'dan Fonksiyon Dağıtımı"
    Her iki fonksiyonu da AWS Serverless Application Repository (SAR) üzerinden doğrudan dağıtabilirsiniz. Fonksiyonlar, [Lambda@Edge fonksiyonları için gerekli](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-how-it-works-tutorial.html#lambda-edge-how-it-works-tutorial-create-function) olan `us-east-1` (N. Virginia) bölgesinde dağıtılacaktır.

    1. [Wallarm policies on AWS Serverless Application Repository](https://serverlessrepo.aws.amazon.com/applications/us-east-1/381492110259/wallarm-connector) sayfasına gidin → **Deploy** seçeneğine tıklayın.
    1. Dağıtım ayarlarını varsayılan olarak bırakın.
    1. Dağıtım tamamlandıktan sonra, oluşturulan IAM rolleri → **Trust relationships** bölümüne gidin ve her iki rolü (istekler için biri, yanıtlar için biri) aşağıdaki politika ile güncelleyin:

        ```json
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": [
                            "edgelambda.amazonaws.com",
                            "lambda.amazonaws.com"
                        ]
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        }
        ```

    1. AWS Console → **Services** → **Lambda** → **Functions** yoluna ilerleyin.
    1. `serverlessrepo-wallarm-connector-RequestHandler-xxx` fonksiyonunu açın.
    1. **Code** sekmesinde aşağıdaki parametreleri güncelleyin:

        * `wlrm_node_addr`: [Wallarm node instance](#1-deploy-a-wallarm-node) adresiniz.
        * `wlrm_inline`: Eğer [out-of-band](../oob/overview.md) modunu kullanıyorsanız, `False` olarak ayarlayın.
        * Gerekirse diğer parametreleri de değiştirin.
    1. **Actions** → **Deploy to Lambda@Edge** seçeneğine ilerleyin ve aşağıdaki ayarları belirtin:

        * Yeni CloudFront trigger yapılandırması.
        * Distribution: Korunmasını istediğiniz origin'e trafiği yönlendiren CDN'niz.
        * Cache behavior: Genellikle `*` olan Lambda fonksiyonu için cache behavior.
        * CloudFront event:
            
            * **Origin request**: Fonksiyon, yalnızca CloudFront CDN'in backend'den veri istediğinde çalışır. CDN önbellekten yanıt dönerse, fonksiyon tetiklenmez.
            * **Viewer request**: Fonksiyon, CloudFront CDN'e yapılan her istek için çalışır.
        * **Include body** seçeneğini işaretleyin.
        * **Confirm deploy to Lambda@Edge** seçeneğini işaretleyin.

        ![CloudFront fonksiyon dağıtımı](../../images/waf-installation/gateways/cloudfront/function-deploy.png)
    1. AWS Console → **Services** → **Lambda** → **Functions** yoluna geri dönün.
    1. `serverlessrepo-wallarm-connector-ResponseHandler-xxx` fonksiyonunu açın.
    1. Wallarm tarafından sağlanan yanıt fonksiyonu için aynı prosedürü tekrarlayın, yanıtları trigger olarak seçin.

        Yanıt tetikleyicisinin, istek tetikleyicisiyle (origin request için origin response, viewer request için viewer response) eşleştiğinden emin olun.

## Test Etme

Dağıtılan fonksiyonların işlevselliğini test etmek için aşağıdaki adımları izleyin:

1. CloudFront CDN'inize [Path Traversal][ptrav-attack-docs] saldırısı içeren bir istek gönderin:

    ```
    curl http://<CLOUDFRONT_CDN>/etc/passwd
    ```
1. Wallarm Console → **Attacks** bölümünü [US Cloud](https://us1.my.wallarm.com/attacks) veya [EU Cloud](https://my.wallarm.com/attacks) üzerinden açın ve saldırının listede göründüğünden emin olun.
    
    ![Attacks in the interface][attacks-in-ui-image]

    Eğer Wallarm node modu [blocking](../../admin-en/configure-wallarm-mode.md) olarak ayarlandıysa ve trafik in-line akış gösteriyorsa, istek engellenecektir.

## Lambda@Edge Fonksiyonlarını Güncelleme

Dağıtılmış Lambda@Edge fonksiyonunu [yeni bir sürüme](code-bundle-inventory.md#cloudfront) yükseltmek için:

=== "Manuel İndirme ve Dağıtım"
    1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle** yolunu izleyerek güncellenmiş Wallarm Lambda@Edge fonksiyonlarını indirin.

        Eğer self-hosted node kullanıyorsanız, güncellenmiş kod paketini almak için sales@wallarm.com ile iletişime geçin.
    1. Dağıtılmış Lambda@Edge fonksiyonlarınızın kodunu, güncellenmiş paket ile değiştirin.

        Mevcut `wlrm_node_addr`, `wlrm_inline` ve diğer parametre değerlerini koruyun.

        Mevcut fonksiyon tetikleyicilerini değiştirmeyin.
=== "AWS SAR'dan Fonksiyon Dağıtımı"
    1. Fonksiyonların yeni sürümünü kullanarak, [ikinci adımda](#2-obtain-and-deploy-the-wallarm-lambdaedge-functions) belirtilen adımları tekrarlayın.
    1. Güncellenmiş fonksiyonları dağıtıma bağladıktan sonra, çakışmaları önlemek için CloudFront trigger'larından önceki sürümleri kaldırın.

Fonksiyon güncellemeleri, özellikle büyük sürüm güncellemelerinde Wallarm node yükseltmesini gerektirebilir. Sürüm güncellemeleri ve yükseltme talimatları için [Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) belgesine bakın. Gelecekteki yükseltmeleri basitleştirmek için düzenli node güncellemeleri önerilir.