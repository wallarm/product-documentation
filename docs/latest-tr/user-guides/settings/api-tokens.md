[user-roles-article]:       ../../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:      ../../images/api-tokens-edit.png

# API Belirteçleri

Wallarm Console → Settings → API tokens içinde, [API istek kimlik doğrulaması](../../api/overview.md) ve [filtreleme düğümü dağıtımı](../../installation/supported-deployment-options.md) için belirteçleri yönetebilirsiniz.

Wallarm API belirteçleri esnek yönetim seçenekleri sunar. Belirtecin türünü (kişisel veya paylaşılan), sona erme tarihini ve izinlerini belirleyebilirsiniz.

![Wallarm API belirteci][img-api-tokens-edit]

## Kişisel ve paylaşılan belirteçler

Kişisel veya paylaşılan API belirteçleri oluşturabilirsiniz:

* Kişisel belirteçler, kendilerine atanan izinlere göre bireysel kullanım için tasarlanmıştır. Kişisel belirteçleri yalnızca [Administrators and Analysts](users.md#user-roles) oluşturabilir ve kullanabilir.

    Kişisel bir belirtecin değeri yalnızca sahibi tarafından kopyalanabilir ve kullanılabilir. Ancak, yöneticiler şirket hesabı içinde kullanıcı belirteçlerinin listesini görüntüleyebilir.
* Paylaşılan belirteçler birden fazla kullanıcı veya sistem tarafından kullanılmak üzere tasarlanmıştır. Herhangi bir bireysel kişisel hesaba bağlı olmaksızın kaynaklara veya işlevlere kolektif erişim sağlarlar.

    Bu belirteçleri yalnızca Administrators ve Global Administrators oluşturabilir ve şirkette yalnızca diğer yöneticiler bunları kullanabilir.

## Belirteç kullanımı

Seçilen kullanım kapsamı, belirtecin nasıl ve nerede kullanılabileceğini sınırlar:

* Node kurulumu - [kendi barındırılan Wallarm Node dağıtımı](../../installation/supported-deployment-options.md) veya yükseltmesi için bir Node’u kimlik doğrulamak üzere API belirteci üretmek için bu seçeneği kullanın.
* Wallarm API - belirteci doğrudan Wallarm API’ye kimliği doğrulanmış istekler yapmak için kullanmak üzere bu seçeneği seçin.
* Schema-Based Testing aracı - [gerekli](../../vulnerability-detection/schema-based-testing/) [Schema-Based Testing](../../vulnerability-detection/schema-based-testing/setup.md#prerequisites-token)’in çalışması için.

## Belirteçlerin sona ermesi

Her belirteç için bir sona erme tarihi belirleyebilirsiniz. Belirlendikten sonra, belirteç belirtilen tarihten sonra devre dışı bırakılacaktır.

Belirtecin sona erme tarihinden 3 gün önce e-posta bildirimi göndeririz. Sona erme süresi 3 günden kısa olan kısa vadeli belirteçler için bildirim gönderilmez.

Kişisel belirteçler için e-posta doğrudan belirteç sahibine gönderilir; paylaşılan belirteçler için ise tüm yöneticiler bildirim alır.

## Belirteç izinleri

Her belirteç için, kullanıcı rolünüzle ilişkili izin kapsamını aşmayan izinler ayarlayabilirsiniz.

Belirteç izinlerini önceden tanımlı kullanıcı rollerine göre atayabilir veya özelleştirebilirsiniz:

* Administrator, Analyst, API Developer, Read Only ve bunların eşdeğeri Global roller — bu rollerden biri atanan bir belirteç, [kullanıcı rol sistemi](users.md#user-roles)nde ayrıntılandırılan izinleri devralır.
* Deploy — bu role sahip API belirteçleri [Wallarm düğümlerini dağıtmak](../../installation/supported-deployment-options.md) için kullanılır.
* Özel izinler — izinlerin elle seçilmesine geçer.

Kişisel belirteç sahibinin izinleri azaltılırsa, belirteçlerinin izinleri de buna uygun şekilde ayarlanır.

## Belirteçleri devre dışı bırakma ve yeniden etkinleştirme

Belirteçlerinizi manuel olarak devre dışı bırakabilir veya etkinleştirebilirsiniz. Devre dışı bırakıldığında, bir belirteç derhal çalışmayı durdurur.

Devre dışı bırakılan belirteçler, pasifleştirmeden bir hafta sonra otomatik olarak silinir.

Daha önce devre dışı bırakılmış bir belirteci yeniden etkinleştirmek için, ona yeni bir sona erme tarihi atayın.

Bir belirteç sahibi [devre dışı bırakılırsa](../../user-guides/settings/users.md#disabling-and-deleting-users), belirteçleri de otomatik olarak devre dışı bırakılır.

## Geriye dönük uyumlu belirteçler

Eskiden istek kimlik doğrulaması için UUID ve gizli anahtar kullanılıyordu; bu şimdi belirteçlerle değiştirildi. Kullanmakta olduğunuz UUID ve gizli anahtar otomatik olarak **geriye dönük uyumlu** belirtece dönüştürülür. Bu belirteçle, UUID ve gizli anahtarla kimliği doğrulanan istekler çalışmaya devam edecektir.

!!! warning "Belirteci yenileyin veya SSO'yu etkinleştirin"
    Geriye dönük uyumlu belirtecin değerini yenilerseniz veya bu belirteç sahibine [SSO](../../admin-en/configuration-guides/sso/intro.md) etkinleştirirseniz, geriye dönük uyumluluk sona erer — eski UUID ve gizli anahtarla kimliği doğrulanan tüm istekler çalışmayı durdurur.

Geriye dönük uyumlu belirtecin üretilen değerini, isteklerinizin `X-WallarmApi-Token` üstbilgi parametresinde geçirerek de kullanabilirsiniz.

Geriye dönük uyumlu belirteç, kullanıcı rolüyle aynı izinlere sahiptir; bu izinler belirteç penceresinde görüntülenmez ve değiştirilemez. İzinleri kontrol etmek istiyorsanız, geriye dönük uyumlu belirteci kaldırıp yeni bir tane oluşturmanız gerekir.

## API belirteçleri ve düğüm belirteçleri

Bu makalede açıklanan API belirteçlerini, herhangi bir istemciden ve herhangi bir izin kümesiyle Wallarm Cloud API [istek kimlik doğrulaması](../../api/overview.md) için kullanabilirsiniz.

Wallarm Cloud API’ye erişen istemcilerden biri de Wallarm filtreleme düğümünün kendisidir. Wallarm Cloud’un API’sine bir filtreleme düğümüne erişim vermek için, API belirteçlerine ek olarak düğüm belirteçlerini de kullanabilirsiniz. [Farkı ve hangisini tercih etmeniz gerektiğini öğrenin →](../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation)

!!! info "API belirteçleri bazı dağıtım seçenekleri tarafından desteklenmez"
    API belirteçleri şu anda [Terraform module](../../installation/cloud-platforms/aws/terraform-module/overview.md) tabanlı AWS dağıtımları için kullanılamaz. Bunun yerine düğüm belirteçlerini kullanın.