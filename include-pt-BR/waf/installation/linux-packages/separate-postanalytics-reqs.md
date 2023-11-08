* Acesso à conta com a função **Administrador** e autenticação em duas etapas desativada na Console Wallarm para o [US Cloud](https://us1.my.wallarm.com/) ou [EU Cloud](https://my.wallarm.com/)
* SELinux desativado ou configurado de acordo com as [instruções][configure-selinux-instr]
* Execução de todos os comandos como superusuário (por exemplo, `root`)
* Acesso a `https://repo.wallarm.com` para baixar pacotes. Certifique-se de que o acesso não está bloqueado por um firewall
* Acesso a `https://us1.api.wallarm.com` se estiver trabalhando com o Wallarm Cloud dos EUA ou a `https://api.wallarm.com` se estiver trabalhando com o Wallarm Cloud da UE. Se o acesso só pode ser configurado via servidor proxy, então use as [instruções][configure-proxy-balancer-instr]
* Editor de texto instalado **vim**, **nano** ou qualquer outro. Nos comandos neste artigo, é usado o **vim**