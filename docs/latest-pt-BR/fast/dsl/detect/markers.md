# Como a Fase de Detecção Funciona com Marcadores
Os marcadores são instrumentos úteis que permitem verificar se uma vulnerabilidade é explorada pela solicitação de teste. Os marcadores podem ser inseridos na maioria dos parâmetros da seção de detecção.

Atualmente, as extensões FAST suportam os seguintes marcadores:
* O marcador de string `STR_MARKER` é uma string que consiste em símbolos aleatórios. 
    
    Ao transferir o `STR_MARKER` como parte da carga útil, detectá-lo na resposta pode significar que o ataque ao aplicativo de destino foi bem-sucedido.
    
    Por exemplo, o fato de o `alert` estar presente na marcação HTML da resposta do servidor não significa necessariamente que o aplicativo possui a vulnerabilidade. O servidor pode gerar o `<alert>` por conta própria. A presença do `alert` (`STR_MARKER`) na resposta significa que esta é a resposta à solicitação de teste que contém a carga útil que inclui o marcador de string (ou seja, a exploração da vulnerabilidade foi bem-sucedida). 
    
    O marcador de string é usado principalmente para explorar vulnerabilidades XXS.

* O `CALC_MARKER` numérico é uma expressão aritmética que pode ser calculada durante a exploração de vulnerabilidades.  
    
    Ao transferir o `CALC_MARKER` como parte da carga útil, detectar o resultado da expressão calculada na resposta pode significar que o ataque ao aplicativo de destino foi bem-sucedido.
    
    O numérico é usado principalmente para explorar vulnerabilidades RCE.

* O `DNS_MARKER` é um nome de domínio gerado aleatoriamente, como `abc123.wlrm.tl`. O aplicativo de destino pode tentar resolver este nome em um endereço IP.
    
    Ao transferir o `DNS_MARKER` como parte da carga útil, detectar a solicitação DNS para o nome de domínio gerado pode significar que o ataque ao aplicativo de destino foi bem-sucedido.