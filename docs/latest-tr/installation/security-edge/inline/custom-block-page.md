# Security Edge Inline içinde Engelleme Sayfası <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Security Edge Inline Node bir kötü amaçlı isteği engellediğinde, HTTP 403 Forbidden yanıtı ile birlikte biçimlendirilmiş bir engelleme sayfası döndürebilir.

!!! info "Sürüm gereksinimleri"
    Biçimlendirilmiş bir engelleme sayfasının döndürülmesi, Edge Node 5.3.16-2 sürümünden itibaren desteklenir.

## Engelleme sayfasının görünümü

Biçimlendirilmiş engelleme sayfası, isteğin engellendiğine dair kullanıcı dostu bir bildirim sağlar:

![Wallarm engelleme sayfası](../../../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

## Özel engelleme sayfasını etkinleştirme

Özel engelleme sayfası, 5.3.16-2 sürümünden itibaren varsayılan olarak etkindir.

Özelliği kontrol etmek için Wallarm Console → Security Edge → Inline → Configure → Return styled page for blocked requests bölümüne gidin.