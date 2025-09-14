Wallarm node'da isteklerin işlenmesi iki aşamaya ayrılır:

* NGINX-Wallarm modülünde birincil işleme. Bu işlem bellek açısından yoğun değildir ve sunucu gereksinimlerini değiştirmeden ön uç sunucularına yerleştirilebilir.
* postanalytics modülünde işlenen isteklerin istatistiksel analizi. Postanalytics bellek açısından yoğundur; bu, sunucu yapılandırmasında değişiklik yapılmasını veya postanalytics'in ayrı bir sunucuya kurulmasını gerektirebilir.

Sistem mimarisine bağlı olarak, NGINX-Wallarm ve postanalytics modülleri **aynı sunucuya** veya **farklı sunuculara** kurulabilir.