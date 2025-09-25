# Agentic AI Keşfi

Wallarm'ın API Discovery özelliği, ML modelleri, sinir ağları, chatbot'lar veya dolaylı olarak OpenAI gibi ücretli üçüncü taraf yapay zeka servislerine erişen sistemlerle ilişkili API'lerinizi [otomatik olarak belirler](../api-discovery/sbf.md#automatic-tagging). Ayrıca bazı uç noktaları AI/LLM'e ait olarak manuel biçimde işaretleyebilirsiniz. Bu makalede otomatik ve manuel AI keşfi açıklanmaktadır.

## AI/LLM'nin otomatik etiketlenmesi {#automatic-tagging-of-aillm}

API Discovery, yeni bir uç noktayı keşfederken bu uç noktanın potansiyel olarak bu hassas iş akışına ait olup olmadığını kontrol eder ve öyleyse onu **AI/LLM** etiketiyle işaretleyerek, uç noktaları **AI/LLM** hassas iş akışına ait olarak otomatik biçimde etiketler.

![API Discovery'de Agentic AI uç noktaları](../images/agentic-ai-protection/agentic-ai-in-api-discovery.png)

<!--Automatic checks are conducted using keywords from the endpoint URL. For AI/LLM, keywords like `TBD`, `TBD` automatically associate the endpoint with the **AI/LLM** flow. If matches are detected, the endpoint is automatically assigned to the appropriate flow.-->

Otomatik etiketleme, **AI/LLM** uç noktalarının çoğunu bulur. Ancak, aşağıdaki bölümde açıklandığı gibi, bir uç noktayı AI/LLM olarak manuel biçimde işaretlemek de mümkündür.

## AI/LLM uç noktalarını manuel etiketleme

[Otomatik etiketleme](#automatic-tagging-of-aillm) sonuçlarını ayarlamak için, gerekli uç noktalara **AI/LLM** etiketini manuel olarak manuel olarak ekleyebilir veya kaldırabilirsiniz.

Bunu yapmak için, Wallarm Console içinde API Discovery bölümüne gidin, ardından uç noktanız için **Business flow & sensitive data** alanında `AI/LLM` seçin.

## AI/LLM uç noktalarını görüntüleme

Uç noktalar **AI/LLM** hassas iş akışı etiketiyle atandığında, yalnızca bunları göstermeyi seçebilirsiniz. Bunu yapmak için, **Business flow** filtresini `AI/LLM` olarak ayarlayın.

## AI/LLM uç noktaları için özel koruma politikaları oluşturma (geliştirme aşamasında)

AI/LLM uç noktanızın detay sayfasından doğrudan genel koruma kuralları oluşturabilirsiniz. Ayrıca buradan, yalnızca AI/LLM için (**geliştirme aşamasında**) özel koruma politikaları oluşturabilirsiniz.

## Sessions içinde AI/LLM iş akışları

Wallarm'ın [API Sessions](../api-sessions/overview.md) özelliği, size kullanıcı aktivitelerinin tam sırasını sağlar ve böylece kötü amaçlı aktörlerin mantığına daha fazla görünürlük kazandırır. Eğer bir oturumun istekleri, API Discovery içinde **AI/LLM** olarak etiketlenen uç noktaları etkiliyorsa, bu oturum da otomatik olarak **AI/LLM** iş akışını etkiliyor olarak etiketlenir.

Oturumlar **AI/LLM** hassas iş akışı etiketiyle atandığında, yalnızca AI/LLM uç noktalarına dokunan oturumları seçmek mümkün olur. Bunu yapmak için, **Business flow** filtresini `AI/LLM` olarak ayarlayın.

![Agentic AI uç noktalarına dokunan API Sessions](../images/agentic-ai-protection/agentic-ai-in-api-sessions.png)