export abstract class QueueMenager<MapKey, QueueType> {
	protected queue: Map<MapKey, QueueType[]>;
  
	constructor() {
		this.queue = new Map<MapKey, QueueType[]>();
	}
  
  abstract getFromQueue(mapKey: MapKey): QueueType[] | undefined;

  abstract addInQueue(mapKey: MapKey, data: QueueType): void;

  abstract deleteFromQueue(mapKey: MapKey, QueueTypeIndex: number, ...indexIn: number[]): void
}