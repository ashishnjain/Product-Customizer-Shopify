async function installThemeAppExtension(client) {
  try {
    // Get all themes
    const themes = await client.get({
      path: 'themes',
    });

    // Get active theme
    const activeTheme = themes.body.themes.find(theme => theme.role === 'main');

    // Add app block to theme
    await client.put({
      path: `themes/${activeTheme.id}/assets`,
      data: {
        asset: {
          key: "templates/product.json",
          value: JSON.stringify({
            sections: {
              main: {
                type: "main-product",
                blocks: {
                  product_customizer: {
                    type: "@app"
                  }
                }
              }
            }
          })
        }
      }
    });

  } catch (error) {
    console.error('Error installing theme app extension:', error);
  }
} 