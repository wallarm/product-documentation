[img-gsuite-sso-provider-wl]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-sso-provider-wl.png
[img-sp-metadata]:              ../../../../images/admin-guides/configuration-guides/sso/gsuite/sp-metadata.png

[doc-setup-idp]:                setup-idp.md

#   Passo 1: Gerar Parâmetros no Lado do Wallarm (G Suite)

Para conectar o SSO G Suite, você primeiro precisará gerar alguns parâmetros no lado do Wallarm.

!!! warning "Ative primeiro o serviço SSO no lado do Wallarm"
    Por padrão, a conexão SSO no Wallarm não está disponível sem a ativação do serviço apropriado. Para ativar o serviço SSO, entre em contato com o gerente de sua conta ou com a [equipe de suporte do Wallarm](mailto:support@wallarm.com).

    Depois de ativar o serviço, você será capaz de realizar o seguinte procedimento de conexão SSO. 

Faça o login no Console Wallarm usando sua conta de Administrador e prossiga com a configuração de integração da G Suite seguindo **Settings → Integration → Google SSO**.

![Bloco “Google SSO”][img-gsuite-sso-provider-wl]

Isso abrirá o assistente de configuração SSO. No primeiro passo do assistente, você receberá um formulário com os parâmetros (metadados do provedor de serviço) que devem ser passados ​​para o serviço G Suite:
*   **Wallarm Entity ID** é um identificador único de aplicação gerado pela aplicação Wallarm para o provedor de identidade.
*   **URL do serviço de recepção de afirmações (ACS URL)** é o endereço no lado do Wallarm da aplicação no qual o provedor de identidade envia solicitações com o parâmetro SamlResponse.

![Metadados do provedor de serviço][img-sp-metadata]

Os parâmetros gerados precisarão ser inseridos nos campos correspondentes no lado do serviço G Suite (veja [Passo 2][doc-setup-idp]).