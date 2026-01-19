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
  inkeepScript.src = "https://cdn.jsdelivr.net/npm/@inkeep/cxkit-js@0.5/dist/embed.js";
  inkeepScript.type = "module";
  inkeepScript.defer = true;
  document.head.appendChild(inkeepScript);

  // Configuration object
  const config = {
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
      }
    },
    modalSettings: {},
    searchSettings: {},
    aiChatSettings: {
      chatSubjectName: 'Wallarm',
      botAvatarSrcUrl: BOT_AVATAR_URL,
      quickQuestions: [
        'How to setup API Discovery?',
        'How to customize sensitive data detection?',
        'How does the Vulnerability Scanner work?',
        'How to enable JA3 fingerprinting?'
      ]
    }
  };

  inkeepScript.addEventListener("load", () => {
    // Initialize the Chat Button (floating button)
    Inkeep.ChatButton(config);
  });
});
