=== "ABD Cloud"
    ```bash
    curl 'https://us1.api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <JETONUNUZ>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<MUSTERI_IDNIZ>,"ip_rule":{"list":"<IP_LISTESININ_TURU>","rule_type":"country","source_values":[<ULKELER_BOLGELER_DIZISI>],"pools":[<UYGULAMA_IDLERI_DIZISI>],"expired_at":"<KALDIRMA_TARIHI_ZAMAN_DAMGASI>","reason":"<LISTEYE_GIRDILERI_EKLEME_NEDENI>"},"force":false}'
    ```
=== "AB Cloud"
    ```bash
    curl 'https://api.wallarm.com/v4/ip_rules' \
      -H 'X-WallarmApi-Token: <JETONUNUZ>' \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      --data-raw '{"clientid":<MUSTERI_IDNIZ>,"ip_rule":{"list":"<IP_LISTESININ_TURU>","rule_type":"country","source_values":[<ULKELER_BOLGELER_DIZISI>],"pools":[<UYGULAMA_IDLERI_DIZISI>],"expired_at":"<KALDIRMA_TARIHI_ZAMAN_DAMGASI>","reason":"<LISTEYE_GIRDILERI_EKLEME_NEDENI>"},"force":false}'
    ```