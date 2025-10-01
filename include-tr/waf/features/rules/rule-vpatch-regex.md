Diyelim ki `example.com` alan adından erişilebilen uygulamanız, kullanıcı kimlik doğrulaması için 32 hex sembol formatında `X-AUTHENTICATION` başlığını kullanıyor ve hatalı formatlı belirteçleri reddetmek istiyorsunuz.

Bunu yapmak için, ekran görüntüsünde gösterildiği gibi **Create regexp-based attack indicator** kuralını ayarlayın ve **Virtual patch** olarak belirleyin; buna şunlar dahildir:

* Regular expression: `^(.{0,31}|.{33,}|[^0-9a-fA-F]+)$`
* Request part: `header` - `X-AUTHENTICATION`

![Regex kuralı ilk örnek][img-regex-example1]