import "./App.css";
import "xp.css/dist/xp.css";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("tab-A");

  

  const handleQuit = async () => {
    await invoke('quit');
  };

  const handleMinimize = async () => {
    await invoke('minimize');
  };

  const handleMaximize = async () => {
    await invoke('maximize');
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="window" style={{ height: '100vh', userSelect: 'none', width: '100vw', margin: 0, borderRadius: 0 }}>
      <div className="title-bar" style={{ userSelect: 'none' }} data-tauri-drag-region>
        <div className="title-bar-text" style={{ userSelect: 'none' }}>MacXP</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={handleMinimize}></button>
          <button aria-label="Maximize" onClick={handleMaximize}></button>
          <button aria-label="Close" onClick={handleQuit}></button>
        </div>
      </div>
      <div className="window-body" style={{ margin: 0 }}>
        <section className="tabs" style={{ maxWidth: '100%', margin: '10px' }}>
          <menu role="tablist" aria-label="Sample Tabs">
            <button 
              role="tab" 
              aria-selected={activeTab === "tab-A"} 
              aria-controls="tab-A"
              onClick={() => handleTabClick("tab-A")}
            >
              Tab 1
            </button>
            <button 
              role="tab" 
              aria-selected={activeTab === "tab-B"} 
              aria-controls="tab-B"
              onClick={() => handleTabClick("tab-B")}
            >
              Tab 2
            </button>
            <button 
              role="tab" 
              aria-selected={activeTab === "tab-C"} 
              aria-controls="tab-C"
              onClick={() => handleTabClick("tab-C")}
            >
              Tab 3
            </button>
          </menu>
          <article role="tabpanel" id="tab-A" hidden={activeTab !== "tab-A"}>
              <h3>This is tab 1</h3>
              <p>
                Hi this is tab 1 
            </p>
          </article>
          <article role="tabpanel" id="tab-B" hidden={activeTab !== "tab-B"}>
          <h3>This is tab 2</h3>
            <p>
              Hi this is tab 2 
            </p>
          </article>
          <article role="tabpanel" id="tab-C" hidden={activeTab !== "tab-C"}>
            <h3>This is tab 3</h3>
            <p>
              Hi this is tab 3 
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}

export default App;
