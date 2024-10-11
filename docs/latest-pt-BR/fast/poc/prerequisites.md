[link-wl-portal-us]:        https://us1.my.wallarm.com
[link-wl-portal-eu]:        https://my.wallarm.com    
[link-selenium]:            https://www.seleniumhq.org/

[doc-create-node]:          ../operations/create-node.md
[doc-about-token]:          ../operations/internals.md#token
[doc-integration-overview]: integration-overview.md


# Pré-requisitos para a Integração

Para habilitar a integração do FAST em um fluxo de trabalho CI/CD, você precisará de:

* Acesso ao portal Wallarm e uma conta Wallarm.
    
    If you do not have one, then contact the [Wallarm Sales Team](mailto:sales@wallarm.com) to get access.
    
* O contêiner Docker do nó FAST deve ter acesso ao servidor API Wallarm `us1.api.wallarm.com` via protocolo HTTPS (`TCP/443`)
--8<-- "../include-pt-BR/fast/cloud-note.md"

 * Permissões para criar e executar contêineres Docker para o seu fluxo de trabalho CI/CD
    
* Uma aplicação web ou API para testar quanto a vulnerabilidades (uma *aplicação alvo*)
    
    É obrigatório que essa aplicação use o protocolo HTTP ou HTTPS para comunicação.
    
    A aplicação alvo deve permanecer disponível até que a verificação de segurança FAST esteja concluída.
    
* Uma ferramenta de teste que irá testar a aplicação alvo usando solicitações HTTP e HTTPS (uma *fonte de solicitação*).
    
    Uma fonte de solicitação deve ser capaz de trabalhar com um servidor proxy HTTP ou HTTPS.
    
    [Selenium][link-selenium] é um exemplo de uma ferramenta de teste que atende os requisitos mencionados.
    
* Um ou mais [tokens][doc-about-token].
    <p id="anchor-token"></p>

    [Crie um nó FAST][doc-create-node] na nuvem Wallarm e use o token correspondente no contêiner Docker ao executar uma tarefa CI/CD.  
    
    O token será usado pelo contêiner Docker com o nó FAST durante a execução do trabalho CI/CD.

    Se você tiver vários trabalhos CI/CD sendo executados simultaneamente, crie um número apropriado de nós FAST na nuvem Wallarm.

    !!! info "Um exemplo de token"
        O valor `token_Qwe12345` é usado como um exemplo de token em todo este guia.