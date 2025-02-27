[user-roles-article]:       ../../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:      ../../images/api-tokens-edit.png

# API Jetonları

Wallarm Console → **Settings** → **API tokens** bölümünde, [API istek doğrulaması](../../api/overview.md) ve [node dağıtım filtrelemesi](../../installation/supported-deployment-options.md) için jetonları yönetebilirsiniz.

Wallarm API jetonları esnek yönetim seçenekleri sunar. Jetonun türünü (kişisel veya paylaşılan gibi) seçebilir, son kullanma tarihini belirleyebilir ve izinleri yapılandırabilirsiniz.

![Wallarm API jetonu][img-api-tokens-edit]

## Kişisel ve paylaşılan jetonlar

Kişisel veya paylaşılan API jetonlarından birini oluşturabilirsiniz:

* Kişisel jetonlar, kendilerine atanan izinlere göre bireysel kullanım için belirlenmiştir. Sadece [Administrators ve Analysts](users.md#user-roles) kişisel jeton oluşturabilir ve kullanabilir.

    Bir kişisel jetonun değeri yalnızca sahibi tarafından kopyalanıp kullanılabilir. Ancak, yöneticiler şirket hesabı içindeki kullanıcı jetonlarının listesini görebilir.
* Paylaşılan jetonlar, birden fazla kullanıcı veya sistem tarafından kullanılmak üzere tasarlanmıştır. Bireysel kişisel hesaplara bağlı olmaksızın, kaynaklara veya işlevlere toplu erişim sağlarlar.

    Sadece Administrators ve Global Administrators bu jetonları oluşturabilir ve yalnızca şirket içindeki diğer yöneticiler tarafından kullanılabilirler.

## Jetonun Son Kullanma Tarihi

Her jeton için bir son kullanma tarihi belirleme seçeneğine sahipsiniz. Belirlendikten sonra, jeton belirtilen tarihten sonra devre dışı bırakılır.

Bir jetonun son kullanma tarihinden 3 gün önce e-posta bildirimi gönderilir. Son kullanım süresi 3 günden kısa olan kısa süreli jetonlar için bildirim gönderilmez.

Kişisel jetonlar için e-posta doğrudan jeton sahibine, paylaşılan jetonlar için ise tüm yöneticilere gönderilir.

## Jeton İzinleri

Her jeton için, kullanıcı rolünüzle ilişkilendirilen izinlerin kapsamını aşmayan izinler belirleyebilirsiniz.

Önceden tanımlanmış kullanıcı rollerine dayalı veya özelleştirilmiş şekilde jeton izinleri atayabilirsiniz:

* Administrator, Analyst, API Developer, Read Only ve eşdeğer Global roller - Bu rollerden biri atanan bir jeton, [kullanıcı rol sistemi](users.md#user-roles) kapsamında detaylandırılan izinleri devralır.
* Deploy - Bu role sahip API jetonları, [Wallarm node'larını dağıtmak](../../installation/supported-deployment-options.md) için kullanılır.
* Custom permissions - Manuel izin seçimine geçiş yapar.
<!--
    [OpenAPI security testing](../../fast/openapi-security-testing.md) için bir jeton oluşturmak adına, ilgili izinlere sahip özel rol gereklidir.-->

Eğer bir kişisel jeton sahibinin izinleri azaltılırsa, jetonlarının izinleri buna göre ayarlanır.

## Jetonları Devre Dışı Bırakma ve Yeniden Etkinleştirme

Jetonlarınızı manuel olarak devre dışı bırakabilir veya etkinleştirebilirsiniz. Devre dışı bırakıldığında, jeton hemen çalışmaz hale gelir.

Devre dışı bırakılan jetonlar, devre dışı bırakıldıktan bir hafta sonra otomatik olarak silinir.

Daha önce devre dışı bırakılmış bir jetonu yeniden etkinleştirmek için ona yeni bir son kullanma tarihi atayın.

Eğer bir jeton sahibi [devre dışı bırakılırsa](../../user-guides/settings/users.md#disabling-and-deleting-users), jetonları da otomatik olarak devre dışı bırakılır.

## Geriye Dönük Uyumlu Jetonlar

Önceden API istek doğrulaması için UUID ve gizli anahtar kullanılıyordu; bu yöntem artık jetonlarla değiştirilmiştir. Kullandığınız UUID ve gizli anahtar, otomatik olarak **geriye dönük uyumlu** jetona dönüştürülür. Bu jetonla, UUID ve gizli anahtar ile doğrulanan istekler çalışmaya devam eder.

!!! warning "Jetonu Yenileyin veya SSO'yu Etkinleştirin"
    Geriye dönük uyumlu jetonun değerini yenilerseniz veya bu jetonun sahibi için [SSO/strict SSO](../../admin-en/configuration-guides/sso/intro.md) etkinleştirilirse, geriye dönük uyumluluk sona erer - eski UUID ve gizli anahtar ile doğrulanan tüm istekler çalışmayı durdurur.

Oluşturulan geriye dönük uyumlu jeton değerini, isteklerinizin `X-WallarmApi-Token` başlık parametresi ile de kullanabilirsiniz.

Geriye dönük uyumlu jeton, kullanıcı rolü ile aynı izinlere sahiptir; bu izinler jeton penceresinde gösterilmez ve değiştirilemez. İzinleri kontrol etmek istiyorsanız, geriye dönük uyumlu jetonu kaldırıp yeni bir tane oluşturmanız gerekir.

## API Jetonları vs. Node Jetonları

Bu makalede açıklanan API jetonlarını, herhangi bir istemciden ve herhangi bir yetki setiyle Wallarm Cloud API [istek doğrulaması](../../api/overview.md) için kullanabilirsiniz.

Wallarm Cloud API'ye erişen istemcilerden biri, Wallarm filtreleme node'unun kendisidir. Wallarm Cloud API'ye erişim izni vermek için, API jetonlarının yanı sıra node jetonlarını da kullanabilirsiniz. [Farkı ve tercih edilecek olanı öğrenin →](../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation)

!!! info "Bazı dağıtım seçenekleri API jetonlarını desteklemiyor"
    API jetonları şu anda [Terraform module](../../installation/cloud-platforms/aws/terraform-module/overview.md) tabanlı AWS dağıtımları için kullanılamamaktadır. Bunun yerine node jetonlarını kullanın.