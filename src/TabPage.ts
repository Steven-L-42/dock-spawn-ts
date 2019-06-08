import { TabHandle } from "./TabHandle.js";
import { PanelContainer } from "./PanelContainer.js";
import { IDockContainer } from "./interfaces/IDockContainer.js";
import { TabHost } from "./TabHost.js";

export class TabPage {

    selected: boolean;
    host: TabHost;
    container: IDockContainer;
    panel?: PanelContainer;
    handle: TabHandle;
    containerElement: HTMLElement;
    _initContent: boolean;

    constructor(host: TabHost, container: IDockContainer) {
        if (arguments.length === 0) {
            return;
        }

        this.selected = false;
        this.host = host;
        this.container = container;

        this.handle = new TabHandle(this);
        this.containerElement = container.containerElement;

        if (container instanceof PanelContainer) {
            this.panel = container;
            this.panel.onTitleChanged = this.onTitleChanged.bind(this);
        }
    }

    onTitleChanged(/*sender, title*/) {
        this.handle.updateTitle();
    }

    destroy() {
        this.handle.destroy();

        if (this.container instanceof PanelContainer) {
            let panel = this.container;
            delete panel.onTitleChanged;
        }
    }

    onSelected() {
        this.host.onTabPageSelected(this);
        if (this.container instanceof PanelContainer) {
            let panel = this.container;
            panel.dockManager.notifyOnTabChange(this);
        }

    }

    setSelected(flag: boolean) {
        this.selected = flag;
        this.handle.setSelected(flag);

        if (!this._initContent)
            this.host.contentElement.appendChild(this.containerElement);
        this._initContent = true;
        if (this.selected) {
            this.containerElement.style.display = 'block';
            // force a resize again
            let width = this.host.contentElement.clientWidth;
            let height = this.host.contentElement.clientHeight;
            this.container.resize(width, height);
            this.host.dockManager.activePanel = this.container as PanelContainer;
        }
        else {
            this.containerElement.style.display = 'none';
        }
    }

    resize(width: number, height: number) {
        this.container.resize(width, height);
    }
}