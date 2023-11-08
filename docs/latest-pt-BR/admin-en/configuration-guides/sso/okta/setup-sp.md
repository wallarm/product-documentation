[img-okta-sso-provider-wl]:     ../../../../images/admin-guides/configuration-guides/sso/okta/okta-sso-provider-wl.png
[img-sp-metadata]:              ../../../../images/admin-guides/configuration-guides/sso/okta/sp-metadata.png

[doc-setup-idp]:                setup-idp.md

# Passo 1: Geração de Parâmetros do lado do Wallarm (Okta)

Para conectar SSO com Okta, primeiro você precisará gerar alguns parâmetros do lado do Wallarm.

!!! aviso "Ative o serviço SSO no lado do Wallarm primeiro"
    Por padrão, a conexão SSO no Wallarm não está disponível sem a ativação do serviço apropriado. Para ativar o serviço SSO, entre em contato com o seu gerente de contas ou com a [equipe de suporte do Wallarm](mailto:support@wallarm.com).

    Após a ativação do serviço, você poderá realizar o seguinte procedimento de conexão SSO.

Faça login no Console Wallarm usando sua conta de Administrador e prossiga para a configuração de integração Okta seguindo **Configurações → Integração → Okta SSO**.

![O bloco "Okta SSO"][img-okta-sso-provider-wl]

Isso abrirá o assistente de configuração SSO. No primeiro passo do assistente, será apresentado um formulário com os parâmetros (metadados do provedor de serviço) que devem ser passados para o serviço Okta:
*   **ID da entidade Wallarm** é um identificador de aplicação único gerado pelo aplicativo Wallarm para o prestador de identidade.
*   **URL do Serviço de Consumo de Assertiva (ACS URL)** é o endereço do aplicativo do lado do Wallarm onde o provedor de identidade envia solicitações com o parâmetro SamlResponse.

![Metadados do provedor de serviço][img-sp-metadata]

Os parâmetros gerados precisarão ser inseridos nos campos correspondentes no lado do serviço Okta (veja [Passo 2][doc-setup-idp]).