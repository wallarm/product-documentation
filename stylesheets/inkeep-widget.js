// Inkeep AI Chat Button and Search Bar Integration for MkDocs
// Docs: https://docs.inkeep.com/cloud/integrations/mkdocs/chat-button-and-search-bar

document.addEventListener("DOMContentLoaded", () => {
  // Inkeep Configuration
  const INKEEP_API_KEY = 'c5b01085a517e4659ba4bf32d60b3f69f47b65a13ccb03df';
  const INKEEP_ORG_ID = 'org_W935PZxFwn0un80v';
  const INKEEP_INTEGRATION_ID = 'cm8l4jq0s00rxs601d7b8tkbh';
  const ORGANIZATION_NAME = 'Wallarm';
  const PRIMARY_BRAND_COLOR = '#FC7303';
  const BOT_AVATAR_URL = 'https://cdn.prod.website-files.com/5fe3434623c64c793987363d/6006cb97f71f76f8a5e85a32_Frame%201923.png';

  // Load Inkeep script
  const inkeepScript = document.createElement("script");
  inkeepScript.src = "https://cdn.jsdelivr.net/npm/@inkeep/cxkit-js@0.5.113/dist/embed.js";
  inkeepScript.type = "module";
  inkeepScript.defer = true;
  document.head.appendChild(inkeepScript);

  // Base configuration
  const baseConfig = {
    baseSettings: {
      apiKey: INKEEP_API_KEY,
      organizationId: INKEEP_ORG_ID,
      integrationId: INKEEP_INTEGRATION_ID,
      primaryBrandColor: PRIMARY_BRAND_COLOR,
      organizationDisplayName: ORGANIZATION_NAME,
      colorMode: {
        sync: {
          target: document.body,
          attributes: ['data-md-color-scheme'],
          isDarkMode: (attributes) => attributes['data-md-color-scheme'] === 'slate'
        }
      },
      theme: {
        fontSize: {
          '3xs': '0.36rem',
          '2xs': '0.5rem',
          xs: '0.6rem',
          '1sm': '0.65rem',
          sm: '0.7rem',
          '2sm': '0.75rem',
          md: '0.8rem',
          lg: '0.9rem',
          xl: '1rem',
          '2xl': '1.2rem',
          '3xl': '1.5rem',
          '4xl': '1.8rem',
          '5xl': '2.4rem',
          '6xl': '3rem',
          '7xl': '3.6rem',
          '8xl': '4.8rem',
          '9xl': '6.4rem',
        },
        spacing: {
          '0': '0px',
          px: '1px',
          '0.5': '0.1rem',
          '1': '0.2rem',
          '1.5': '0.3rem',
          '2': '0.4rem',
          '2.5': '0.5rem',
          '3': '0.6rem',
          '3.5': '0.7rem',
          '4': '0.8rem',
          '5': '1rem',
          '6': '1.2rem',
          '7': '1.4rem',
          '8': '1.6rem',
          '9': '1.8rem',
          '10': '2rem',
          '11': '2.2rem',
          '12': '2.4rem',
          '14': '2.8rem',
          '16': '3.2rem',
          '20': '4rem',
          '24': '4.8rem',
          '28': '5.6rem',
          '32': '6.4rem',
          '36': '7.2rem',
          '40': '8rem',
          '44': '8.8rem',
          '48': '9.6rem',
          '52': '10.4rem',
          '56': '11.2rem',
          '60': '12rem',
          '64': '12.8rem',
          '72': '14.4rem',
          '80': '16rem',
          '96': '19.2rem',
        },
        borderRadius: {
          none: '0px',
          sm: '0.1rem',
          DEFAULT: '0.2rem',
          md: '0.3rem',
          lg: '0.4rem',
          xl: '0.6rem',
          '2xl': '0.8rem',
          '3xl': '1.2rem',
          full: '9999px',
        },
      }
    },
    modalSettings: {},
    searchSettings: {},
    aiChatSettings: {
      chatSubjectName: 'Wallarm',
      botAvatarSrcUrl: BOT_AVATAR_URL,
      exampleQuestions: [
        'I want to discover all my APIs and AI agents',
        'I need to protect my APIs from attacks',
        'I want to test my APIs for vulnerabilities',
        'How do I deploy Wallarm protection?'
      ]
    }
  };

  inkeepScript.addEventListener("load", () => {
    // Initialize the Chat Button (floating button)
    Inkeep.ChatButton(baseConfig);

    // Initialize Modal for custom trigger (Ask AI button)
    const modalWidget = Inkeep.ModalChat({
      ...baseConfig,
      modalSettings: {
        isOpen: false,
        onOpenChange: (isOpen) => {
          modalWidget.update({ modalSettings: { isOpen } });
        }
      }
    });

    // Expose function to open the modal
    window.openInkeepChat = function() {
      modalWidget.update({ modalSettings: { isOpen: true } });
    };
  });
});
