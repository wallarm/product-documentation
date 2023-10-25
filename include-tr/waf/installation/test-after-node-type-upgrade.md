Uygulama adresine test [Path Traversal][ptrav-attack-docs] saldırısı ile talep gönderin:

```
curl http://localhost/etc/passwd
```

Yeni tip düğümün talebi aynı şekilde işlediğinden emin olun, yani:

* Uygun [filtrasyon modu][waf-mode-instr] yapılandırılmışsa talebi engeller.
* Yapılandırılmışsa [özel engelleme sayfası][blocking-page-instr] döndürür.

Wallarm Konsolu → **Etkinlikler** menüsünü [EU Cloud](https://my.wallarm.com/search) veya [US Cloud](https://us1.my.wallarm.com/search) açın ve emin olun ki:

* Saldırı, listeye eklenmiştir.
* İsabet detayları, Wallarm düğüm UUID'sini gösterir.

    ![Arayüzdeki saldırılar][attacks-in-ui-image]