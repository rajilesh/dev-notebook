
      try {
        //
        const theme = window.localStorage.getItem("excalidraw-theme");
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        }
      } catch {}


      window.EXCALIDRAW_ASSET_PATH = "/";
      // setting this so that libraries installation reuses this window tab.
      window.name = "_excalidraw";