import "./styles.css";
import { pipelineStages, renderPipeline, ticket } from "./pipeline";

export function bootstrap(): void {
  const root = document.getElementById("app");
  if (root) {
    root.innerHTML = renderPipeline(pipelineStages, ticket);
  }
}

if (typeof document !== "undefined") {
  bootstrap();
}
