export abstract class QueueMenager<MapKey, QueueType> {
	protected queue: Map<MapKey, QueueType[]>;
  
	constructor() {
		this.queue = new Map<MapKey, QueueType[]>();
	}
  
  abstract getAllFromQueue(mapKey: MapKey): QueueType[] | undefined;

	abstract addInQueue(mapKey: MapKey, data: QueueType): void;
	
	abstract clearQueue(): void
}