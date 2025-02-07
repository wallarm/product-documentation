Uygulamanızın example.com alan adında erişilebilir olduğunu ve kullanıcı kimlik doğrulaması için 32 haneli hex sembolü formatında X-AUTHENTICATION başlığını kullandığını, yanlış formatlı tokenleri reddetmek istediğinizi varsayalım.

Bunu yapmak için, **Create regexp-based attack indicator** kuralını ayarlayın ve ekran görüntüsünde gösterildiği gibi **Virtual patch** olarak ayarlayın, bunlar dahil:

* Düzenli ifade: `^(.{0,31}|.{33,}|[^0-9a-fA-F]+)$`
* İstek kısmı: `header` - `X-AUTHENTICATION`

![Regex rule first example][img-regex-example1]