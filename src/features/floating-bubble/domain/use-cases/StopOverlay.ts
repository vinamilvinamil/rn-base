import type { OverlayRepository } from '../repositories/OverlayRepository'; export class StopOverlay { constructor(private repo: OverlayRepository) {} execute() { return this.repo.stop(); } }
