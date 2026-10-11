import type { BubbleConfig } from "../../domain/entities/BubbleConfig";
import type { OverlayRepository } from "../../domain/repositories/OverlayRepository";
import { OverlayNativeDataSource } from "../datasources/OverlayNativeDataSource";
export class OverlayRepositoryImpl implements OverlayRepository {
  constructor(private source = new OverlayNativeDataSource()) {}
  getStatus() {
    return this.source.getStatus();
  }
  start(c: BubbleConfig) {
    return this.source.start(c);
  }
  update(c: BubbleConfig) {
    return this.source.update(c);
  }
  stop() {
    return this.source.stop();
  }
}
