* Acesso à conta com a função de **Administrador** no Console Wallarm para a [Nuvem dos EUA](https://us1.my.wallarm.com/) ou [Nuvem da UE](https://my.wallarm.com/).
* Sistemas operacionais suportados:

    * Debian 10, 11 e 12.x
    * Ubuntu LTS 18.04, 20.04, 22.04
    * CentOS 7, 8 Stream, 9 Stream
    * Alma/Rocky Linux 9
    * RHEL 8.x
    * Oracle Linux 8.x
    * Redos
    * SuSe Linux
    * Outros (a lista está sempre se expandindo, contate a [equipe de suporte Wallarm](mailto:support@wallarm.com) para verificar se o seu sistema operacional está na lista )
    
* Acesso a `https://meganode.wallarm.com` para baixar o instalador completo Wallarm. Certifique-se de que o acesso não está bloqueado por um firewall.
* Acesso a `https://us1.api.wallarm.com` para trabalhar com a Nuvem Wallarm dos EUA ou a `https://api.wallarm.com` para trabalhar com a Nuvem Wallarm da UE. Se o acesso só pode ser configurado via servidor proxy, então use as [instruções][configure-proxy-balancer-instr].
* Acesso aos endereços IP do Google Cloud Storage listados dentro do [link](https://www.gstatic.com/ipranges/goog.json). Quando você permite, nega ou lista cinza países inteiros, regiões ou centros de dados em vez de endereços IP individuais, o nó Wallarm recupera endereços IP precisos relacionados às entradas nas listas de IP do banco de dados agregado hospedado no Google Storage.
* Execução de todos os comandos como um superusuário (por exemplo, `root`).