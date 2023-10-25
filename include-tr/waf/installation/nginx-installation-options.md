Wallarm düğümündeki taleplerin işlenmesi iki aşamaya ayrılır:

* NGINX-Wallarm modülünde birincil işleme. İşleme hafıza talep etmez ve sunucu gereksinimlerini değiştirmeden önyüz sunucularına konabilir.
* Postanalytics modülünde işlenen taleplerin istatistiksel analizi. Postanalytics, hafıza talep ettiği için sunucu yapılandırmasında değişiklikler yapılmasını veya postanalytic'in ayrı bir sunucuya kurulmasını gerektirebilir.

Sistem mimarisine bağlı olarak, NGINX-Wallarm ve postanalytics modülleri **aynı sunucuya** veya **farklı sunuculara** kurulabilir.
