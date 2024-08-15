import { App } from "vue";
import NavBar from "./components/NavBar.vue";
import { toKebabCase } from "./utils";
import PageTitle from "./components/PageTitle.vue";
import Card from "./components/Card.vue";
import ChartBuilder from "./components/ChartBuilder.vue";
import Chart from "./components/Chart.vue";
import DraggableItem from "./components/DraggableItem.vue";
import Dropdown from "./components/Dropdown.vue";
import HListView from "./components/HListView.vue";
import DropZone from "./components/DropZone.vue";
import Loader from "./components/Loader.vue";
import Modal from "./components/Modal.vue";
import DrillThrough from "./components/DrillThrough.vue";

export function registerGlobalComponents(app: App<Element>) {
  const components = {
    NavBar,
    PageTitle,
    Card,
    ChartBuilder,
    Chart,
    DraggableItem,
    Dropdown,
    HListView,
    DropZone,
    Loader,
    Modal,
    DrillThrough,
  };

  Object.entries(components).forEach(([name, component]) => {
    app.component(toKebabCase(name), component);
  });
}
