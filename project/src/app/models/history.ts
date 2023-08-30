export class History {
  public id: number;
  public entry: string;
  public type: string;
  public entry_Date: Date;

  constructor(id: number, type: string, entry: string, entry_Date: Date) {
    this.id = id;
    this.entry = entry;
    this.type = type;
    this.entry_Date = entry_Date;
  }
}