### E-posta

Bulunan hostlar ve güvenlik sorunları hakkında, otomatik olarak kişisel e-postanıza (oturum açmak için kullandığınız) bildirimler alırsınız; bunlar şunları içerir:

* **Günlük kritik güvenlik sorunları (yalnızca yeni)** - gün içinde açılan tüm [kritik][link-aasm-security-issue-risk-level] güvenlik sorunları, her sorun için ayrıntılı açıklama ve nasıl giderileceğine dair talimatlarla birlikte günde bir kez gönderilir.
* **Günlük güvenlik sorunları (yalnızca yeni)** - gün içinde açılan güvenlik sorunlarına ilişkin istatistikler; her [risk düzeyi][link-aasm-security-issue-risk-level] için kaç sorun bulunduğu bilgisi ve gidermeye yönelik genel eylem maddeleriyle birlikte günde bir kez gönderilir.
* **Haftalık AASM istatistikleri** - son hafta içinde yapılandırdığınız alan adlarında keşfedilen hostlar, API’ler ve güvenlik sorunlarına ilişkin istatistikler hakkında bilgi.

Bildirimler varsayılan olarak etkindir. İstediğiniz anda abonelikten çıkabilir ve Wallarm Console → Configuration → Integrations → Email and messengers → Personal email (sizin e-postanız) veya Email report (ek e-postalar) bölümünden bu bildirimlerin tamamını ya da bir kısmını alacak ek e-postaları yapılandırabilirsiniz; ayrıntılar [burada][link-integrations-email] açıklanmıştır.

### Anlık bildirim

Yeni ve yeniden açılan güvenlik sorunları için anlık bildirim yapılandırabilirsiniz. Bildirim tetiklediğinde seçilecek risk düzeylerinin tümünü veya yalnızca bazılarını belirleyin. Her güvenlik sorunu için ayrı bir mesaj gönderilir.

Örnek:

```
[Wallarm System] Yeni güvenlik sorunu tespit edildi
Bildirim türü: security_issue
Sisteminizde yeni bir güvenlik sorunu tespit edildi.
ID: 106279
Başlık: Zafiyet içeren Nginx sürümü: 1.14.2
Host: <HOST_WITH_ISSUE>
Yol:
Port: 443
URL: <URL_WITH_ISSUE>
Yöntem:
Tespit eden: AASM
Parametre:
Tür: Zafiyet barındıran bileşen
Risk: Orta
Daha fazla bilgi: 
Müşteri: <YOUR_COMPANY_NAME>
Bulut: US
```

Güvenlik sorunları için anlık bildirimi, Wallarm Console → Configuration → Integrations → YOUR_INTEGRATION yolunu izleyerek [entegrasyonunuz][link-integrations-intro] dokümantasyonunda açıklandığı şekilde yapılandırabilirsiniz.