[img-test-scheme]:                  ../../images/fast/qsg/en/test-preparation/12-qsg-fast-test-prep-scheme.png
[img-google-gruyere-startpage]:     ../../images/fast/qsg/common/test-preparation/13-qsg-fast-test-prep-gruyere.png
[img-policy-screen]:                ../../images/fast/qsg/common/test-preparation/14-qsg-fast-test-prep-policy-screen.png
[img-wizard-general]:               ../../images/fast/qsg/common/test-preparation/15-qsg-fast-test-prep-policy-wizard-general.png
[img-wizard-insertion-points]:      ../../images/fast/qsg/common/test-preparation/16-qsg-fast-test-prep-policy-wizard-ins-points.png

[link-previous-chapter]:            deployment.md
[link-https-google-gruyere]:        https://google-gruyere.appspot.com
[link-https-google-gruyere-start]:  https://google-gruyere.appspot.com/start
[link-wl-console]:                  https://us1.my.wallarm.com

[doc-policy-in-detail]:             ../operations/test-policy/overview.md

[gl-element]:                       ../terms-glossary.md#baseline-request-element
[gl-testpolicy]:                    ../terms-glossary.md#test-policy

[anchor1]:  #1-prepare-the-baseline-request                       
[anchor2]:  #2-create-a-test-policy-targeted-at-xss-vulnerabilities

# Configurando o ambiente para testes

Este capítulo irá guiá-lo pelo processo de configurar o FAST para detectar vulnerabilidades XSS na aplicação Google Gruyere. Ao término de todos os passos necessários, você estará pronto para passar uma solicitação de referência HTTPS através do nó FAST para encontrar vulnerabilidades XSS.

Para gerar um conjunto de teste de segurança, o Wallarm FAST requer o seguinte:
* Um nó FAST implantado, passando solicitações de referência
* Uma conexão do nó FAST à nuvem Wallarm
* Uma solicitação de referência
* Uma política de teste

Você implantou com sucesso um nó FAST e o conectou à nuvem no [capítulo anterior][link-previous-chapter]. Neste capítulo, você se concentrará na criação de uma política de [teste][gl-testpolicy] e de uma solicitação de referência.

![O esquema de teste em uso][img-test-scheme]

!!! info "Criando uma política de teste"
    É altamente recomendável que você crie uma política dedicada para cada aplicação alvo sob o teste. No entanto, você pode fazer uso da política padrão que é automaticamente criada pela nuvem Wallarm. Este documento irá guiá-lo no processo de criação de uma política dedicada, enquanto a política padrão está fora do escopo deste guia.
    
Para configurar o ambiente para testes, faça o seguinte:

1. [Prepare a solicitação de referência][anchor1]
2. [Crie a política de teste direcionada às vulnerabilidades XSS][anchor2]

!!! info "Aplicação alvo"
    O exemplo atual usa [Google Gruyere][link-https-google-gruyere] como a aplicação alvo. Se você construir a solicitação de referência para a sua aplicação local, por favor use o endereço IP da máquina que executa esta aplicação em vez do endereço do Google Gruyere.
    
    Para obter o endereço IP, você pode usar ferramentas como `ifconfig` ou `ip addr`.

##  1.  Preparar a solicitação de referência

1.   Como a solicitação de referência fornecida é direcionada para a aplicação [Google Gruyere][link-https-google-gruyere], você deve criar primeiro uma instância isolada da aplicação. Em seguida, você deve obter um identificador único da instância.
    
    Para isso, navegue até este [link][link-https-google-gruyere-start]. Será fornecido o identificador da instância do Google Gruyere, que você deve copiar. Leia os termos de serviço e selecione o botão **Concordar & Iniciar**.

    ![Página inicial do Google Gruyere][img-google-gruyere-startpage]

    Será executada a instância isolada do Google Gruyere. Ela será acessível por você através do seguinte endereço:
    
    `https://google-gruyere.appspot.com/<seu ID da instância>/`

2.  Construa a solicitação de referência para a sua instância da aplicação Google Gruyere. É sugerido no guia que você utilize uma solicitação legítima.

    A solicitação é a seguinte:

    ```
    https://google-gruyere.appspot.com/<seu ID da instância>/snippets.gtl?password=paSSw0rd&uid=123
    ```

    !!! info "Exemplo de uma solicitação"
        <https://google-gruyere.appspot.com/430232491618310677730226710602783767322/snippets.gtl?password=paSSw0rd&uid=123>

##  2.  Criar uma política de teste direcionada às vulnerabilidades XSS

1.  Faça login no [portal My Wallarm][link-wl-console] utilizando a conta que você criou [anteriormente][link-previous-chapter].

2.  Selecione a guia “Políticas de teste” e clique no botão **Criar política de teste**.

    ![Criação de política de teste][img-policy-screen]

3.  Na guia “Geral”, defina um nome e descrição significativos para a política. É sugerido neste guia que você use o nome `DEMO POLICY`. 

    ![Assistente de política de teste: guia “Geral”.][img-wizard-general]

4.  Na guia “Pontos de inserção”, defina os [elementos da solicitação de referência][gl-element] que são elegíveis para processamento durante o processo de geração de solicitações do conjunto de testes de segurança. São suficientes para os fins deste guia permitir o processamento de todos os parâmetros GET. Para permitir isso, adicione a expressão `GET_.*` no bloco “Onde incluir”. Ao criar uma política, o FAST permite o processamento de alguns parâmetros por padrão. Você pode excluí-los usando o símbolo «—».

    ![Assistente de política de teste: guia “Pontos de inserção”.][img-wizard-insertion-points]

5.  Na guia “Ataques a testar”, selecione um tipo de ataque para explorar a vulnerabilidade na aplicação alvo — XSS.

6.  Certifique-se de que a pré-visualização da política na coluna à extrema direita está da seguinte forma:

    ```
    X-Wallarm-Test-Policy: 
    type=xss; 
    insertion=include:'GET_.*'; 
    ```

7.  Selecione o botão **Salvar** para salvar a política.

8.  Volte à lista de políticas de teste ao selecionar o botão **Voltar para políticas de teste**.

!!! info "Detalhes da política de teste"
    Informações detalhadas sobre políticas de teste estão disponíveis pelo [link][doc-policy-in-detail].

Agora, você deve ter completado todos os objetivos do capítulo, com a solicitação de referência HTTPS para a aplicação Google Gruyere e a política de teste direcionada às vulnerabilidades XSS.